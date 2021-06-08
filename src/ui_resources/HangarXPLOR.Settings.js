
document.getElementById('clearCache').addEventListener("click", function() {
    chrome.storage.sync.get(null, function(settings) {
        settings._cacheSalt  = btoa(Math.random());

        chrome.storage.sync.set(settings, () => {
            chrome.tabs.reload();
            window.close();
        });
    });
});
