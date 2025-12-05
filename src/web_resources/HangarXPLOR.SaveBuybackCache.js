
var HangarXPLOR = HangarXPLOR || {};

/**
 * Saves buyback pledges to cache
 * Uses separate cache keys prefixed with 'buyback:' to avoid conflicts with hangar cache
 * @param {function} callback - Optional callback function
 */
HangarXPLOR.SaveBuybackCache = function(callback) {
  if (HangarXPLOR._fromCache == true) return;

  HangarXPLOR.Log('Saving buyback cache with', HangarXPLOR._buybackRaw.length, 'items');

  var cacheItems = {};

  $.each(HangarXPLOR._buybackRaw, function(index, item) {
    cacheItems['buyback:cache:' + index] = item;
  });

  cacheItems['buyback:cache:count'] = HangarXPLOR._buybackRaw.length;
  cacheItems['buyback:cache:hash'] = HangarXPLOR._buybackActiveHash;

  HangarXPLOR._buybackCacheHash = HangarXPLOR._buybackActiveHash;

  // Clean up raw array
  delete HangarXPLOR._buybackRaw;

  // Clear only buyback-related cache keys, not all storage
  chrome.storage.local.get(null, function(existingCache) {
    var keysToRemove = [];

    // Find existing buyback cache keys to remove
    for (var key in existingCache) {
      if (key.indexOf('buyback:cache:') === 0) {
        keysToRemove.push(key);
      }
    }

    // Remove old buyback cache keys
    if (keysToRemove.length > 0) {
      chrome.storage.local.remove(keysToRemove, function() {
        // Save new buyback cache, then persist settings
        chrome.storage.local.set(cacheItems, function() {
          HangarXPLOR.SaveSettings(callback);
        });
      });
    } else {
      // No old keys to remove, just save and persist settings
      chrome.storage.local.set(cacheItems, function() {
        HangarXPLOR.SaveSettings(callback);
      });
    }
  });
};
