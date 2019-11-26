
var HangarXPLOR = HangarXPLOR || {};

// Pre-process all the items in a document, then load the next page, or render the UI
HangarXPLOR.ProcessPage = function($page, pageNo)
{
  var isEmpty = $('.list-items > li > .empy-list', $page).length > 0;
  
  var $items = $('.list-items > li', $page);
      
  $items.each(HangarXPLOR.ProcessItem);
      
  if (isEmpty || $items.length < 10)
  {
    HangarXPLOR.DrawUI();
  } else {
    HangarXPLOR.LoadPage(pageNo + 1);
  }
}
