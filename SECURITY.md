# Security Policy

## Supported Versions

Clappr packages are versioned independently. Security fixes ship in the latest
published minor of each package (`@clappr/player`, `@clappr/core`,
`@clappr/plugins`, the playback packages, `@clappr/telemetry`, `@clappr/zepto`).
Older releases are not backported — the recommended remediation is to upgrade.

## Reporting a Vulnerability

Please do not open a public issue, pull request, or discussion for security
reports. Public reports expose users who have not yet had a chance to upgrade.
Report privately through GitHub Security Advisories:

**[Report a vulnerability](https://github.com/clappr/clappr/security/advisories/new)**

Include the affected package and version, the impact, and steps to reproduce —
a minimal HTML page or CodeSandbox is ideal.

Clappr is maintained by volunteers. We aim to acknowledge reports within a week
and will keep you posted in the advisory thread, including if we conclude the
report is not a vulnerability. We ask for up to 90 days before public
disclosure; when a fix ships we publish a GitHub Security Advisory and credit
you as the reporter unless you prefer otherwise.

## Scope

Clappr is a client-side media player library. It runs in the browser, inside the
page of whoever embeds it, and has no server component of its own.

**In scope:** XSS or script injection reachable through player options, media
metadata, or subtitle and caption tracks; prototype pollution in `@clappr/core`
or `@clappr/zepto`; bypass of same-origin or CORS expectations caused by
player code.

**Out of scope:**

- **Content protection and DRM.** Clappr is a library, not a content manager. It
  does not hold keys, issue or validate licenses, or enforce playback rights —
  those belong to the platform CDM, the device, and the license server operated
  by whoever embeds the player. Report those to the CDM vendor or to the service
  distributing the content.
- **Upstream dependencies.** Report to [hls.js](https://github.com/video-dev/hls.js)
  or [shaka-player](https://github.com/shaka-project/shaka-player) directly. Tell
  us anyway if Clappr's usage makes the impact worse.
- Issues that require the embedder to pass attacker-controlled HTML into a
  documented HTML-accepting option.
- Missing security headers, TLS configuration, or other infrastructure findings
  on clappr.io and the documentation site.
- Automated scanner output without a demonstrated impact.
