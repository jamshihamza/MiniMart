import type { ButtonHTMLAttributes, ReactNode } from "react";

export function StatusBadge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "neutral" | "attention";
}): ReactNode {
  return <span className={`status-badge status-badge--${tone}`}>{label}</span>;
}

export function ShellButton({
  children,
  variant = "secondary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "quiet";
}): ReactNode {
  return (
    <button type="button" className={`shell-button shell-button--${variant}`} {...props}>
      {children}
    </button>
  );
}

export function KeyHint({
  keyName,
  children,
}: {
  keyName: string;
  children: ReactNode;
}): ReactNode {
  return (
    <span className="key-hint">
      <kbd>{keyName}</kbd>
      <span>{children}</span>
    </span>
  );
}
