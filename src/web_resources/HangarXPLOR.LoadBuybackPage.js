
var HangarXPLOR = HangarXPLOR || {};

/**
 * Loads a page of buyback pledges via AJAX
 * @param {number} pageNo - The page number to load (1-indexed)
 */
HangarXPLOR.LoadBuybackPage = function(pageNo) {
  pageNo = pageNo || 1;

  HangarXPLOR.Log('Loading buyback page', pageNo);
  HangarXPLOR.UpdateStatus(pageNo);

  $.ajax({
    url: '/account/buy-back-pledges?page=' + pageNo + '&pagesize=50',
    method: 'GET',
    dataType: 'html',
    success: function(response) {
      HangarXPLOR.ProcessBuybackPage($(response), pageNo);
    },
    error: function(xhr, status, error) {
      HangarXPLOR.Log('Error loading buyback page', pageNo, status, error);
      // Still try to render what we have
      HangarXPLOR.SaveBuybackCache();
      HangarXPLOR.DrawBuybackUI();
    }
  });
};
