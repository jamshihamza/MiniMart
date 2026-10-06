import { useEffect, useRef, useState } from "react";

import { StubNoticeProvider } from "./components/StubButton.js";
import { DialogHost } from "./dialogs/DialogHost.js";
import {
  STORE_NODE_STATUS_LABEL,
  interpretStoreNodeStatus,
  type StoreNodeStatus,
} from "./connectivity.js";
import { useFlow } from "./flow.js";
import { HistoryPage } from "./pages/HistoryPage.js";
import { ReturnsPage } from "./pages/ReturnsPage.js";
import { ShiftPage } from "./pages/ShiftPage.js";
import { readPreview } from "./preview.js";
import type { CartActions } from "./sale/CartPanel.js";
import { SalePage } from "./sale/SalePage.js";
import { PreviewInspector } from "./shell/PreviewInspector.js";
import { Sidebar } from "./shell/Sidebar.js";
import { TopBar, type PillModel } from "./shell/TopBar.js";
import { ScanCapture, type ScanRejection } from "./scanner-input.js";
import { probeStoreNode } from "./system-status-transport.js";

const NON_TEXT_INPUT_TYPES = new Set([
  "button",
  "checkbox",
  "color",
  "file",
  "image",
  "radio",
  "range",
  "reset",
  "submit",
]);

/** True for controls where the person types text, which a scan must never take over. */
function isTextEditingElement(element: HTMLElement): boolean {
  if (element.closest('[contenteditable=""], [contenteditable="true"]') !== null) return true;
  if (element.tagName === "TEXTAREA" || element.tagName === "SELECT") return true;
  if (element.tagName === "INPUT") {
    return !NON_TEXT_INPUT_TYPES.has((element as HTMLInputElement).type);
  }
  return element.getAttribute("role") === "textbox";
}

function describeScanRejection(rejection: ScanRejection): string {
  const reasons: Record<ScanRejection["reason"], string> = {
    TOO_LONG: "was too long",
    CONTAMINATED: "contained a shortcut or control key",
    PREFIX_MISMATCH: "did not start with the configured prefix",
    SUFFIX_MISMATCH: "did not end with the configured suffix",
  };
  return `Scan rejected: input ${reasons[rejection.reason]} (${String(rejection.length)} characters). Scan again or search manually. Nothing was added to a sale.`;
}

