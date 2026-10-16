/**
 * Admin-controlled typography. Each font is self-hosted and only downloaded when selected.
 * Values are applied as CSS variables on <html>, so the whole site updates instantly.
 */
export const FONTS = {
  'albert-sans': { label: 'Albert Sans — geometric, matches the logo', family: "'Albert Sans Variable'", load: () => import('@fontsource-variable/albert-sans/wght.css') },
  inter: { label: 'Inter — very crisp on screens', family: "'Inter Variable'", load: () => import('@fontsource-variable/inter/wght.css') },
  manrope: { label: 'Manrope — modern and rounded', family: "'Manrope Variable'", load: () => import('@fontsource-variable/manrope/wght.css') },
  'plus-jakarta-sans': { label: 'Plus Jakarta Sans — warm and premium', family: "'Plus Jakarta Sans Variable'", load: () => import('@fontsource-variable/plus-jakarta-sans/wght.css') },
  'dm-sans': { label: 'DM Sans — clean and friendly', family: "'DM Sans Variable'", load: () => import('@fontsource-variable/dm-sans/wght.css') },
  outfit: { label: 'Outfit — bold geometric display', family: "'Outfit Variable'", load: () => import('@fontsource-variable/outfit/wght.css') },
  sora: { label: 'Sora — wide, technical, modern', family: "'Sora Variable'", load: () => import('@fontsource-variable/sora/wght.css') },
  'space-grotesk': { label: 'Space Grotesk — industrial character', family: "'Space Grotesk Variable'", load: () => import('@fontsource-variable/space-grotesk/wght.css') },
};

export const DEFAULT_TYPOGRAPHY = { font: 'albert-sans', headingFont: 'same', baseSize: 16, headingWeight: 400, bodyWeight: 420 };

const FALLBACK = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
const clamp = (n, min, max, d) => (Number.isFinite(Number(n)) && Number(n) ? Math.min(max, Math.max(min, Number(n))) : d);

export function readTypography(s = {}) {
  return {
    font: FONTS[s.typography_font] ? s.typography_font : DEFAULT_TYPOGRAPHY.font,
    headingFont: FONTS[s.typography_heading_font] ? s.typography_heading_font : 'same',
    baseSize: clamp(s.typography_base_size, 14, 20, DEFAULT_TYPOGRAPHY.baseSize),
    headingWeight: clamp(s.typography_heading_weight, 300, 700, DEFAULT_TYPOGRAPHY.headingWeight),
    bodyWeight: clamp(s.typography_body_weight, 350, 600, DEFAULT_TYPOGRAPHY.bodyWeight),
  };
}

export const typographyKey = (t) => `${t.font}|${t.headingFont}|${t.baseSize}|${t.headingWeight}|${t.bodyWeight}`;
export const fontStack = (key) => `${(FONTS[key] || FONTS['albert-sans']).family}, ${FALLBACK}`;
export const headingKey = (t) => (t.headingFont === 'same' ? t.font : t.headingFont);

async function loadFont(key, weight) {
  const font = FONTS[key] || FONTS['albert-sans'];
  try {
    await font.load();
    await document.fonts?.load(`${weight} 1em ${font.family}`);
  } catch {
    /* fall back to the system stack */
  }
}

/** Loads the font files first, then swaps the CSS variables, so text never flashes in a half-loaded face. */
export async function applyTypography(t, target = document.documentElement) {
  await Promise.all([loadFont(t.font, t.bodyWeight), loadFont(headingKey(t), t.headingWeight)]);
  target.style.setProperty('--app-font', fontStack(t.font));
  target.style.setProperty('--heading-font', fontStack(headingKey(t)));
  target.style.setProperty('--base-size', String(t.baseSize));
  target.style.setProperty('--heading-weight', String(t.headingWeight));
  target.style.setProperty('--body-weight', String(t.bodyWeight));
}
