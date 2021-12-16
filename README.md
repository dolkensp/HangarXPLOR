# HangarXPLOR [![Build status](https://ci.appveyor.com/api/projects/status/7j87vur0plpw74vx/branch/release?svg=true)](https://ci.appveyor.com/project/dolkensp/hangarxplor/branch/release)

This project aims to improved the default Hangar page at https://robertsspaceindustries.com/account/pledges.

Current features include:
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

TODO:(pv) 
* Add note field for each item (so that I can mention specific plans for specific item(s)) 
  * This may require hooking in to cloud database/storage (Firebase?) to persist data 
  * May be able to just use `$.cookie('HangarXPLOR.Type', value)` type of logic 
* Add ability to re-order the list on-demand and persist the order 
  * May be able to just use `$.cookie('HangarXPLOR.Type', value)` type of logic 

## Browser Support 

* [Google Chrome Extension](https://chrome.google.com/webstore/detail/hangarxplor/bhkgemjdepodofcnmekdobmmbifemhkc/)
* [Firefox Add-On](https://addons.mozilla.org/en-US/firefox/addon/star-citizen-hangar-xplorer/)
* [Opera Add-On](https://addons.opera.com/en-gb/extensions/details/star-citizen-hangar-xplorer/)
* Edge - On Hold
* Safari - Not Scheduled

# Screenshots

![New and improved UI](https://i.imgur.com/RNndHdv.png "New and improved UI")
