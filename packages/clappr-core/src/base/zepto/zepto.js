import zepto from '@clappr/zepto'

/**
 * @typedef {Object} ZeptoCollection
 * @property {(content: string|HTMLElement) => ZeptoCollection} append
 * @property {(type: string, selector: string, fn: ZeptoEventHandler) => ZeptoCollection} on
 * @property {(type: string, selector: string|ZeptoEventHandler, fn?: ZeptoEventHandler) => ZeptoCollection} off
 * @property {(selector?: string) => ZeptoCollection} parent
 */

/** @typedef {(e: Event, ...args: any[]) => any} ZeptoEventHandler */

/**
 * @typedef {{
 *   (selector: string|HTMLElement, context?: any): ZeptoCollection,
 *   zepto: { isZ(object: any): boolean }
 * }} ZeptoStatic
 */

/** @type {ZeptoStatic} */
const $ = zepto

export default $
