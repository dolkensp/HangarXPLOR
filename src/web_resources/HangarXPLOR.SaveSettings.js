
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR.SaveSettings = function()
{
  HangarXPLOR = HangarXPLOR || {};
  HangarXPLOR._feature = HangarXPLOR._feature || {};
  
  var settings               = settings || {};
  settings._type             = HangarXPLOR._type || 'HasShipOrIsUpgradeOrIsAddOn';
  settings._sort             = HangarXPLOR._sort || 'Value';
  settings._pageNo           = HangarXPLOR._pageNo || 1;
  settings._pageCount        = HangarXPLOR._pageCount || 9999;
  settings._logEnabled       = HangarXPLOR._logEnabled || true;
  settings._cacheHash        = HangarXPLOR._cacheHash || 0;
  
  settings._feature_LTI      = HangarXPLOR._feature.LTI      || '';
  settings._feature_Warbond  = HangarXPLOR._feature.Warbond  || '';
  settings._feature_Giftable = HangarXPLOR._feature.Giftable || '';
  settings._feature_Meltable = HangarXPLOR._feature.Meltable || '';
  settings._feature_Upgraded = HangarXPLOR._feature.Upgraded || '';
  settings._feature_Valuable = HangarXPLOR._feature.Valuable || '';
  settings._feature_Reward   = HangarXPLOR._feature.Reward   || '';
  settings._feature_Summary  = HangarXPLOR._feature.Summary  || 'count';
  
  HangarXPLOR.Log('Saved Settings', settings);
  
  chrome.storage.sync.set(settings);
}
