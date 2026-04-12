# Architecture

## Why a content-script injection model?

Browser extensions can modify pages in two ways: via a **popup** (separate window)
or by injecting code directly into the host page. HangarXPLOR uses the injection
model because the RSI hangar is a full page application — the extension needs to
intercept the existing DOM, reuse RSI's own jQuery, and issue same-origin XHR
requests to `/account/pledges` under the user's authenticated session. A popup
cannot do any of that.

The Manifest V3 security model draws a hard boundary between the **content script
world** (runs in a privileged extension sandbox) and the **page world** (runs
alongside the host page's own JavaScript). Extension APIs like `chrome.storage`
are only available in the content script world. The application logic lives in the
page world so it can share the page's `window` and jQuery. This creates a messaging
requirement that is handled by the [storage bridge](#the-postmessage-storage-bridge).

## Execution sequence

```
Browser navigates to /account/pledges
        │
        ▼
loader.js  (content script world)
  ├─ Inject <link> for HangarXPLOR.css into <head>
  ├─ Append <script type="text/x-ajax-url"> tags for JSON data files
  ├─ Register window.postMessage listener (storage bridge)
  └─ Call loadScript() → appends scripts to <body> one at a time,
       each script's onload triggers the next (reverse order of scripts[])
        │
        ▼  (page world — all subsequent code runs here)
shims.chrome.storage.js   loaded last, polyfills chrome.storage.* API
        │
        ▼
HangarXPLOR.js            defines global HangarXPLOR namespace + Initialize()
        │
        ├─ GET /ship-matrix/index
        │     └─ merges API data with Ships.js overrides → _shipMatrix[]
        │         └─ builds _componentMatrix[] from Components.js
        │
        ├─ LoadSettings()  → chrome.storage.sync.get (via bridge)
        │
        ├─ BulkUI()        → creates floating summary panel
        │
        ├─ RSI.Api.Account.pledgeLog()  → fetches first-page HTML to derive cache hash
        │
        └─ LoadCache() ──── cache hit ──→ ParsePledge × N → DrawUI() → done
                    │
                 cache miss
                    │
                    ▼
              LoadPage(1)
                    │
              ProcessPage()
                ├─ ParsePledge × N  (once per <li>)
                ├─ DrawUI()  on first page  ──→ Render()
                │   or  Render() + RefreshBulkUI() + RefreshPager()  on later pages
                └─ isEmpty or < 10 items? ──yes──→ SaveCache() + MarkLoadingComplete()
                                          └─no──→ LoadPage(N+1)  [loop]
```

## Module map

The scripts array in `loader.js` is popped (LIFO), so the **last entry in the
array is the first to load**. Reading bottom-to-top gives the actual load order:

```
shims.chrome.storage.js           ← loaded first; must be ready before any storage call
HangarXPLOR.BulkUI.js
HangarXPLOR.Button.js
HangarXPLOR.Components.js
HangarXPLOR.DrawUI.js
HangarXPLOR.Dropdown.js
HangarXPLOR.Filter.js
HangarXPLOR.LoadPage.js
HangarXPLOR.LoadSettings.js
HangarXPLOR.LoadCache.js
HangarXPLOR.Log.js
HangarXPLOR.ProcessPage.js
HangarXPLOR.PreProcess.js
HangarXPLOR.ParseUpgrade.js
HangarXPLOR.ParseSkin.js
HangarXPLOR.ParseShip.js
HangarXPLOR.ParseReward.js
HangarXPLOR.ParsePledge.js        ← orchestrates all Parse* modules
HangarXPLOR.ParseHangar.js
HangarXPLOR.ParseEquipment.js
HangarXPLOR.ParseDecoration.js
HangarXPLOR.ParseCoupon.js
HangarXPLOR.ParseComponent.js
HangarXPLOR.Pager.js
HangarXPLOR.Render.js
HangarXPLOR.SaveSettings.js
HangarXPLOR.SaveCache.js
HangarXPLOR.Search.js
HangarXPLOR.SearchBox.js
HangarXPLOR.Ships.js
HangarXPLOR.Sort.js
HangarXPLOR.Templates.js
HangarXPLOR.Toggle.js
HangarXPLOR.Download.js
HangarXPLOR.js                    ← second-to-last; calls Initialize() once everything is defined
fuse.min.js                       ← loaded last (index 0 in array, popped last)
```

## The postMessage storage bridge

`chrome.storage` is not accessible from the page world. HangarXPLOR solves this
with a two-sided bridge:

**Page side** — `shims.chrome.storage.js`  
Replaces `chrome.storage.sync.*` and `chrome.storage.local.*` with stubs that:
1. Register a callback in an in-memory map, keyed by a random base64 string.
2. Post a message to `window` with a typed request and the callback key.
3. Listen for the matching response message and invoke the stored callback.

**Content-script side** — `loader.js`  
Listens for `window.postMessage` events and dispatches to the real
`chrome.storage` API. Sends the result back via another `postMessage`.

```
Injected script           window.postMessage          loader.js (content script)
─────────────────────────────────────────────────────────────────────────────────
chrome.storage.sync.get   ──→  storage.sync.get.request  ──→  chrome.storage.sync.get()
callback registered                                               │
                          ←──  storage.get.response      ←──────┘
callback invoked, deleted
```

Both sides filter on `event.source === window` to ignore cross-origin messages.
Request types follow the pattern `storage.{scope}.{op}.request`;
response types collapse to `storage.{op}.response`.

## Data model

Every pledge parsed from the RSI page is stored as a decorated DOM `<li>` element
in `HangarXPLOR._inventory[]`. The DOM element is extended with plain-object
properties:

```javascript
{
  // Pledge metadata (from hidden <input> elements on the page)
  pledge_name: string,
  pledge_id:   number,
  pledge_cost: string,    // e.g. "$45.00 USD"
  melt_value:  number,    // parsed float

  // Display
  displayName: string,
  pledge_type: string,    // 'ship' | 'combo' | 'component' | 'upgrade' | …

  // Ship-specific
  ship_name:  string,
  nickname:   string,
  serial:     string,

  // Upgrade-specific
  upgrade_data: { match_items: [], target_items: [] },

  // Boolean flags — used by Filter.js
  filters: {
    is_ship, has_ship, is_package, is_combo,
    has_squadron, has_starcitizen,
    is_warbond, is_lti,
    is_meltable, is_giftable,
    is_upgrade, is_upgraded,
    is_component, has_component,
    is_equipment, has_equipment,
    is_skin, has_skin,
    is_decoration, has_decoration,
    is_reward, is_coupon,
    is_nameable, has_nickname, has_serial,
    has_value,
    is_selected,
    isModel, isPoster, isSpacePlant, isAddOn, isFlair  // decoration sub-types
  }
}
```

## Ship matrix

On startup, `HangarXPLOR.Initialize()` fetches `/ship-matrix/index` and builds
`_shipMatrix[]` — an array of normalised ship objects sorted **longest name first**
so that substring matching always picks the most specific match:

```javascript
{
  name:        string,   // manufacturer prefix stripped
  displayName: string,   // optional override from Ships.js
  thumbnail:   string,   // URL from RSI media
  url:         string,   // RSI pledge page URL
  focus:       string,   // e.g. "Combat", "Exploration"
  export:      string,   // optional export name override for HTF
}
```

`Ships.js` contains a hand-maintained override map that fills gaps in the API data
and fixes naming inconsistencies. Any key in `_ships` that doesn't correspond to an
API entry is appended to `_shipMatrix` as an extra entry.

## Caching strategy

The cache stores the **raw inner HTML** of every `<li>` pledge element in
`chrome.storage.local`, keyed as `cache:0`, `cache:1`, … plus a `cacheHash` and
`cacheCount`.

The cache hash is built from:
- A hard-coded safety salt (bumped manually when RSI makes breaking changes)
- The byte-length of the first-page rendered HTML
- A base64 sample of the first-page rendered HTML
- The user's random `_cacheSalt` (can be rotated via "Clear Cache" in settings)

This means the cache self-invalidates whenever the user's hangar changes (new
purchase, an upgrade applied, etc.) because the first-page HTML changes length or
content. The user can also force-invalidate by clicking "Clear Cache" in the
extension popup, which generates a new `_cacheSalt`.

On a cache hit, `LoadCache` re-parses the stored HTML through `ParsePledge` and
calls `DrawUI` directly, skipping all network requests to `/account/pledges`.

## Render pipeline

Every user interaction that changes what is displayed (filter, sort, search, page
change) flows through `HangarXPLOR.Render()`:

```
_inventory[]
    │
    ├─ Filter(list, filter)  ×N  (one call per active .js-custom-filter value)
    │
    ├─ Search(list, term)        (Fuse.js fuzzy search if term ≥ 2 chars)
    │
    ├─ Sort(list, sort)
    │
    ├─ slice for current page   (_pageNo, _pageCount)
    │
    └─ empty $list, append visible items
```

Settings (active filter, sort, page number, items-per-page) are persisted to
`chrome.storage.sync` after every user interaction via `SaveSettings()`.

## Rate-limit handling

RSI returns HTTP 429 when too many requests arrive in a short window.
`LoadPage.js` handles this with exponential backoff:

- Attempts: up to `_maxRetries` (5)
- Delay per attempt: `_retryDelay × attemptNumber` (default 5 s, 10 s, 15 s …)
- Additionally, all requests after page 50 are throttled with a `_throttleDelay`
  (500 ms) between each page to reduce the chance of hitting the limit in the
  first place.
- The floating panel shows the current retry state so the user knows the extension
  is still working.
