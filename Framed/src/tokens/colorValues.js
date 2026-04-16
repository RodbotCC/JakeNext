// JS mirror of CSS custom properties — used for SVG inline attributes
// that can't reference CSS variables directly.

export const colors = {
  bg: '#FDF6EC',
  surface: '#FFF9F0',
  surfaceAlt: '#F5EDE0',
  canvasBg: '#F0E8D8',
  canvasAlt: '#E8DFCF',

  primary: '#6B2B3A',
  primaryHover: '#7D3548',

  text: '#3D2C2C',
  textMuted: '#8C7A72',
  textFaint: '#B8A99E',

  border: '#E4D8CB',
  borderStrong: '#D1C2B2',

  accentGreen: '#5B8C6A',
  accentCoral: '#D4726A',
  accentPink: '#C4737B',
  accentGold: '#C49B5A',
  accentBlue: '#5A7FA0',
};

// Helper: append hex alpha to a color (2-digit hex)
export function withAlpha(hex, alpha) {
  const a = Math.round(alpha * 255).toString(16).padStart(2, '0');
  return `${hex}${a}`;
}
