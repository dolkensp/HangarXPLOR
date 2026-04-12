# File Reference

All paths are relative to the repository root.

---

## Manifests

### `src/manifest.core.json`

The shared Manifest V3 base used by all browsers. Key declarations:

- **permissions**: `storage`, `unlimitedStorage`
- **host_permissions**: `https://robertsspaceindustries.com/*` and the `www.`
  variant — required for same-origin XHR to `/account/pledges` and `/ship-matrix/index`
- **content_scripts**: `content_scripts/loader.js` runs on `*/account/pledges*`
- **action** (popup): `ui_resources/HangarXPLOR.Settings.html`
- **web_accessible_resources**: everything under `web_resources/` must be listed
  here so `chrome.runtime.getURL()` can produce usable URLs for the injected scripts

### `src/manifest.chrome.json`

Empty — Chrome uses the core manifest verbatim.

### `src/manifest.firefox.json`

Adds the Gecko browser-specific ID (`HangarXPLOR@ddrit.com`) and sets the minimum
Firefox version to 109.0.

### `src/manifest.edge.json`

Provides a Manifest V2 configuration for legacy Edge compatibility. Contains API
bridges needed by older Edge versions.

### `src/manifest.safari.json`

Sets the minimum Safari version to 16.4. The Safari build requires an additional
Xcode conversion step — see [build.md](build.md).

---

## Content Script

### `src/content_scripts/loader.js`

**World**: content-script (has access to `chrome.*` APIs)  
**Runs**: once, on page load, before the page's own scripts

This is the only file that executes in the privileged extension context. Everything
else is injected into the page world.

**Responsibilities**:

1. **Injects CSS** — creates a `<link>` element pointing to
   `web_resources/HangarXPLOR.css` and appends it to `<body>`.

2. **Registers data-file anchors** — for each entry in `ajax[]` (currently only
   `ship-codes.json`), appends a `<script type="text/x-ajax-url">` element whose
   `data-ajax` attribute holds the extension-scoped URL. Injected scripts read this
   attribute to locate the file without needing direct access to
   `chrome.runtime.getURL`.

