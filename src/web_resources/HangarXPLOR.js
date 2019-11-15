
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR.$list = null;                            // Element where we display the pledges
HangarXPLOR._inventory = [];                         // Inventory containing all pledges
HangarXPLOR._debugRoot = $('#HangarXPLOR-js-1').attr('src').replace(/(.*)web_resources.*/, "$1");

HangarXPLOR.LoadSettings = function(callback)
{
  chrome.storage.sync.get(null, function(settings) {
    settings = settings || {};
    
    HangarXPLOR = HangarXPLOR || {};
    HangarXPLOR._type = settings._type || 'All';
    HangarXPLOR._sort = settings._sort || 'Purchased';
    HangarXPLOR._pageNo = settings._pageNo || 1;
    HangarXPLOR._pageCount = settings._pageCount || 10;
    HangarXPLOR._logEnabled = settings._logEnabled || true;
    
    HangarXPLOR._feature = HangarXPLOR._feature || {};
    HangarXPLOR._feature.LTI = settings._feature_LTI || '';
    HangarXPLOR._feature.Warbond = settings._feature_Warbond || '';
    HangarXPLOR._feature.Giftable = settings._feature_Giftable || '';
    HangarXPLOR._feature.Meltable = settings._feature_Meltable || '';
    HangarXPLOR._feature.Upgraded = settings._feature_Upgraded || '';
    HangarXPLOR._feature.Valuable = settings._feature_Valuable || '';
    HangarXPLOR._feature.Reward = settings._feature_Reward || '';
    HangarXPLOR._feature.Summary = settings._feature_Summary || 'count';
    
    HangarXPLOR.Log('Loaded Settings', settings);
    
    if (typeof callback === 'function') callback.call(this);
  });
}

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

HangarXPLOR._shipCount     = HangarXPLOR._shipCount || 0;
HangarXPLOR._upgradeCount  = HangarXPLOR._upgradeCount || 0;
HangarXPLOR._giftableCount = HangarXPLOR._giftableCount || 0;
HangarXPLOR._packageCount  = HangarXPLOR._packageCount || 0;
HangarXPLOR._ltiCount      = HangarXPLOR._ltiCount || 0;
  
HangarXPLOR.Initialize = function()
{
  HangarXPLOR.LoadSettings(function() {
    var $lists = $('.list-items');
    
    if ($lists.length == 1) {
      HangarXPLOR.BulkUI();
      HangarXPLOR.$list = $($lists[0]);
      HangarXPLOR.$list.addClass('js-inventory');
      $lists = undefined;
      HangarXPLOR.LoadPage(1);
    } else {
      HangarXPLOR.Log('Error locating inventory');
    }
  });
}

HangarXPLOR.Initialize();
