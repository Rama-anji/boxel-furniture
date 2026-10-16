/**
 * Premium section headings: a small orange-tile label pill, then a two-tone title —
 * the lead phrase in deep ink with a subtle metallic gradient, the rest in a softer tone.
 */

/** Splits a heading after its first comma, otherwise roughly in half by words. */
export function splitTitle(text = '') {
  const t = String(text).trim();
  const comma = t.indexOf(',');
  if (comma > 0 && comma < t.length - 1) return [t.slice(0, comma + 1), t.slice(comma + 1).trim()];
  const words = t.split(/\s+/);
  if (words.length <= 2) return [t, ''];
  const cut = Math.floor(words.length / 2);
  return [words.slice(0, cut).join(' '), words.slice(cut).join(' ')];
}

export function Kicker({ children, dark = false, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.75rem] font-semibold tracking-[0.01em] ${
        dark ? 'bg-white/[0.08] text-signal ring-1 ring-white/10' : 'bg-signal-soft text-signal-ink ring-1 ring-signal/15'
      } ${className}`}
    >
      <span className="tile text-[0.55rem]" aria-hidden />
      {children}
    </span>
  );
}

/** Title content: `main` in the gradient ink, `soft` in the muted tone. Pass `text` to split automatically. */
export function TitleText({ main, soft, text, breakSoft = false }) {
  const [a, b] = text !== undefined ? splitTitle(text) : [main, soft];
  return (
    <>
      <span className="h-main">{a}</span>
      {b && (
        <>
          {breakSoft ? <br /> : ' '}
          <span className="h-soft">{b}</span>
        </>
      )}
    </>
  );
}
