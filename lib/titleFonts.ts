/**
 * Registry of title fonts for StyleCard.Title.
 * To add a new font: add @font-face + Tailwind fontFamily, then add id and mapping here.
 */
export type TitleFontId = 'default' | 'badger';

const TITLE_FONT_CLASS: Record<TitleFontId, string | undefined> = {
  default: undefined,
  badger: 'font-badger',
};

export function getTitleFontClass(font: TitleFontId = 'default'): string | undefined {
  return TITLE_FONT_CLASS[font];
}