3. **Storage bridge** — attaches a `window.addEventListener('message', …)` handler
   that intercepts typed `postMessage` events from the page world and proxies them
   to the real `chrome.storage.sync.*` / `chrome.storage.local.*` APIs, then sends
   the result back via another `postMessage`. See
   [architecture.md § The postMessage storage bridge](architecture.md#the-postmessage-storage-bridge).

4. **Sequential script loader** — the `scripts[]` array is a list of
   `web_resources/*.js` files in dependency order (last entry loads first, because
   `loadScript()` pops from the end). Each script's `onload` callback triggers the
   next load, ensuring strict ordering without `async`/`defer` complications.

---

## Extension Popup

### `src/ui_resources/HangarXPLOR.Settings.html`

Simple HTML popup shown when the user clicks the extension icon. Contains a single
"Clear Cache" button.

### `src/ui_resources/HangarXPLOR.Settings.js`

Handles the "Clear Cache" button click:
1. Reads `_cacheSalt` from `chrome.storage.sync`.
2. Writes a new random salt, forcing `LoadCache` to treat any stored cache as stale
   on the next page load.
3. Reloads the active tab.

---

## Application Entry Point

### `src/web_resources/HangarXPLOR.js`

**World**: page  
**Loaded**: last (after all other modules are defined)

Declares the `HangarXPLOR` global namespace and its top-level counters:

| Variable | Purpose |
|---|---|
| `$list` | jQuery reference to `.list-items` — the pledge container |
| `_inventory[]` | All parsed pledge DOM elements |
| `_shipMatrix[]` | Normalised ship data (API + overrides) |
| `_componentMatrix[]` | Normalised component data |
| `_shipCount` | Running total of ships |
| `_upgradeCount` | Running total of CCUs |
| `_giftableCount` | Running total of giftable items |
| `_packageCount` | Running total of packages |
| `_ltiCount` | Running total of LTI items |
| `_cacheSalt` | Random string; rotating it invalidates the cache |
| `_initCount` | Guards against double-initialisation |

**`HangarXPLOR.Initialize()`**:
1. Fetches `/ship-matrix/index` (JSON).
2. For each ship, strips manufacturer prefixes (`"Aegis "`, `"Anvil "`, etc.) to
   produce a clean short name.
3. Merges with `HangarXPLOR._ships` overrides from `Ships.js`; any override key
   that didn't match an API ship is appended as a standalone entry.
4. Sorts `_shipMatrix` by name length descending so substring matching is
   unambiguous (longer names matched before shorter ones).
5. Builds `_componentMatrix` from `Components.js` with the same length-sort.
6. Calls `LoadSettings()` → `BulkUI()` → fetches first-page HTML to derive the
   cache hash → `LoadCache()`.

---

## Page Loading

### `src/web_resources/HangarXPLOR.LoadPage.js`

Fetches a single page of pledges from `/account/pledges?page=N`.

**Configuration constants**:

| Constant | Default | Description |
|---|---|---|
| `_throttleAfterPage` | 50 | Start adding delays after this page number |
| `_throttleDelay` | 500 ms | Wait between requests once throttling is active |
| `_retryDelay` | 5000 ms | Base delay on 429; multiplied by attempt number |
| `_maxRetries` | 5 | Maximum 429 retry attempts before giving up |

**`LoadPage(pageNo, retryCount)`**:
- Updates the status display via `UpdateStatus()`.
- Special case: if already on `?page=1`, processes `document.body` directly instead
  of making an XHR, saving one round-trip.
- On success: wraps the response HTML in a `<div>` and passes it to `ProcessPage()`.
- On 429: waits `_retryDelay × (retryCount + 1)` ms and calls itself recursively
  with an incremented `retryCount`. Shows the retry status in the floating panel.
- On other errors: logs and calls `UpdateStatus(pageNo, 'error')`.
- After page 50: wraps the request in a `setTimeout(_throttleDelay)` before firing.

---

## Page Processing

### `src/web_resources/HangarXPLOR.ProcessPage.js`

Orchestrates parsing and decides whether to draw the UI or load the next page.

**`ProcessPage($page, pageNo)`**:
1. Checks for an empty list (`.empy-list` selector — note the typo is in RSI's HTML).
2. Calls `HangarXPLOR.ParsePledge` on each `<li>` via jQuery `.each()`.
3. **First call only** (`_uiDrawn === false`): calls `DrawUI()` which also calls
   `Render()` internally. Sets `_uiDrawn = true`.
4. **Subsequent calls**: calls `Render()`, `RefreshBulkUI()`, `RefreshPager()`.
5. If the page is empty or has fewer than 10 items (last page): calls `SaveCache()`
   and `MarkLoadingComplete()`.
6. Otherwise: calls `LoadPage(pageNo + 1)`.

---

## Pledge Parsing

### `src/web_resources/HangarXPLOR.ParsePledge.js`

The main parsing orchestrator. Applied to each `<li>` via `$.each`, so `this`
is the DOM element.

**Process**:
1. Reads `pledge_name`, `pledge_id`, and `pledge_cost` from hidden `<input>`
   elements (`js-pledge-name`, `js-pledge-id`, `js-pledge-value`).
2. Parses `melt_value` as a float from the cost string.
3. Attaches an empty `filters` object to the element.
4. Calls each sub-parser in sequence; each one adds flags to `filters`.
5. Stores the element's raw `innerHTML` in `HangarXPLOR._raw[]` for caching.
6. Pushes the element to `HangarXPLOR._inventory[]`.

Sub-parsers called (in order):  
`ParseShip` → `ParseComponent` → `ParseEquipment` → `ParseSkin` →
`ParseDecoration` → `ParseUpgrade` → `ParseReward` → `ParseCoupon` →
`ParseHangar`

### `src/web_resources/HangarXPLOR.ParseShip.js`

Handles items containing `.kind:contains(Ship)`.

- Strips manufacturer names from the displayed ship name.
- Looks up the cleaned name in `_shipMatrix` using a substring search (the
  longest-match-first sort in `Initialize` makes this deterministic).
- Replaces the displayed thumbnail with the one from the ship matrix, fixing
  CCU'd items that still show the original ship's image.
- Extracts `.custom-name-text` (nickname) and serial number.
- Sets `is_lti` if `"Lifetime Insurance"` appears in the title text.
- Sets `is_upgraded` if the pledge name has been modified by a CCU.
- Sets `is_combo` if more than one ship is present.
- Increments `_shipCount`, `_ltiCount`, `_giftableCount` as appropriate.

### `src/web_resources/HangarXPLOR.ParseComponent.js`

Handles `.kind:contains(Component)`. Sets `is_component` / `has_component`.
Looks up the component thumbnail in `_componentMatrix`.

### `src/web_resources/HangarXPLOR.ParseEquipment.js`

Handles `.kind:contains(FPS Equipment)`. Sets `is_equipment` / `has_equipment`.

### `src/web_resources/HangarXPLOR.ParseSkin.js`

Handles paints/liveries. RSI marks some skins as `"Livery Upgrade"` rather than
`"Skin"` — this parser injects a synthetic `.kind` element to normalise them.
Sets `is_skin` / `has_skin`.

### `src/web_resources/HangarXPLOR.ParseDecoration.js`

Handles hangar decorations. Sets `is_decoration` / `has_decoration` and
sub-type flags (`isModel`, `isPoster`, `isSpacePlant`, `isAddOn`, `isFlair`).

### `src/web_resources/HangarXPLOR.ParseUpgrade.js`

Handles Cross-Chassis Upgrades (CCUs). RSI embeds upgrade data as JSON in a
hidden `.js-upgrade-data` element.

- Parses the JSON to extract source and target ship names.
- Looks up the target ship in `_shipMatrix` to get its thumbnail.
- Sets `displayName` to `"SourceShip → TargetShip"`.
- Sets `is_upgrade` and increments `_upgradeCount`.

### `src/web_resources/HangarXPLOR.ParseReward.js`

Sets `is_reward` based on text matching in the pledge name.

### `src/web_resources/HangarXPLOR.ParseCoupon.js`

Sets `is_coupon` based on text matching.

### `src/web_resources/HangarXPLOR.ParseHangar.js`

Sets `is_hangar` / `has_hangar` for hangar pass items.

### `src/web_resources/HangarXPLOR.PreProcess.js`

A hook for manual item recategorisations. Currently contains only stub/TODO code.
Intended for cases where RSI's own categorisation is wrong and needs overriding
before the regular parsers run.

---

## Data / Override Files

### `src/web_resources/HangarXPLOR.Ships.js`

Exports `HangarXPLOR._ships` — a plain object keyed by the short ship name (after
manufacturer prefix is stripped). Each entry can override:

| Field | Effect |
|---|---|
| `name` | Override the short name used for matching |
| `displayName` | Separate display label (shown in the UI) |
| `thumbnail` | Override the thumbnail URL |
| `export` | Name to use when looking up the ship in `ship-codes.json` |

Entries whose key matches a ship in the RSI API are merged onto that entry. Entries
with no matching API ship are appended to `_shipMatrix` as standalone records.
This handles ships that RSI has removed from the active matrix but which users
still own.

### `src/web_resources/HangarXPLOR.Components.js`

Exports `HangarXPLOR._components` — same structure as `_ships` but for ship
components. Used by `ParseComponent` to find thumbnails.

### `src/web_resources/ship-codes.json`

A flat array of ship records used by `Download.js` to look up the correct
**Hangar Transfer Format (HTF)** identifiers when exporting. Refreshed via
`scripts/refresh-ship-codes.js`.

```json
{
  "ship_code":         "ANVL_F7C_Hornet_Mk_I",
  "ship_name":         "F7C Hornet Mk I",
  "manufacturer_code": "ANVL",
  "manufacturer_name": "Anvil Aerospace"
}
```

`ship_code` is derived as `MANUFACTURER_CODE_URL-slug-with-underscores` where the
URL slug is the last path segment of the ship's RSI pledge page URL.

The file contains both current entries (from the live RSI ship matrix) and legacy
entries (older ship codes that were renamed). Legacy entries are kept so that
exports of older hangar items remain valid.

---

## Filtering, Searching, Sorting

### `src/web_resources/HangarXPLOR.Filter.js`

**`Filter(list, filterValue)`** — pure function, returns a filtered copy of `list`.

Each `filterValue` is a string matched in a `switch` statement. The negated form
(prefix `!`) is also handled for most filters. Active filters are read from
`.js-custom-filter` elements in the DOM and applied sequentially so they AND
together.

Full list of filter values:

| Value | Keeps items where … |
|---|---|
| `HasLTI` / `!HasLTI` | `filters.is_lti` |
| `IsGiftable` / `!IsGiftable` | `filters.is_giftable` |
| `IsMeltable` / `!IsMeltable` | `filters.is_meltable` |
| `IsShip` | `is_ship && !is_package` |
| `HasShip` | `has_ship` |
| `IsPackage` | `is_package` |
| `!IsPackage` | `!is_package && has_ship` (standalone ships) |
| `IsWarbond` / `!IsWarbond` | `is_warbond` (scoped to ships/upgrades) |
| `IsCombo` | `is_combo` |
| `IsUpgraded` / `!IsUpgraded` | `is_upgraded` |
| `IsUpgrade` | `is_upgrade` (CCU items) |
| `HasValue` / `!HasValue` | `has_value` (melt value > 0) |
| `IsSelected` | `is_selected` |
| `IsDecoration` | `is_decoration` |
| `IsComponent` | `is_component` |
| `IsSkin` | `has_skin && !has_ship` |
| `IsEquipment` | `is_equipment` |
| `IsReward` / `!IsReward` | `is_reward` |
| `IsFreeCCU` / `!IsFreeCCU` | `is_upgrade && !has_value` |
| `IsNameable` / `HasNickname` / `!HasNickname` | naming flags |
| `IsModel`, `IsPoster`, `IsPlant`, `IsAddOn`, `IsExtra`, `IsFlair` | decoration sub-types |

### `src/web_resources/HangarXPLOR.Search.js`

**`Search(list, term)`** — fuzzy search using [Fuse.js](https://fusejs.io/).

- Returns the original list unchanged if `term` is fewer than 2 characters.
- Fuse configuration: `tokenize: true`, `matchAllTokens: true`, `threshold: 0.3`,
  keys `["sortName", "shipName", "originalName"]`.
- The result is sorted by Fuse score (best match first).
- Also generates an autocomplete suggestion string from the best-matching item,
  stored for `SearchBox.js` to display.

### `src/web_resources/HangarXPLOR.Sort.js`

**`Sort(list, sortValue)`** — in-place sort by:

| Value | Sort key |
|---|---|
| `Purchased` | `pledge_id` descending (newest first) |
| `Value` | `melt_value` descending |
| `Name` | `displayName` ascending (alphabetical) |
| `Score` | Fuse search score ascending (best match first) |

---

## Rendering

### `src/web_resources/HangarXPLOR.Render.js`

**`Render()`** — applies the full filter → search → sort → paginate pipeline and
updates the DOM.

1. Collects all `.js-custom-filter` values and calls `Filter()` for each.
2. Reads `.js-custom-search` and calls `Search()`.
3. Reads `.js-custom-sort` and calls `Sort()`.
4. Passes the autocomplete suggestion to `SearchBox` for display.
5. Slices the result array for the current page (`_pageNo`, `_pageCount`).
6. If the slice is empty, shows an "empty state" message.
7. Empties `$list` and appends the sliced items.

`Render()` is called on every user interaction that affects the view.

---

## UI Components

### `src/web_resources/HangarXPLOR.DrawUI.js`

**`DrawUI()`** — builds the control panels and inserts them above the pledge list.
Also calls `BindBulkUI()` and `Render()`.

Control layout:

**Row 1** — Type, Sort, Items-per-page  
**Row 2** — Toggle buttons: LTI, Warbond, Giftable, Meltable, Upgraded, Valuable, Reward, Free CCUs  
**Row 3** — Search box

Each control writes its selected value to a hidden DOM element so `Render()` can
read it without needing to pass state explicitly.

### `src/web_resources/HangarXPLOR.Dropdown.js`

**`Dropdown(options, cssClass, callback)`** — renders a styled `<select>`-like
dropdown. `options` is an array of `{ Value, Text, Selected }` objects.
Manages its own open/close state. Calls `callback(value)` on selection.

### `src/web_resources/HangarXPLOR.Toggle.js`

**`Toggle(label, value1, value2, initial, cssClass, callback)`** — renders a
three-state toggle button (on / off / unset). Visual state is reflected via CSS
classes. Calls `callback(state)` on each click.

### `src/web_resources/HangarXPLOR.SearchBox.js`

**`SearchBox()`** — renders the search input with an autocomplete ghost.

- Two overlapping `<input>` elements: the real search field (`.js-custom-search`)
  and a read-only mirror (`.js-custom-search-complete`) that shows the best
  autocomplete suggestion in grey.
- Tab key accepts the autocomplete suggestion into the main input.
- Fires `Render()` on every `keyup`.

### `src/web_resources/HangarXPLOR.Button.js`

**`Button(label, cssClass, callback)`** — renders a styled `<a>` element that
behaves as a button. Prevents default and stops propagation on click.

### `src/web_resources/HangarXPLOR.Pager.js`

**`Pager()`** / **`RefreshPager()`** — renders page navigation controls.

- Dropdown to select items per page (10 / 20 / 50 / 100 / All).
- Previous / Next buttons and up to 5 numbered page buttons centred on the current
  page.
- Updates `_pageNo` and calls `Render()` on page change.

### `src/web_resources/HangarXPLOR.Templates.js`

Minimal stub for a template-loading system. Currently the `templates[]` array in
`loader.js` is empty, so this file has no active role but is kept for future use.

---

## Floating Summary Panel

### `src/web_resources/HangarXPLOR.BulkUI.js`

The right-side floating panel that shows hangar totals and loading status.

**`BulkUI()`** — creates the panel DOM and appends it to `#billing`. Attaches a
`scroll` handler that keeps the panel within the page bounds (it floats between
`minOffset` and `maxOffset`). Adds "Download CSV" and "Download JSON" buttons.

**`BindBulkUI()`** — called from `DrawUI()` once the inventory list exists.
Attaches click handlers to `<li>` elements:
- Clicks on `<a>` elements inside an item are marked as button clicks and ignored.
- Any other click on an `<li>` toggles `filters.is_selected` and updates the visual
  `.js-selected` class.
- Clicking the value area toggles between `cash` (USD total) and `count` (CCUs /
  Ships / Packages) display modes.

**`RefreshBulkUI()`** — recalculates all totals from `_inventory`:
- `_totalMelt` — sum of `melt_value` across all items
- `_selectedMelt` — sum for selected items
- `_selectedUpgrades`, `_selectedShips`, `_selectedPackages` — type counts
- `_meltable[]`, `_giftable[]` — filtered lists for bulk operations
- Rebuilds the panel HTML with current values
- Shows / hides bulk action buttons (Melt / Gift) based on `BulkEnabled` flag and
  selection (note: bulk Melt/Gift is stubbed as "Coming Soon")

**`UpdateStatus(pageNo, state, retryCount, retryDelay)`** — updates the loading
status area:
- Normal: `"Loading / Page N…"`
- Rate-limited: `"Rate Limited / Retrying in Xs (N/5)"`
- Error: `"Error / Failed on page N"`

**`MarkLoadingComplete()`** — clears the status area and removes the
`still-loading` CSS class.

---

## Caching

### `src/web_resources/HangarXPLOR.LoadCache.js`

**`LoadCache(fallbackFn)`** — attempts to restore the hangar from
`chrome.storage.local`.

1. Reads `cacheHash` and `cacheCount` from local storage.
2. Compares `cacheHash` to `HangarXPLOR._activeHash` (computed in `Initialize()`).
3. On mismatch (stale or absent): calls `fallbackFn` (which is `LoadPage`).
4. On match: reads all `cache:N` keys, reconstructs `<li>` elements from the stored
   HTML, calls `ParsePledge` on each, then calls `DrawUI()`.

### `src/web_resources/HangarXPLOR.SaveCache.js`

**`SaveCache(callback)`** — serialises the current inventory to local storage.

1. Clears all existing local storage.
2. Writes each item's `innerHTML` as `cache:N`.
3. Writes `cacheHash` = `_activeHash` and `cacheCount`.
4. Updates `_cacheHash` on the HangarXPLOR object to match.
5. Calls `SaveSettings()` to persist user preferences alongside the cache.

---

## Settings

### `src/web_resources/HangarXPLOR.LoadSettings.js`

**`LoadSettings(callback)`** — reads persisted preferences from
`chrome.storage.sync` and applies them to the `HangarXPLOR` namespace.

Restored values:

| Key | Type | Default | Description |
|---|---|---|---|
| `_type` | string | `'All'` | Active type filter |
| `_sort` | string | `'Purchased'` | Active sort |
| `_pageNo` | number | `1` | Current page |
| `_pageCount` | number | `10` | Items per page |
| `_logEnabled` | bool | `false` | Console logging |
| `_cacheHash` | string/number | `0` | Last known cache hash |
| `_cacheSalt` | string | random | User cache invalidation salt |
| `_feature.LTI` | string | `''` | LTI toggle state |
| `_feature.Warbond` | string | `''` | Warbond toggle state |
| `_feature.Giftable` | string | `''` | Giftable toggle state |
| `_feature.Meltable` | string | `''` | Meltable toggle state |
| `_feature.Upgraded` | string | `''` | Upgraded toggle state |
| `_feature.Valuable` | string | `''` | Valuable toggle state |
| `_feature.Reward` | string | `''` | Reward toggle state |
| `_feature.Summary` | string | `'cash'` | Panel display mode |

### `src/web_resources/HangarXPLOR.SaveSettings.js`

**`SaveSettings()`** — writes the same keys back to `chrome.storage.sync`.
Called after every user interaction that changes a setting, and at the end of
`SaveCache()`.

---

## Export

### `src/web_resources/HangarXPLOR.Download.js`

Handles the "Download JSON" and "Download CSV" buttons.

On module load, fetches `ship-codes.json` (located via the `data-ajax` attribute
on the `#HangarXPLOR-ajax-ship-codes-json` element) and builds
`HangarXPLOR._exportByName` — a lookup map from lowercase ship name to ship record.

**`GetShipList($target)`** — extracts ship data from a jQuery set of pledge
elements:
1. For each pledge, reads name, ID, cost, LTI, date, and Warbond status.
2. For each `.kind:contains(Ship)` inside the pledge:
   - Strips manufacturer prefixes from the displayed ship name.
   - Iterates `_shipMatrix` looking for a substring match (longest first).
   - Uses the matched ship's `export` name (or `name`) to look up the HTF record
     in `_exportByName`.
   - If no match is found, logs an `unidentified` flag in the output and generates
     a best-effort `ship_code` so the export is still usable.
   - Attaches pledge metadata (LTI, Warbond, pledge ID, cost, date) to the record.
3. Returns the array sorted by manufacturer then ship name.

**`DownloadJSON`** — encodes `GetShipList()` output as a JSON data URI and
triggers a browser download as `shiplist.json`.

**`DownloadCSV`** — builds a CSV string with columns
`Manufacturer, Ship, Lti, Warbond, ID, Pledge, Cost, Date` and triggers a download
as `shiplist.csv`.

---

## Storage Shim

### `src/web_resources/shims.chrome.storage.js`

Polyfills `chrome.storage.sync.*` and `chrome.storage.local.*` in the page world
where the real Chrome extension APIs are not available.

Each stub method:
1. Generates a random base64 key.
2. Stores the callback in `callbacks[key]`.
3. Posts a typed message to `window`.
4. `loader.js` receives the message, calls the real API, and posts back a response.
5. The response listener here invokes and deletes the stored callback.

The bridge handles all four operations (`get`, `set`, `remove`, `clear`) for both
`sync` and `local` scopes. Response type names intentionally collapse the scope
(both `sync` and `local` get responses come back as `storage.get.response` etc.)
because the callback key uniquely identifies which call is being answered.

---

## Utilities

### `src/web_resources/HangarXPLOR.Log.js`

**`HangarXPLOR.Log(...args)`** — conditional `console.log`. Only outputs if
`HangarXPLOR._logEnabled` is `true`. Enable at runtime via browser developer tools:
`HangarXPLOR._logEnabled = true`.

### `src/web_resources/HangarXPLOR.Debug.js`

Offline development helper. When enabled (uncomment the include line in
`loader.js`), loads pledge HTML from files in `src/web_resources/debug/` instead
of issuing live XHR requests. Useful for reproducing edge cases without needing
a real RSI account session.

### `src/web_resources/fuse.min.js`

Minified copy of [Fuse.js](https://fusejs.io/) — a lightweight fuzzy-search
library. Used by `Search.js`.

---

## Styling

### `src/web_resources/HangarXPLOR.css`

All extension styles are in a single file. The extension intentionally reuses RSI's
existing CSS class names and design language (corners, borders, content blocks)
where possible so the added UI feels native.

Key selectors:

| Selector | Purpose |
|---|---|
| `.js-inventory` | Applied to `.list-items`; used as a hook for child selectors |
| `.js-inventory h3` | Pledge name headings |
| `.js-selected .row` | Blue highlight on selected items |
| `.js-custom-controls` | Wrapper for the control rows |
| `.js-custom-filter` | Hidden `<input>` storing each filter's active value |
| `.js-custom-sort` | Hidden `<input>` storing active sort |
| `.js-custom-search` | Visible search text input |
| `.js-custom-search-complete` | Ghost autocomplete input overlaid behind search |
| `.js-bulk-ui` | Fixed floating summary panel |
| `.js-bulk-ui .status` | Loading / error status area |
| `.js-bulk-ui .value` | Totals display |
| `.js-bulk-ui .actions` | Melt / Gift buttons |
| `.js-bulk-ui .downloads` | Export buttons |
| `.cash` / `.count` | Display-mode classes toggled on panel and list |

Media queries reduce font sizes and padding at ≤1145 px and ≤1024 px to keep the
floating panel usable at smaller viewport widths.

---

## Maintenance Scripts

### `scripts/refresh-ship-codes.js`

Standalone Node.js script (no dependencies beyond built-in modules) that
re-fetches the RSI ship matrix and regenerates `src/web_resources/ship-codes.json`.

Run with:
```
node scripts/refresh-ship-codes.js
```

**Merge logic**:
- New entries are derived from the live API: `MANUFACTURER_CODE_URL-slug-with-underscores`.
- Manufacturer names are taken from the existing file where available to preserve
  any local formatting preferences.
- Legacy entries (ship codes no longer present in the API, e.g. pre-rename Aurora
  variants) are appended after the new entries so old hangar exports remain valid.
