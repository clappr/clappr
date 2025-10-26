# Javascript

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

# Typescript

## Type Safety

- Avoid `any`; use `unknown` for truly dynamic types
- Prefer union types over enums when possible
- Use `as const` for literal types
- Leverage type guards and discriminated unions

## Type Design

- Prefer interfaces for object shapes (extendable)
- Prefer type aliases for unions/intersections
- Use generics to avoid duplication
- Keep types close to usage (avoid premature abstraction)

## Utility Types

- Use built-in utility types (Partial, Pick, Omit, Record)
- Prefer `satisfies` over type assertions when validating structure

## Error Handling

- Type errors explicitly (custom error classes)
- Use Result/Either types for recoverable errors
- Avoid throwing in pure functions
