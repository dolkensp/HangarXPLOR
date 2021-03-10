
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR.$list = null;                            // Element where we display the pledges
HangarXPLOR._inventory = [];                         // Inventory containing all pledges
HangarXPLOR._debugRoot = $('#HangarXPLOR-js-1').attr('src').replace(/(.*)web_resources.*/, "$1");
HangarXPLOR._shipCount     = HangarXPLOR._shipCount || 0;
HangarXPLOR._upgradeCount  = HangarXPLOR._upgradeCount || 0;
HangarXPLOR._giftableCount = HangarXPLOR._giftableCount || 0;
HangarXPLOR._packageCount  = HangarXPLOR._packageCount || 0;
HangarXPLOR._ltiCount      = HangarXPLOR._ltiCount || 0;
HangarXPLOR._cacheSalt     = HangarXPLOR._cacheSalt || btoa(Math.random());

var RSI = RSI || {};

HangarXPLOR.Initialize = function()
{
  HangarXPLOR.LoadSettings(function() {
    var $lists = $('.list-items');
    
    if ($lists.length == 1) {
      HangarXPLOR.BulkUI();
      HangarXPLOR.$list = $($lists[0]);
      HangarXPLOR.$list.addClass('js-inventory');
      $lists = undefined;
      
      HangarXPLOR.UpdateStatus(0);
      
      RSI.Api.Account.pledgeLog((payload) => {

        var today = new Date().toISOString();
        var safetySalt = '';

        // CIG Released ship naming in March 2021, which requires us to invalidate cache
        if (today.substr(0, 7) == '2021-03') safetySalt = today.substr(0, 13) + ':';

        HangarXPLOR._activeHash = safetySalt + payload.data.rendered.length + ':' + btoa(payload.data.rendered.substr(39, 20)) + ':' + HangarXPLOR._cacheSalt;
        
        HangarXPLOR.LoadCache(HangarXPLOR.LoadPage);
      });
      
    } else {
      HangarXPLOR.Log('Error locating inventory');
    }
  });
}

HangarXPLOR.Initialize();
