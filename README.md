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

## Browser Support 

* [Google Chrome Extension](https://chrome.google.com/webstore/detail/hangarxplor/bhkgemjdepodofcnmekdobmmbifemhkc/)
* [Firefox Add-On](https://addons.mozilla.org/en-US/firefox/addon/star-citizen-hangar-xplorer/)
* [Opera Add-On](https://addons.opera.com/en-gb/extensions/details/star-citizen-hangar-xplorer/)
* Edge - On Hold
* Safari - See below for manual build instructions

## Building for Safari

Safari Web Extensions must be wrapped in a native macOS app using Xcode. Requirements:
- macOS with Xcode installed (not just the Command Line Tools)
- Safari 16.4 or later

**Steps:**

1. Ensure `xcode-select` points at Xcode.app, not the standalone Command Line Tools (required for `safari-web-extension-converter` to be found):
   ```
   sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
   ```

2. Build the extension (replace `1.0.0.0` with the desired version):
   ```
   npm install
   node build.js 1.0.0.0
   ```

3. Convert the output directory to an Xcode project:
   ```
   xcrun safari-web-extension-converter dist/HangarXPLOR-safari-v1.0.0.0 \
     --project-location dist \
     --app-name HangarXPLOR-Safari \
     --bundle-identifier com.hangarxplor.safari
   ```

4. Build the Xcode project from the command line. Note: the scheme name includes a platform suffix — use the macOS one:
   ```
   xcodebuild -project dist/HangarXPLOR-Safari/HangarXPLOR-Safari.xcodeproj \
     -scheme "HangarXPLOR-Safari (macOS)" \
     -configuration Debug \
     -destination 'platform=macOS' \
     build
   ```
   If you're unsure of the scheme names for a given project, you can list them with:
   ```
   xcodebuild -project dist/HangarXPLOR-Safari/HangarXPLOR-Safari.xcodeproj -list
   ```

5. Open the built `.app` from `~/Library/Developer/Xcode/DerivedData/` to register the extension with Safari.

6. Enable unsigned extensions in Safari. This must be repeated each time Safari is relaunched:
   - Go to **Safari → Settings → Advanced** and enable **"Show features for web developers"**
   - In the **Develop** menu that appears in the menu bar, click **"Allow Unsigned Extensions"** and enter your password when prompted

7. In Safari, go to **Safari → Settings → Extensions**, enable HangarXPLOR, and grant permission for `robertsspaceindustries.com`.

# Screenshots

![New and improved UI](https://i.imgur.com/RNndHdv.png "New and improved UI")
