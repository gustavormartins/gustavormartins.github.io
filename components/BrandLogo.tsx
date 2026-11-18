import Link from 'next/link';

/**
 * Responsive, accessible version of the GM × BLOHSH logo.
 *
 * The wordmark stays live HTML (crisp at every size) while the existing
 * Blohsh artwork is placed behind the name as a subtle watermark.
 * The terminal caret is real CSS animation rather than a static screenshot.
 */
export function BrandLogo() {
  return (
    <Link
      href="/"
      className="brand brand-lockup"
      aria-label="Gustavo Martins Dev, Blohsh — voltar ao início"
    >
      <span className="brand-monogram" aria-hidden="true">
        GM<span className="brand-terminal-cursor" />
      </span>
      <span className="brand-vertical-rule" aria-hidden="true" />
      <span className="brand-nameplate">
        <span className="brand-blohsh-watermark" aria-hidden="true" />
        <span className="brand-name-title">Gustavo Martins Dev</span>
        <span className="brand-name-signature">BLOHSH</span>
      </span>
    </Link>
  );
}
