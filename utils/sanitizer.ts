import sanitizeHtml from 'sanitize-html'

/**
 * HTML を Sanitize する
 */
export const htmlSanitizer = (htmlText: string | undefined) =>
  sanitizeHtml(htmlText ?? '', {
    allowedAttributes: {
      '*': ['class', 'style'],
      a: ['href', 'name', 'target', 'rel'],
    },
  })
