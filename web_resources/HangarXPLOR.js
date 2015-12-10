
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR.$list = null;                            // Element where we display the pledges
HangarXPLOR._inventory = [];                         // Inventory containing all pledges
HangarXPLOR._debugRoot = $('#xplor-js-1').attr('src').replace(/(.*)web_resources.*/, "$1");

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
