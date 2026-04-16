
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR._uiDrawn = HangarXPLOR._uiDrawn || false;

// Pre-process all the items in a document, then load the next page, or render the UI
HangarXPLOR.ProcessPage = function($page, pageNo)
{
  var isEmpty = $('.list-items > li > .empty-list', $page).length > 0;

  var $items = $('.list-items > li', $page);

  // Detect duplicate pages: RSI returns the last page's results for any
  // page number beyond the actual last page instead of an empty list.
  var isDuplicate = false;
  if (!isEmpty && $items.length > 0) {
    var firstId = $('.js-pledge-id', $items.first()).val();
    if (firstId && firstId === HangarXPLOR._lastFirstPledgeId) {
      isDuplicate = true;
    }
    HangarXPLOR._lastFirstPledgeId = firstId;
  }

  if (!isEmpty && !isDuplicate) $items.each(HangarXPLOR.ParsePledge);

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

  if (isEmpty || isDuplicate || $items.length < 10)
  {
    HangarXPLOR.SaveCache();
    HangarXPLOR.MarkLoadingComplete();
  } else {
    HangarXPLOR.LoadPage(pageNo + 1);
  }
}
