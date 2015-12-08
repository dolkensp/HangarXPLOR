
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR.$list = null;                            // Element where we display the pledges
HangarXPLOR._debugMode = $.cookie('debug') || false; // Enable debug mode via cookie
HangarXPLOR._inventory = [];                         // Inventory containing all pledges

HangarXPLOR.Initialize = function()
{
  var $lists = $('.list-items');
  
  if ($lists.length == 2) {
    HangarXPLOR.$list = $($lists[1]);
    HangarXPLOR.$list.addClass('js-inventory');
    delete $lists;
    HangarXPLOR.LoadPage(1);
  } else {
    console.log('Error locating inventory');
  }
}

HangarXPLOR.Initialize();
