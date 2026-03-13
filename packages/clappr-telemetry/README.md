# @clappr/telemetry

Telemetry package for Clappr player.

## Installation

```bash
yarn workspace @clappr/telemetry install
```

## Development

**Build the package:**

```bash
lerna run build --scope=@clappr/telemetry
```

**Watch mode:**

```bash
lerna run dev --scope=@clappr/telemetry
```

**View in browser:**

```bash
yarn dev
```

Then open `http://localhost:8080` in your browser.

## Testing

**Run all tests:**

```bash
lerna run test --scope=@clappr/telemetry
```

**Run tests in watch mode:**

```bash
jest --watch
```

**Run specific test file:**

```bash
jest src/path/to/test.test.js
```

**Run tests matching pattern:**

```bash
jest --testNamePattern="adapter"
```

**Generate coverage report:**

```bash
jest --coverage
```

## License

MIT
