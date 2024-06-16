/**
 * newsカテゴリラベル
 */
export const newsCategory2Label = {
  I: 'INFO',
  S: 'SERVICE',
  W: 'WORK',
  T: 'TECH',
} as const
export type NewsCategory2Label = keyof typeof newsCategory2Label
