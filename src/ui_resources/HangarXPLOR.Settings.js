
var noPledgeID    = document.getElementById('noPledgeID');
var noPrefix      = document.getElementById('noPrefix');
var noNickname    = document.getElementById('noNickname');
var summaryValue  = document.getElementById('summaryValue');

// Load current settings and reflect them in the toggles
chrome.storage.sync.get(null, function(settings) {
    noPledgeID.checked   = settings._setting_NoPledgeID  || false;
    noPrefix.checked     = settings._setting_NoPrefix    || false;
    noNickname.checked   = settings._setting_NoNickname  || false;
    summaryValue.checked = (settings._feature_Summary    || 'cash') === 'cash';
});

// Save a setting and reload the active tab so it takes effect
function saveSetting(key, value) {
    var update = {};
    update[key] = value;
    chrome.storage.sync.set(update, function() {
        chrome.tabs.reload();
    });
}

noPledgeID.addEventListener('change',   function() { saveSetting('_setting_NoPledgeID', this.checked); });
noPrefix.addEventListener('change',     function() { saveSetting('_setting_NoPrefix',   this.checked); });
noNickname.addEventListener('change',   function() { saveSetting('_setting_NoNickname', this.checked); });
// Summary toggle updates the page instantly via storage.onChanged — no reload needed
summaryValue.addEventListener('change', function() {
    chrome.storage.sync.set({ _feature_Summary: this.checked ? 'cash' : 'count' });
});

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
