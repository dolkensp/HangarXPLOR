# HangarXPLOR [![Build status](https://ci.appveyor.com/api/projects/status/7j87vur0plpw74vx/branch/master?svg=true)](https://ci.appveyor.com/project/dolkensp/hangarxplor/branch/master)

This project aims to improved the default Hangar page at https://robertsspaceindustries.com/account/pledges.

Current features include:
* Pre-load ALL pages of your hangar at once
* Automatic application of UX changes
* Modified filtering, allowing more accurate grouping of ships/packages/flair and upgrades
* Upgrade button in titles are preserved
* See each individual pledge Id to assist with upgrades
* Filter on Value / LTI / Gift status, etc.
* See what the base item in a package was
* See the correct ship image for upgraded ships
* See the melt value of each item in your hangar
* Correct the name of upgraded ships for easier searching

TODO:(pv) 
* Add note field for each item (so that I can mention specific plans for specific item(s)) 
  * This may require hooking in to cloud database/storage (Firebase?) to persist data 
  * May be able to just use `$.cookie('HangarXPLOR.Type', value)` type of logic 
* Add ability to re-order the list on-demand and persist the order 
  * May be able to just use `$.cookie('HangarXPLOR.Type', value)` type of logic 

# Google Chrome Extension

https://chrome.google.com/webstore/detail/hangarxplor/bhkgemjdepodofcnmekdobmmbifemhkc/

# Firefox Add-On

https://addons.mozilla.org/en-US/firefox/addon/star-citizen-hangar-xplorer/

# Safari Add-On

** Not Scheduled **

# Screenshots

![New and improved UI](http://i.imgur.com/Om3Zzbv.png "New and improved UI")
