
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR._uiDrawn = HangarXPLOR._uiDrawn || false;

// Pre-process all the items in a document, then load the next page, or render the UI
HangarXPLOR.ProcessPage = function($page, pageNo)
{
  var isEmpty = $('.list-items > li > .empy-list', $page).length > 0;

  var $items = $('.list-items > li', $page);

  if (!isEmpty) $items.each(HangarXPLOR.ParsePledge);

  // Draw the UI shell on first page load so the user sees results immediately,
  // then just re-render on subsequent pages while the rest of the hangar loads.
  if (!HangarXPLOR._uiDrawn) {
    HangarXPLOR._uiDrawn = true;
    HangarXPLOR.DrawUI();
  } else {
    HangarXPLOR.Render();
    HangarXPLOR.RefreshBulkUI();
    HangarXPLOR.RefreshPager();
  }

  if (isEmpty || $items.length < 10)
  {
    HangarXPLOR.SaveCache();
    HangarXPLOR.MarkLoadingComplete();
  } else {
    HangarXPLOR.LoadPage(pageNo + 1);
  }
}
