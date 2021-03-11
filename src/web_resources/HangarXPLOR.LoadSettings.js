
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR.LoadSettings = function(callback)
{
  chrome.storage.sync.get(null, function(settings) {
    settings = settings || {};
    
    HangarXPLOR                     = HangarXPLOR || {};
    HangarXPLOR._type               = settings._type || 'All';
    HangarXPLOR._sort               = settings._sort || 'Purchased';
    HangarXPLOR._pageNo             = settings._pageNo || 1;
    HangarXPLOR._pageCount          = settings._pageCount || 10;
    HangarXPLOR._logEnabled         = settings._logEnabled || false;
    HangarXPLOR._cacheHash          = settings._cacheHash || 0;
    HangarXPLOR._cacheSalt          = settings._cacheSalt || btoa(Math.random());
    
    HangarXPLOR._feature            = HangarXPLOR._feature       || {};
    HangarXPLOR._feature.LTI        = settings._feature_LTI      || '';
    HangarXPLOR._feature.Warbond    = settings._feature_Warbond  || '';
    HangarXPLOR._feature.Giftable   = settings._feature_Giftable || '';
    HangarXPLOR._feature.Meltable   = settings._feature_Meltable || '';
    HangarXPLOR._feature.Upgraded   = settings._feature_Upgraded || '';
    HangarXPLOR._feature.Valuable   = settings._feature_Valuable || '';
    HangarXPLOR._feature.Reward     = settings._feature_Reward   || '';
    HangarXPLOR._feature.Summary    = settings._feature_Summary  || 'cash';

    HangarXPLOR._setting            = HangarXPLOR._setting       || {};
    HangarXPLOR._setting.NoPledgeID = settings._setting_NoPledgeID || false;
    HangarXPLOR._setting.NoPrefix   = settings._setting_NoPrefix   || false;
    HangarXPLOR._setting.NoNickname = settings._setting_NoNickname || false;
    
    HangarXPLOR.Log('Loaded Settings', settings);
    
    if (typeof callback === 'function') callback.call(this);
  });
}
