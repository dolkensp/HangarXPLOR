
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR.$list = null;                            // Element where we display the pledges
HangarXPLOR._inventory = [];                         // Inventory containing all pledges
HangarXPLOR._debugRoot = $('#HangarXPLOR-js-1').attr('src').replace(/(.*)web_resources.*/, "$1");
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
      delete $lists;
      
      HangarXPLOR.UpdateStatus(0);
      
      RSI.Api.Account.pledgeLog((payload) => {
        HangarXPLOR._activeHash = payload.data.rendered.length + ':' + payload.data.rendered.substr(39, 20);
        
        HangarXPLOR.LoadCache(HangarXPLOR.LoadPage);
      });
      
    } else {
      HangarXPLOR.Log('Error locating inventory');
    }
  });
}

HangarXPLOR.Initialize();
