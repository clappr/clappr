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
