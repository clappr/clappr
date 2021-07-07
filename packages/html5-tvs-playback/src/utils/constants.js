/** Default error to use when no relevant information is returned from error callbacks.
 * @type {object}
 * @property {string} code - a ID error.
 * @property {string} message - a error message.
*/
export const UNKNOWN_ERROR = { code: 'unknown', message: 'unknown' }

/** Enum of possible HTMLMediaElement.readyState values.
 * @enum {number}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState HTMLMediaElement.readyState}
*/
export const READY_STATE_STAGES = {
  HAVE_NOTHING: 0,
  HAVE_METADATA: 1,
  HAVE_CURRENT_DATA: 2,
  HAVE_FUTURE_DATA: 3,
  HAVE_ENOUGH_DATA: 4,
}

/** Enum of supported mime types.
 * @enum {string}
 * @see {@link https://www.iana.org/assignments/media-types/media-types.xhtml Internet Assigned Numbers Authority Media Types}
*/
export const MIME_TYPES = {
  MP4: 'video/mp4',
  VND_APPLE_MPEGURL: 'application/vnd.apple.mpegurl',
  VND_MS_SSTR: 'application/vnd.ms-sstr+xml',
}

export const MIME_TYPES_BY_EXTENSION = {
  m3u8: MIME_TYPES.VND_APPLE_MPEGURL,
  m3u: MIME_TYPES.VND_APPLE_MPEGURL,
  mp4: MIME_TYPES.MP4,
  ism: MIME_TYPES.VND_MS_SSTR,
}

export const DEFAULT_MINIMUM_DVR_SIZE = 60 // in seconds

export const LIVE_STATE_THRESHOLD = 3 // in seconds

export const getExtension = url => {
  const urlWithoutParameters = url.split('?')[0] //eslint-disable-line
  const match = urlWithoutParameters.match(/(\.[A-Z0-9]+)/gi)
  const extension = match ? match.pop().replace('.', '') : ''

  return extension
}
