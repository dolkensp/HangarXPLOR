
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR.SaveSettings = function(callback)
{
  HangarXPLOR = HangarXPLOR || {};
  HangarXPLOR._feature = HangarXPLOR._feature || {};
  
  var settings                 = settings || {};
  settings._type               = HangarXPLOR._type || 'All';
  settings._sort               = HangarXPLOR._sort || 'Purchased';
  settings._pageNo             = HangarXPLOR._pageNo || 1;
  settings._pageCount          = HangarXPLOR._pageCount || 10;
  settings._logEnabled         = HangarXPLOR._logEnabled || false;
  settings._cacheHash          = HangarXPLOR._cacheHash || 0;
  settings._cacheSalt          = HangarXPLOR._cacheSalt || btoa(Math.random());
  
  settings._feature_LTI        = HangarXPLOR._feature.LTI      || '';
  settings._feature_Warbond    = HangarXPLOR._feature.Warbond  || '';
  settings._feature_Giftable   = HangarXPLOR._feature.Giftable || '';
  settings._feature_Meltable   = HangarXPLOR._feature.Meltable || '';
  settings._feature_Upgraded   = HangarXPLOR._feature.Upgraded || '';
  settings._feature_Valuable   = HangarXPLOR._feature.Valuable || '';
  settings._feature_Reward     = HangarXPLOR._feature.Reward   || '';
  settings._feature_Summary    = HangarXPLOR._feature.Summary  || 'cash';

  settings._setting_NoPledgeID = HangarXPLOR._setting.NoPledgeID || false;
  settings._setting_NoPrefix   = HangarXPLOR._setting.NoPrefix   || false;
  settings._setting_NoNickname = HangarXPLOR._setting.NoNickname || false;
  
  HangarXPLOR.Log('Saved Settings', settings);
  
  chrome.storage.sync.set(settings);
  
  if (typeof callback === 'function') callback.call(this);
}
