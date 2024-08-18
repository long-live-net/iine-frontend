import sanitizeHtml from 'sanitize-html'

/**
 * HTML を Sanitize する
 */
export const htmlSanitizer = (htmlText: string | undefined) =>
  sanitizeHtml(htmlText ?? '', {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'iframe']),
    allowedAttributes: {
      '*': ['class', 'style'],
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      iframe: [
        'src',
        'width',
        'height',
        'autoplay',
        'disablekbcontrols',
        'start',
        'endtime',
        'loop',
      ],
      allowedIframeHostnames: ['www.youtube.com'],
    },
    allowedSchemes: ['data', 'http', 'https'],
  })
