---
applyTo: '**/*.js,**/*.jsx,**/*.mjs,**/*.cjs,**/*.ts,**/*.tsx'
---

# JavaScript Best Practices

## Arrays & Iteration

- Use map/filter/reduce over forEach with side effects
- Use appropriate data structures (Map, Set) for lookups

## Async Operations

- Use async/await over .then()
- Use Promise.all() for parallel operations

## DOM & Browser Performance

- Use DocumentFragment for multiple DOM insertions
- Batch DOM operations (group reads, then writes to avoid layout thrashing)
- Cache DOM references
- Use event delegation instead of multiple listeners
- Debounce/throttle scroll/resize handlers
- Use passive listeners for touch/scroll events
- Use requestAnimationFrame for animations
- Use transform/opacity over layout-triggering properties

## Performance

- Offload heavy computations to Web Workers
- Avoid complex regex patterns (catastrophic backtracking)
- Profile before optimizing

## Memory Management

Always clean up resources:

- Clear timers, event listeners, and observers
- Close connections (websockets, streams, workers)
- Clean media elements and Blob URLs
- Implement cache limits/TTL
- Avoid large closures and dangling references

## Dependencies

- Justify new libraries (necessity? alternatives? bundle impact? vulnerabilities? maintained?)
- Consider transitive dependencies and tree-shaking compatibility
