# HangarXPLOR — Developer Documentation

HangarXPLOR is a browser extension that enhances the Star Citizen hangar page at
`https://robertsspaceindustries.com/account/pledges`. It injects a rich filtering,
searching, and export layer on top of the existing RSI page without requiring any
server-side changes.

## What it does

- Pre-loads **all pages** of the hangar simultaneously rather than waiting for the
  user to page through them manually.
- Corrects ship display names and thumbnails for upgraded/CCU'd items, which RSI
  does not do natively.
- Adds advanced filtering by LTI status, Warbond, giftability, melt value, upgrade
  status, item type, and more.
- Displays individual Pledge IDs, melt values, and base items inside packages.
- Caches the raw hangar HTML in browser storage so subsequent page loads are instant.
- Exports the hangar in **Hangar Transfer Format (HTF)** JSON and CSV.
- Provides a floating summary panel showing totals and selected-item values.

## Supported browsers

| Browser | Distribution          | Notes                                  |
|---------|-----------------------|----------------------------------------|
| Chrome  | Chrome Web Store      | Primary target                         |
| Firefox | Mozilla Add-ons       | Minimum Firefox 109                    |
| Edge    | Edge Add-ons          | On hold                                |
| Opera   | Opera Add-ons         | Uses Chrome build                      |
| Safari  | Manual / App Store    | Requires Xcode conversion; minimum 16.4|

## Documentation index

| Document | Contents |
|----------|----------|
| [architecture.md](architecture.md) | High-level design, module map, data flow, storage strategy, the postMessage bridge |
| [file-reference.md](file-reference.md) | Every source file explained — purpose, key functions, dependencies |
| [build.md](build.md) | Building locally, packaging per browser, CI/CD pipeline |

## Repository layout

```
HangarXPLOR/
├── src/
│   ├── manifest.core.json          # Shared Manifest V3 base
│   ├── manifest.{browser}.json     # Per-browser overrides
│   ├── content_scripts/
│   │   └── loader.js               # Bootstrap — injects CSS + JS into the page
│   ├── ui_resources/
│   │   ├── HangarXPLOR.Settings.html
│   │   └── HangarXPLOR.Settings.js
│   └── web_resources/              # All application logic (injected scripts)
│       ├── HangarXPLOR.js          # Entry point / initialisation
│       ├── HangarXPLOR.*.js        # Feature modules (see file-reference.md)
│       ├── shims.chrome.storage.js # Injected-page ↔ content-script storage bridge
│       ├── fuse.min.js             # Third-party fuzzy-search library
│       ├── HangarXPLOR.css         # All extension styling
│       └── ship-codes.json         # Ship database for HTF exports
├── scripts/
│   └── refresh-ship-codes.js       # Maintenance: re-fetches ship-codes.json from RSI
├── docs/                           # This documentation
├── build.js                        # Build script — produces browser ZIPs / directories
├── package.json
└── appveyor.yml                    # CI/CD configuration
```
