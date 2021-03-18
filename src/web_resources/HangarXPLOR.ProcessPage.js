
var HangarXPLOR = HangarXPLOR || {};

// Pre-process all the items in a document, then load the next page, or render the UI
HangarXPLOR.ProcessPage = function($page, pageNo)
{
  var isEmpty = $('.list-items > li > .empy-list', $page).length > 0;
  
  var $items = $('.list-items > li', $page);
      
  if (!isEmpty) $items.each(HangarXPLOR.ParsePledge);
      
  if (isEmpty || $items.length < 10)
  {
    HangarXPLOR.SaveCache();
    HangarXPLOR.DrawUI();
  } else {
    HangarXPLOR.LoadPage(pageNo + 1);
  }
}