export function PosApp() {
  const [preview] = useState(() => readPreview(window.location.search));
  const [flow, flowActions] = useFlow(preview);
  const page = flow.page;
  const [query, setQuery] = useState(preview.query);
  // One status region for the whole shell: scanner results and "not implemented" notices.
  const [message, setMessage] = useState("");
  const [storeNodeStatus, setStoreNodeStatus] = useState<StoreNodeStatus>("checking");
  const searchRef = useRef<HTMLInputElement>(null);
  const scannerRef = useRef<ScanCapture | null>(null);
  const suppressedShortcutRef = useRef(new WeakSet<KeyboardEvent>());
  // Search text from before the current burst, or null when the burst began outside the field.
  const textBeforeScanRef = useRef<string | null>(null);
  const spaceGuardRef = useRef(false);
  const [scanCount, setScanCount] = useState(0);

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    async function refresh() {
      try {
        const result = interpretStoreNodeStatus(await probeStoreNode());
        if (active) setStoreNodeStatus(result);
      } catch {
        if (active) setStoreNodeStatus("unavailable");
      }
      if (active) timer = setTimeout(() => void refresh(), 5_000);
    }
    void refresh();
    return () => {
      active = false;
      if (timer !== undefined) clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (page !== "sale") return undefined;
    scannerRef.current ??= new ScanCapture();
    const scanner = scannerRef.current;
    const suppressed = suppressedShortcutRef.current;
    function ownsKeyboardScan(event: KeyboardEvent): boolean {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return true;
      if (target === searchRef.current) return true;
      return !isTextEditingElement(target);
    }
    function handleScannerKey(event: KeyboardEvent) {
      if (!ownsKeyboardScan(event)) {
        // Another editable control owns this keyboard input; never claim or reinterpret it.
        scanner.reset();
        return;
      }
      const inSearch = event.target === searchRef.current;
      const spaceAfterBurstKey =
        event.key === " " && !inSearch && scanner.bufferedLength(event.timeStamp) >= 1;
      if (spaceAfterBurstKey) {
        // A scanned space must not press a focused button: the click fires on key release.
        event.preventDefault();
        spaceGuardRef.current = true;
      }
      if (event.key.length === 1 && scanner.bufferedLength(event.timeStamp) === 0) {
        // A possible scan begins here. Remember the field text only when it begins in the field.
        textBeforeScanRef.current =
          inSearch && searchRef.current !== null ? searchRef.current.value : null;
      }
      const result = scanner.handleKey({
        key: event.key,
        timeStamp: event.timeStamp,
        ctrlKey: event.ctrlKey,
        altKey: event.altKey,
        metaKey: event.metaKey,
        shiftKey: event.shiftKey,
        repeat: event.repeat,
        isComposing: event.isComposing,
      });
      if (result.suppressShortcuts) suppressed.add(event);
      if (result.preventDefault) event.preventDefault();
      // Scanner characters reached the field before the scan was classified; put back what the
      // person had typed, for valid and for confidently rejected scans. A burst that began
      // elsewhere, and text in other controls, are never touched.
      const classified =
        result.scan !== undefined || (result.rejection !== undefined && result.preventDefault);
      if (classified && inSearch && textBeforeScanRef.current !== null) {
        setQuery(textBeforeScanRef.current);
      }
      if (result.scan !== undefined) {
        setScanCount((count) => count + 1);
        setMessage(
          `Scan captured (${String(result.scan.length)} characters, untrusted keyboard text). Item lookup is unavailable in this shell preview. Nothing was added to a sale.`,
        );
      } else if (result.rejection !== undefined) {
        setMessage(describeScanRejection(result.rejection));
      }
    }
    function handleScannerKeyUp(event: KeyboardEvent) {
      if (event.key === " " && spaceGuardRef.current) {
        event.preventDefault();
        spaceGuardRef.current = false;
      }
    }
    function abandonScan() {
      scanner.reset();
      spaceGuardRef.current = false;
    }
    window.addEventListener("keydown", handleScannerKey, true);
    window.addEventListener("keyup", handleScannerKeyUp, true);
    window.addEventListener("blur", abandonScan);
    document.addEventListener("visibilitychange", abandonScan);
    return () => {
      window.removeEventListener("keydown", handleScannerKey, true);
      window.removeEventListener("keyup", handleScannerKeyUp, true);
      window.removeEventListener("blur", abandonScan);
      document.removeEventListener("visibilitychange", abandonScan);
      scanner.reset();
    };
  }, [page]);

  useEffect(() => {
    function handleShellShortcut(event: KeyboardEvent) {
      if (suppressedShortcutRef.current.has(event)) return;
      if (event.key !== "F2" || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
      }
      if (page !== "sale") return;
      event.preventDefault();
      searchRef.current?.focus();
    }
    window.addEventListener("keydown", handleShellShortcut);
    return () => window.removeEventListener("keydown", handleShellShortcut);
  }, [page]);

  function showUnavailableSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Item lookup is unavailable in this shell preview. Nothing was added to a sale.");
  }

  const nodePill: PillModel =
    preview.node === "online"
      ? { label: "Store Node online", kind: "ok", title: "Simulated for visual preview" }
      : preview.node === "offline"
        ? { label: "Store Node offline", kind: "bad", title: "Simulated for visual preview" }
        : {
            label: STORE_NODE_STATUS_LABEL[storeNodeStatus],
            kind:
              storeNodeStatus === "online" ? "ok" : storeNodeStatus === "checking" ? "mute" : "bad",
            title: "Local Store Node connection",
          };
  const syncPill: PillModel =
    preview.sync === "down"
      ? {
          label: "Cloud sync unavailable · 14 queued",
          kind: "warn",
          title: "Simulated for visual preview",
        }
      : { label: "Cloud · Not checked", kind: "mute", title: "No cloud sync is implemented" };

  // Buttons that open a reference dialog or swap one fictional state for another. Nothing is
  // calculated, posted or stored (ADR 0008).
  const cartActions: CartActions = {
    onSelectCustomer: () => flowActions.openDialog("customer"),
    onClear: flowActions.clearCart,
    onDiscount: () => flowActions.openDialog("override"),
    onHold: () => flowActions.openDialog("hold"),
    onRecall: () => flowActions.openDialog("held"),
    onComplete: () => flowActions.openDialog("pay"),
    onPay: flowActions.payWith,
  };
  const dialogOpen = flow.dialog !== null;

  return (
    <StubNoticeProvider value={setMessage}>
      <div className="pos-app">
        <a className="skip-link" href="#workspace">
          Skip to workspace
        </a>
        <Sidebar
          page={page}
          locked={preview.node === "offline"}
          inert={dialogOpen}
          shiftClosing={page === "shift" && flow.shiftMode === "closing"}
          onNavigate={(id) => {
            flowActions.go(id);
            setMessage("");
          }}
        />
        <div className="pos-main" inert={dialogOpen}>
          <TopBar node={nodePill} sync={syncPill} />
          <main id="workspace" className="pos-workspace" tabIndex={-1}>
            {page === "sale" ? (
              <SalePage
                preview={preview}
                cart={flow.cart}
                customerAttached={flow.customer}
                searchRef={searchRef}
                query={query}
                onQuery={setQuery}
                onSubmit={showUnavailableSearch}
                actions={cartActions}
              />
            ) : page === "history" ? (
              <HistoryPage
                empty={preview.historyEmpty}
                detailOpen={flow.detail}
                onOpen={() => flowActions.setDetail(true)}
                onCloseDetail={() => flowActions.setDetail(false)}
                onStartReturn={() => flowActions.openDialog("permission")}
              />
            ) : page === "returns" ? (
              <ReturnsPage
                step={flow.returnStep}
                onPickSale={flowActions.pickReturnSale}
                onReview={flowActions.reviewReturn}
                onDone={() => flowActions.go("sale")}
              />
            ) : (
              <ShiftPage
                closing={flow.shiftMode === "closing"}
                onStartClose={flowActions.startClose}
                onBack={flowActions.backShift}
              />
            )}
          </main>
        </div>
        <DialogHost flow={flow} actions={flowActions} />
        <p className="status-toast" role="status" aria-live="polite">
          {message}
          {scanCount > 0 ? ` Scans captured this session: ${String(scanCount)}.` : ""}
        </p>
        <PreviewInspector current={preview} />
      </div>
    </StubNoticeProvider>
  );
}
