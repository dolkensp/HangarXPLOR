
var HangarXPLOR = HangarXPLOR || {};

/**
 * Loads buyback pledges from cache if available and valid
 * Uses separate cache keys prefixed with 'buyback:' to avoid conflicts with hangar cache
 * @param {function} callback - Function to call if cache is invalid/missing
 */
HangarXPLOR.LoadBuybackCache = function(callback) {
  HangarXPLOR.Log('Load Buyback Cache');

  chrome.storage.local.get(null, function(cache) {

    if (HangarXPLOR._buybackCacheHash == HangarXPLOR._buybackActiveHash &&
        cache['buyback:cache:hash'] == HangarXPLOR._buybackCacheHash &&
        cache['buyback:cache:count'] > 0)
    {
      HangarXPLOR._fromCache = true;

      HangarXPLOR.Log('Using buyback cache with', cache['buyback:cache:count'], 'items');

      for (var i = 0; i < cache['buyback:cache:count']; i++) {
        HangarXPLOR.ParseBuybackPledge.apply($(cache['buyback:cache:' + i])[0]);
      }

      HangarXPLOR.DrawBuybackUI();
      return;
    }

    HangarXPLOR.Log('Buyback cache invalid or missing, loading fresh data');
    HangarXPLOR._fromCache = false;

    // Reset counts before loading fresh data
    HangarXPLOR._buybackCounts = {
      total: 0,
      ships: 0,
      paints: 0,
      upgrades: 0,
      packages: 0,
      addons: 0,
      subscriber: 0,
      other: 0,
      available: 0,
      unavailable: 0
    };

    if (typeof callback === 'function') callback.call(this);
  });
};
