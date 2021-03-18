
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR.LoadCache = function(callback)
{
  HangarXPLOR.Log('Load Cache');
  
  chrome.storage.local.get(null, (cache) => {
    
    if (HangarXPLOR._cacheHash == HangarXPLOR._activeHash &&
        cache['cache:hash'] == HangarXPLOR._cacheHash &&
        cache['cache:count'] > 0)
    {
      HangarXPLOR._fromCache = true;
      
      for (var i = 0; i < cache['cache:count']; i++) { HangarXPLOR.ParsePledge.apply($(cache['cache:' + i])[0]) }
      
      HangarXPLOR.DrawUI();
      return;
    }
    
    HangarXPLOR._fromCache = false;
    if (typeof callback === 'function') callback.call(this);
    
  });
}
