
var noPledgeID = document.getElementById('noPledgeID');
var noPrefix   = document.getElementById('noPrefix');
var noNickname = document.getElementById('noNickname');

// Load current settings and reflect them in the toggles
chrome.storage.sync.get(null, function(settings) {
    noPledgeID.checked = settings._setting_NoPledgeID || false;
    noPrefix.checked   = settings._setting_NoPrefix   || false;
    noNickname.checked = settings._setting_NoNickname || false;
});

// Save a display setting and reload the active tab so it takes effect
function saveDisplaySetting(key, value) {
    var update = {};
    update[key] = value;
    chrome.storage.sync.set(update, function() {
        chrome.tabs.reload();
    });
}

noPledgeID.addEventListener('change', function() { saveDisplaySetting('_setting_NoPledgeID', this.checked); });
noPrefix.addEventListener('change',   function() { saveDisplaySetting('_setting_NoPrefix',   this.checked); });
noNickname.addEventListener('change', function() { saveDisplaySetting('_setting_NoNickname', this.checked); });

// Clear cache
document.getElementById('clearCache').addEventListener('click', function() {
    chrome.storage.sync.get(null, function(settings) {
        settings._cacheSalt = btoa(Math.random());
        chrome.storage.sync.set(settings, function() {
            chrome.tabs.reload();
            window.close();
        });
    });
});
