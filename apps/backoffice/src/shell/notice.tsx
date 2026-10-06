import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

/**
 * Preview-only notice channel. A control that has no implemented behavior calls `notify`, which
 * shows a short status message so nobody mistakes the control for working product behavior.
 */
interface NoticeApi {
  readonly notify: (message: string) => void;
}

const NoticeContext = createContext<NoticeApi>({ notify: () => undefined });

export function useNotice(): NoticeApi {
  return useContext(NoticeContext);
}

const NOTICE_MS = 6_000;

export function NoticeProvider({ children }: { readonly children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (message === null) return undefined;
    const timer = setTimeout(() => setMessage(null), NOTICE_MS);
    return () => clearTimeout(timer);
  }, [message]);

  const notify = useCallback((next: string) => setMessage(next), []);
  const api = useMemo<NoticeApi>(() => ({ notify }), [notify]);

  return (
    <NoticeContext.Provider value={api}>
      {children}
      <div className="mm-notice" role="status" hidden={message === null}>
        {message}
      </div>
    </NoticeContext.Provider>
  );
}
