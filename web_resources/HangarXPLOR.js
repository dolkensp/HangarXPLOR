
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR.$list = null;                            // Element where we display the pledges
HangarXPLOR._inventory = [];                         // Inventory containing all pledges
HangarXPLOR._debugRoot = $('#HangarXPLOR-js-1').attr('src').replace(/(.*)web_resources.*/, "$1");
HangarXPLOR._pageNo = 1;
HangarXPLOR._pageCount = $.cookie('HangarXPLOR._pageCount') || 10;

HangarXPLOR._shipCount     = HangarXPLOR._shipCount || 0;
HangarXPLOR._upgradeCount  = HangarXPLOR._upgradeCount || 0;
HangarXPLOR._giftableCount = HangarXPLOR._giftableCount || 0;
HangarXPLOR._packageCount  = HangarXPLOR._packageCount || 0;
HangarXPLOR._ltiCount      = HangarXPLOR._ltiCount || 0;
  
HangarXPLOR.Initialize = function()
{
  var $lists = $('.list-items');
  
  if ($lists.length == 1) {
    HangarXPLOR.$list = $($lists[0]);
    HangarXPLOR.$list.addClass('js-inventory');
    delete $lists;
    HangarXPLOR.LoadPage(1);
  } else {
    console.log('Error locating inventory');
  }
}

$(document).ready(HangarXPLOR.Initialize);
