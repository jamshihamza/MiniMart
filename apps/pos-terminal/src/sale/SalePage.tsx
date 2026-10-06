import { RefreshCw, ServerOff, CloudOff } from "lucide-react";
import type { FormEvent, RefObject } from "react";

import { Glyph, StubButton } from "../components/StubButton.js";
import { EMPTY_TOTALS, POPULATED_TOTALS, PREVIEW_SELECTED_LINE } from "../fixtures.js";
import type { PreviewState } from "../preview.js";
import type { CartActions } from "./CartPanel.js";
import { CartPanel } from "./CartPanel.js";
import { ProductBrowser, SearchBar } from "./ProductBrowser.js";
import { NotFound, SearchResults } from "./SearchResults.js";
import type { CartState } from "../screens.js";

/** The simulated Store Node offline state of reference screen 26. Preview only. */
function OfflineOverlay() {
  return (
    <div className="overlay">
      <div role="alertdialog" aria-label="Store Node unavailable" className="overlay__card">
        <div className="overlay__row">
          <div className="overlay__icon">
            <Glyph icon={ServerOff} size={22} />
          </div>
          <div className="overlay__text">
            <span className="overlay__title">Store Node unavailable</span>
            <span className="overlay__copy">
              This register can&apos;t reach the Store Node on the store network. Checkout, history,
              returns and shift are paused until the connection returns.
            </span>
          </div>
        </div>
        <div className="overlay__facts">
          <span className="overlay__k">Last connected</span>
          <span className="overlay__v">14:28:40</span>
          <span className="overlay__k">Affects</span>
          <span className="overlay__v">Local store network (not internet or cloud sync)</span>
          <span className="overlay__k">What to check</span>
          <span className="overlay__v">
            Network cable on this register, or ask a manager to check the Store Node
          </span>
        </div>
        <div className="overlay__actions">
          <StubButton label="Connection details" className="overlay__btn">
            Connection details
          </StubButton>
          <StubButton label="Retry connection" className="overlay__btn overlay__btn--primary">
            <Glyph icon={RefreshCw} size={16} />
            Retry connection
          </StubButton>
        </div>
      </div>
    </div>
  );
}

export function SalePage({
  preview,
  cart,
  customerAttached,
  searchRef,
  query,
  onQuery,
  onSubmit,
  actions,
}: {
  readonly preview: PreviewState;
  readonly cart: CartState;
  readonly customerAttached: boolean;
  readonly searchRef: RefObject<HTMLInputElement | null>;
  readonly query: string;
  readonly onQuery: (value: string) => void;
  readonly onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  readonly actions: CartActions;
}) {
  const populated = cart === "populated" && !preview.loading;
  const offline = preview.node === "offline";
  // Reference screens 03 and 04 show a result list or a not-found card for a preset query. The
  // preview performs no lookup: these are fixed fixtures, shown only while the field still holds
  // the preset text, so editing the field returns to the product tiles.
  const showResults = preview.searchView === "results" && query === preview.query;
  const showNotFound = preview.searchView === "notfound" && query === preview.query;
  return (
    <div className="sale">
      <h1 className="sr-only">New sale</h1>
      <section className="sale__left" aria-label="Products">
        {preview.sync === "down" ? (
          <div role="note" className="cloudbanner">
            <Glyph icon={CloudOff} size={18} />
            <div className="cloudbanner__text">
              <strong>Cloud sync unavailable.</strong> Checkout continues on the Store Node. 14
              sales are queued and will sync when the connection returns.
            </div>
            <StubButton label="Details" className="cloudbanner__btn">
              Details
            </StubButton>
          </div>
        ) : null}
        <SearchBar
          searchRef={searchRef}
          query={query}
          disabled={preview.loading}
          onQuery={onQuery}
          onSubmit={onSubmit}
          onClear={() => onQuery("")}
        />
        {showResults ? (
          <>
            <ProductBrowser
              view={preview.view}
              loading={false}
              selectedId={null}
              hasQuery
              hideProducts
            />
            <SearchResults query={query} />
          </>
        ) : showNotFound ? (
          <>
            <ProductBrowser
              view={preview.view}
              loading={false}
              selectedId={null}
              hasQuery
              hideProducts
            />
            <NotFound query={query} onClear={() => onQuery("")} />
          </>
        ) : (
          <ProductBrowser
            view={preview.view}
            loading={preview.loading}
            selectedId={populated ? PREVIEW_SELECTED_LINE : null}
            hasQuery={query !== ""}
          />
        )}
      </section>
      <CartPanel
        key={populated ? "populated" : "empty"}
        populated={populated}
        totals={populated ? POPULATED_TOTALS : EMPTY_TOTALS}
        paymentEnabled={!offline}
        customerAttached={customerAttached}
        actions={actions}
      />
      {offline ? <OfflineOverlay /> : null}
    </div>
  );
}
