# Building HangarXPLOR

## Prerequisites

- **Node.js** (any recent LTS)
- **npm** (bundled with Node)
- **Xcode** (macOS only, Safari build only)

```bash
npm install
```

This installs the single runtime dependency: `jszip`, used by `build.js` to
produce ZIP packages.

## Running a build

```bash
node build.js <version>
```

`<version>` must be a four-part string matching the Manifest V3 `version` field
format, e.g. `1.2.3.4`. The version is injected into every manifest at build time;
the source manifests do not contain a version field.

**Output** is written to `dist/`:

| File | Browser |
|---|---|
| `HangarXPLOR-chrome-v<version>.zip` | Chrome / Opera / Edge |
| `HangarXPLOR-firefox-v<version>.zip` | Firefox |
| `HangarXPLOR-edge-v<version>.zip` | Edge (legacy) |
| `HangarXPLOR-safari-v<version>/` | Safari (directory, not ZIP) |

## How `build.js` works

1. Reads `src/manifest.core.json` as the master manifest and injects the version.
2. For each target browser (`chrome`, `firefox`, `edge`, `safari`):
   - Reads `src/manifest.<browser>.json` if it exists and shallow-merges it over
     the core manifest (browser-specific keys override core keys).
   - Recursively walks the `src/` directory via `addFiles('src')`.
   - Skips the following paths:
     - Any directory named `debug` (offline test fixtures)
     - Any directory named `screenshots`
     - Any file matching `manifest.*.json` (the per-browser manifests are not
       shipped; only the merged result is)
   - For Chrome / Firefox / Edge: adds every file to a JSZip archive and writes it
     as a `.zip` using STORE compression (no compression — faster and required by
     some browser stores).
   - For Safari: writes files directly to a `dist/HangarXPLOR-safari-v<version>/`
     directory instead of a ZIP, because the Safari conversion tool (`xcrun
     safari-web-extension-converter`) requires a plain directory as input.
3. The `scripts/` directory lives at the repository root (outside `src/`), so it is
   never included in any build package.

## Safari build (additional step)

After running `node build.js`, convert the Safari output directory using Xcode:

```bash
xcrun safari-web-extension-converter dist/HangarXPLOR-safari-v<version>/ \
  --project-location dist/ \
  --app-name HangarXPLOR \
  --bundle-identifier com.ddrit.HangarXPLOR \
  --no-open
```

This produces an Xcode project. Open it, set your signing team, and build the
macOS app. The extension is distributed inside the app bundle.

Minimum Safari version: **16.4** (declared in `manifest.safari.json`).

## CI/CD — AppVeyor

`appveyor.yml` configures a Windows-hosted build pipeline that runs on every push
to the `release` branch.

**Pipeline steps**:
1. `npm install`
2. Log Node and npm versions (diagnostic).
3. `node build.js %APPVEYOR_BUILD_VERSION%` — version comes from AppVeyor's
   auto-incrementing build number.
4. `npx eslint src/` — lint check; the build fails if ESLint reports errors.

**Artifacts** collected (uploaded to the AppVeyor build):
- `dist/HangarXPLOR-chrome-v*.zip`
- `dist/HangarXPLOR-firefox-v*.zip`
- `dist/HangarXPLOR-edge-v*.zip`

**Deployment**: on the `release` branch, AppVeyor automatically creates a GitHub
release and attaches the three ZIP artifacts as release assets. The Safari build
is excluded because it requires macOS and Xcode.

## ESLint configuration

`package.json` declares an ESLint config with:
- `env`: `browser: true`, `es6: true`
- `globals`: `$`, `jQuery` (RSI's jQuery is available at runtime but not declared
  in the extension source)

Run lint manually:
```bash
npx eslint src/
```

## Adding a new browser target

1. Create `src/manifest.<browser>.json` with any overrides needed (can be `{}`
   if no overrides are required).
2. Add the browser name to the `support` array in `build.js`.
3. If the browser needs a directory output instead of a ZIP, add a branch in
   `build.js` analogous to the Safari block.

## Refreshing ship data

Ship codes are not rebuilt automatically during a normal build. Run the maintenance
script manually when the RSI ship matrix changes:

```bash
node scripts/refresh-ship-codes.js
```

Then commit `src/web_resources/ship-codes.json` alongside any other changes.
See [file-reference.md § ship-codes.json](file-reference.md#srcweb_resourcesship-codesjson)
for details on the merge strategy.
