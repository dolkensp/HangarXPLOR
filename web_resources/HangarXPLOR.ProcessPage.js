
var HangarXPLOR = HangarXPLOR || {};

// Pre-process all the items in a document, then load the next page, or render the UI
HangarXPLOR.ProcessPage = function($page, pageNo)
{
  var $lists = $('.list-items', $page);

  // Check to see if we have 2 lists - The Hangar, and the Inventory
  if ($lists.length == 1)
  {
    var $items = $('li', $lists[0]);
      
    $items.each(HangarXPLOR.ProcessItem);
      
    if ($items.length < 100)
    {
      HangarXPLOR.DrawUI();
    } else {
      HangarXPLOR.LoadPage(pageNo + 1);
    }
  } else {
    HangarXPLOR.DrawUI();
  }
}
