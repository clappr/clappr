---
description: How to setup Clappr in your machine.
---

# Development

Ensure you have [Yarn](https://yarnpkg.com/) installed.

## Local Development

Clone the project:

```bash
git clone git@github.com:clappr/clappr.git
```

Enter the project's directory and install its dependencies:

```bash
cd clappr
yarn install
```

Start up the application:

```bash
yarn start
```

This command starts a local development server and opens up a browser window in [http://localhost:8080](http://localhost:8080). Changes to the code are reflected live without having to restart the server.

## Build

Make your changes and run the tests:

```bash
yarn test
```

If there are no problems, build your own version:

```bash
yarn build
```

This command generates a newly built version of the Player into the `dist/` directory.
