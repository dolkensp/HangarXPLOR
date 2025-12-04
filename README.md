# HangarXPLOR [![Build status](https://ci.appveyor.com/api/projects/status/7j87vur0plpw74vx/branch/release?svg=true)](https://ci.appveyor.com/project/dolkensp/hangarxplor/branch/release)

This project aims to improve the default Hangar and Buyback pages at https://robertsspaceindustries.com/account/pledges.

## Hangar Page Features

* Pre-load ALL pages of your hangar at once
* Correct the thumbnail image for upgraded ships
* Correct the name of upgraded ships for easier searching
* Modified filtering, allowing more accurate grouping of ships/packages/flair and upgrades
* See each individual Pledge IDs to assist with upgrades
* Filter on Value / LTI / Gift / Warbond status, etc.
* See what the base item in a package was
* See the melt value of each item in your hangar
* Cache your hangar for faster load times
* Export your ships in [Hangar Transfer Format](https://docs.starcitizen.fans/) for use with other apps
* Export your ships in CSV format

## Buyback Page Features

* Pre-load ALL pages of your buyback queue at once
* Filter by type: Ships, Game Packages, Upgrades, Paints, Add-Ons, Components, Weapons, Hangar Decorations, Subscriber Items
* Sort by: Recent First, Name A-Z, Name Z-A, Type, Last Modified
* Search across item names, types, and contained items
* Pagination controls with customizable items per page
* Summary panel showing total item counts by type
* Export buyback items in JSON or CSV format

## Browser Support 

* [Google Chrome Extension](https://chrome.google.com/webstore/detail/hangarxplor/bhkgemjdepodofcnmekdobmmbifemhkc/)
* [Firefox Add-On](https://addons.mozilla.org/en-US/firefox/addon/star-citizen-hangar-xplorer/)
* [Opera Add-On](https://addons.opera.com/en-gb/extensions/details/star-citizen-hangar-xplorer/)
* Edge - On Hold
* Safari - Not Scheduled

## Documentation

Detailed documentation is available in the [docs/](docs/) folder:

* **[User Guide](docs/USER_GUIDE.md)** - Installation, features, and usage instructions
* **[Developer Guide](docs/DEVELOPER_GUIDE.md)** - Architecture, build system, and API reference
* **[Parsing System](docs/PARSING_SYSTEM.md)** - How pledge data is extracted from RSI pages
* **[UI Components](docs/UI_COMPONENTS.md)** - UI component factories and rendering pipeline
* **[AI Agent Context](docs/AI_AGENT_CONTEXT.md)** - Comprehensive reference for AI-assisted development

# Screenshots

![New and improved UI](https://i.imgur.com/RNndHdv.png "New and improved UI")
