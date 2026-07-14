import Link from "next/link";

export function ShellHeader() {
  return (
    <header className="shell-header">
      <Link className="shell-brand" href="/" aria-label="LAO_Z_3 首頁">
        <strong>LAO_Z_3</strong>
        <span>@lao95z953</span>
      </Link>

      <span className="shell-mode">
        <i aria-hidden="true" />
        PUBLIC / READ-ONLY
      </span>
    </header>
  );
}
