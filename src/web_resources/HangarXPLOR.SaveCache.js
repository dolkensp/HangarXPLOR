
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR.SaveCache = function(callback)
{
  if (HangarXPLOR._fromCache == true) return;
  
  var cacheItems = {};
  
  $.each(HangarXPLOR._raw, (index, item) => {
    cacheItems['cache:' + index] = item;
  });
  
  cacheItems['cache:count'] = HangarXPLOR._raw.length;
  cacheItems['cache:hash'] = HangarXPLOR._activeHash;
  
  delete HangarXPLOR._raw;
  
  chrome.storage.local.clear();
  chrome.storage.local.set(cacheItems);
  
  HangarXPLOR._cacheHash = HangarXPLOR._activeHash;
  
  HangarXPLOR.SaveSettings(callback);
}
