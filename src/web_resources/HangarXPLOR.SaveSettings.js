
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR.SaveSettings = function()
{
  HangarXPLOR = HangarXPLOR || {};
  HangarXPLOR._feature = HangarXPLOR._feature || {};
  
  var settings = settings || {};
  settings._type = HangarXPLOR._type || 'All';
  settings._sort = HangarXPLOR._sort || 'Purchased';
  settings._pageNo = HangarXPLOR._pageNo || 1;
  settings._pageCount = HangarXPLOR._pageCount || 10;
  settings._logEnabled = HangarXPLOR._logEnabled || false;
  
  settings._feature_LTI = HangarXPLOR._feature.LTI || '';
  settings._feature_Warbond = HangarXPLOR._feature.Warbond || '';
  settings._feature_Giftable = HangarXPLOR._feature.Giftable || '';
  settings._feature_Meltable = HangarXPLOR._feature.Meltable || '';
  settings._feature_Upgraded = HangarXPLOR._feature.Upgraded || '';
  settings._feature_Valuable = HangarXPLOR._feature.Valuable || '';
  settings._feature_Reward = HangarXPLOR._feature.Reward || '';
  settings._feature_Summary = HangarXPLOR._feature.Summary || 'cash';
  
  HangarXPLOR.Log('Saved Settings', settings);
  
  chrome.storage.sync.set(settings);
}
