export type ZeptoCollection = {
  /**
   * Append content to the DOM inside each individual element in the collection. The content can be an HTML string, a DOM node or an array of nodes.
   * @param content
   * @return Self object.
   */
  append(content: string): ZeptoCollection;

  /**
   * @see ZeptoCollection.append
   */
  append(content: HTMLElement): ZeptoCollection;

  /**
   * Add event handlers to the elements in collection. Multiple event types can be passed in a space-separated string, or as an object where event types are keys and handlers are values. If a CSS selector is given, the handler function will only be called when an event originates from an element that matches the selector.
   * Event handlers are executed in the context of the element to which the handler is attached, or the matching element in case a selector is provided. When an event handler returns false, preventDefault() is called for the current event, preventing the default browser action such as following links.
   * @param type
   * @param selector
   * @param fn
   * @return
   */
  on(type: string, selector: string, fn: ZeptoEventHandler): ZeptoCollection;

  /**
   * Detach event handlers added with on. To detach a specific event handler, the same function must be passed that was used for on(). Otherwise, just calling this method with an event type with detach all handlers of that type. When called without arguments, it detaches all event handlers registered on current elements.
   * @param type
   * @param selector
   * @param fn
   * @return
   */
  off(type: string, selector: string, fn: ZeptoEventHandler): ZeptoCollection;

  /**
   * @see ZeptoCollection.off
   */
  off(type: string, fn: ZeptoEventHandler): ZeptoCollection;

  /**
   * Get immediate parents of each element in the collection. If CSS selector is given, filter results to include only ones matching the selector.
   * @param selector
   * @return
   */
  parent(selector?: string): ZeptoCollection;
}

type ZeptoEventHandler = {
  (e: Event, ...args: any[]): any;
}

declare function $(selector: string, context?: any): ZeptoCollection;

declare namespace $ {
  interface Zepto {
    isZ(object: any): boolean;
  }

  const zepto: Zepto;
}

export default $;
