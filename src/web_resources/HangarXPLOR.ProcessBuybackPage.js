
var HangarXPLOR = HangarXPLOR || {};

/**
 * Processes a loaded buyback page, parsing each pledge and handling pagination
 * @param {jQuery} $page - jQuery object containing the loaded page HTML
 * @param {number} pageNo - The current page number
 */
HangarXPLOR.ProcessBuybackPage = function($page, pageNo) {
  // Find pledges list - selector: section.available-pledges ul.pledges > li
  var $items = $('section.available-pledges ul.pledges > li', $page);

  HangarXPLOR.Log('Processing buyback page', pageNo, 'with', $items.length, 'items');

  // Check for empty page
  if ($items.length === 0) {
    HangarXPLOR.Log('No items found on buyback page', pageNo, '- finished loading');
    HangarXPLOR.SaveBuybackCache();
    HangarXPLOR.DrawBuybackUI();
    return;
  }

  // Parse each item
  $items.each(function() {
    HangarXPLOR.ParseBuybackPledge.apply(this);
  });

  // Continue loading if we got a full page (50 items)
  // This indicates there may be more pages
  if ($items.length >= 50) {
    HangarXPLOR.LoadBuybackPage(pageNo + 1);
  } else {
    HangarXPLOR.Log('Buyback loading complete. Total items:', HangarXPLOR._buybackInventory.length);
    HangarXPLOR.SaveBuybackCache();
    HangarXPLOR.DrawBuybackUI();
  }
};
