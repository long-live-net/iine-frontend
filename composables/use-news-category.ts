/**
 * news カテゴリラベルと色定義
 */
export const newsCategory2Label = {
  I: { label: 'INFO', variant: 'info' },
  S: { label: 'SERVICE', variant: 'success' },
  W: { label: 'WORK', variant: 'warning' },
  T: { label: 'TECH', variant: 'danger' },
}

export type NewsCategory2Label = keyof typeof newsCategory2Label
