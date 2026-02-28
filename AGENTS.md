# Clappr Agent Guidelines

This is a Lerna monorepo using Yarn workspaces. Key packages: `@clappr/core` (main components), `@clappr/player` (bundle), `@clappr/plugins`, `@clappr/hlsjs-playback`, `dash-shaka-playback`.

## Build / Lint / Test Commands

**Root-level commands:**

- `yarn install` - Install all dependencies
- `yarn dev` - Start player dev server (`@clappr/player`)
- `yarn lint` - Run eslint on all packages
- `yarn lint:fix` - Auto-fix eslint errors
- `yarn format` - Format code with prettier
- `yarn format:check` - Check formatting
- `yarn test` - Run tests for `@clappr/core`
- `yarn build` - Build all main packages (`@clappr/core`, `@clappr/plugins`, `@clappr/hlsjs-playback`, `@clappr/player`) in dependency order

**Lerna commands (for specific packages):**

- `lerna run <command>` - Run in all packages
- `lerna run <command> --scope=@clappr/core` - Run in specific package
- `yarn workspace <package-name> add <dep>` - Add dependency to package

**Running specific tests:**

- `lerna run test --scope=@clappr/core -- path/to/test.test.js` - Run single test file
- `jest src/path/to/test.test.js` - Run test from package root
- `jest --testNamePattern="specific test name"` - Run tests matching pattern
- `jest --watch` - Watch mode
- `jest --coverage` - Generate coverage report

## Code Style Guidelines

### JavaScript / TypeScript

- **Imports**: Use ES6 imports, prefer relative paths (e.g., `import X from './x'`, not `import X from '../../../x'`)
- **Formatting**: No semicolons, single quotes, 2-space indent, 100 char line width (prettier)
- **Variables**: `const`/`let` only (no `var`), prefer `const` for destructuring
- **Functions**: async/await over `.then()`, arrow functions with single params: `(x) => x`
- **Naming**:
  - Classes: `PascalCase` (e.g., `Playback`, `Container`)
  - Methods/Functions: `camelCase`, verbs (e.g., `play()`, `loadSource()`)
  - Booleans: `isXXX`, `hasXXX` (e.g., `isActive`, `hasEnded`)
  - Constants: `UPPER_SNAKE_CASE`
  - Private: underscore prefix (e.g., `_internalMethod`)

### Code Architecture

- **Classes**: Prefer classes over standalone functions, encapsulate related data/behavior
- **Design**: Single responsibility principle, methods < 30 lines, max 3 nesting levels
- **Composition**: Favor composition over inheritance, use dependency injection
- **SOLID**: Open/Closed, Interface Segregation, Dependency Inversion
- **Returns**: Early returns over nested conditionals, consistent return types

### DOM & Performance

- Use `DocumentFragment` for multiple insertions, batch DOM ops (reads then writes)
- Cache DOM references, use event delegation over multiple listeners
- Debounce/throttle scroll/resize, passive listeners for touch/scroll
- `requestAnimationFrame` for animations, `transform`/`opacity` over layout properties

### Error Handling

- Handle errors explicitly, never ignore caught errors
- Type errors explicitly (custom error classes)
- Clean up resources: timers, event listeners, observers, connections, media elements

### Testing

- Test behavior, not implementation
- Tests must run independently without shared state
- Clean up with `afterEach`/`afterAll`
- Use Jest with jsdom environment

### Security

- Never use `eval()` or `Function()` constructor
- Avoid `innerHTML` with user input; use `textContent` or DOM APIs
- Never store tokens in localStorage; no hardcoded credentials
- Validate URLs before redirects
- Sanitize user-generated content for correct context
- No sensitive data in logs, URLs, or error messages
- Validate `event.origin` for postMessage, use specific `targetOrigin`

### TypeScript Specific (when applicable)

- Avoid `any`; use `unknown` for dynamic types
- Prefer interfaces for object shapes, type aliases for unions/intersections
- Use `as const` for literal types, leverage type guards
- Keep types close to usage, use built-in utility types (Partial, Pick, Omit)

### Git Commits

- Use Conventional Commits: `<type>(<scope>): <description>`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Comments

- Comment "why", not "what"
- Use for non-obvious decisions, workarounds, or business context
