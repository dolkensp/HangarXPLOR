
var HangarXPLOR = HangarXPLOR || {};

// Pre-process all the items in a document, then load the next page, or render the UI
HangarXPLOR.ProcessPage = function($page, pageNo)
{
  var $lists = $('.list-items', $page);
  
  var $items = $('.list-items > li', $page);
      
  $items.each(HangarXPLOR.ProcessItem);
      
  if ($items.length < 100)
  {
    HangarXPLOR.DrawUI();
  } else {
    HangarXPLOR.LoadPage(pageNo + 1);
  }
}
