import sanitizeHtml from 'sanitize-html'

/**
 * HTML を Sanitize する
 */
export const htmlSanitizer = (htmlText: string | undefined) =>
  sanitizeHtml(htmlText ?? '', {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: {
      '*': ['class', 'style'],
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    },
    allowedSchemes: ['data', 'http', 'https'],
  })
