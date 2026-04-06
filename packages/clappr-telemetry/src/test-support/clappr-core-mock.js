/**
 * Minimal @clappr/core stub for Jest. The published package points `main` at dist/which
 * is absent before `yarn build` in @clappr/core, and mapping real src pulls in untranspiled ESM.
 */

const register = (eventName) => {
  Events.Custom || (Events.Custom = {})
  const property = typeof eventName === 'string' && eventName.toUpperCase().trim()

  if (property && !Events.Custom[property]) {
    Events.Custom[property] = property
      .toLowerCase()
      .split('_')
      .map((value, index) =>
        index === 0 ? value : value[0].toUpperCase() + value.slice(1)
      )
      .join('')
  }
}

export const Events = {
  Custom: {},
  CONTAINER_READY: 'container:ready',
  CONTAINER_PLAY: 'container:play',
  register
}

export const Log = {
  warn: () => {}
}

export class ContainerPlugin {
  constructor(container) {
    this.container = container
  }

  listenTo() {}

  destroy() {}
}
