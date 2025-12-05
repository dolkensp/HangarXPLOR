
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR._buybackPageNo = 1;
HangarXPLOR._buybackPageCount = 20;
HangarXPLOR._buybackTotalRecords = 0;
HangarXPLOR._buybackSearchTerm = '';
HangarXPLOR._buybackPagerCallbacks = HangarXPLOR._buybackPagerCallbacks || [];

// Default RefreshBuybackPager - will be called by callbacks set up in DrawBuybackUI
HangarXPLOR.RefreshBuybackPager = HangarXPLOR.RefreshBuybackPager || function() {
  for (var i = 0, j = HangarXPLOR._buybackPagerCallbacks.length; i < j; i++) {
    HangarXPLOR._buybackPagerCallbacks[i]();
  }
};

/**
 * Renders buyback items that match the search, filter and sort criteria
 */
HangarXPLOR.RenderBuyback = function() {
  var filterBy = 'js-buyback-filter';
  var sortBy = 'js-buyback-sort';
  var searchBy = 'js-custom-search';  // Uses shared search class like hangar page

  HangarXPLOR.Log('Rendering buyback', filterBy, sortBy, searchBy, HangarXPLOR._buybackPageNo, HangarXPLOR._buybackPageCount);

  filterBy = '.' + filterBy;
  sortBy = '.' + sortBy;
  searchBy = '#buybackSearchInput';  // Use ID for buyback search to avoid conflict with hangar

  var buffer = HangarXPLOR._buybackInventory;

  // Apply filters
  $(filterBy).each(function() {
    buffer = HangarXPLOR.FilterBuyback(buffer, $(this).val());
  });

  // Apply search
  $(searchBy).each(function() {
    var searchTerm = $(this).val();
    if (searchTerm && searchTerm.trim().length > 0) {
      HangarXPLOR._buybackSearchTerm = searchTerm.toLowerCase();
      buffer = $.grep(buffer, function(item) {
        return item.buyback_name.toLowerCase().indexOf(HangarXPLOR._buybackSearchTerm) > -1 ||
               item.buyback_type.toLowerCase().indexOf(HangarXPLOR._buybackSearchTerm) > -1 ||
               item.contained.toLowerCase().indexOf(HangarXPLOR._buybackSearchTerm) > -1;
      });
    }
  });

  // Apply sort
  $(sortBy).each(function() {
    buffer = HangarXPLOR.SortBuyback(buffer, $(this).val());
  });

  HangarXPLOR._buybackFiltered = buffer;

  // User performed search & no results
  if (
    HangarXPLOR._buybackInventory.length > 0 &&
    buffer.length === 0 &&
    HangarXPLOR._buybackSearchTerm.length !== 0
  ) {
    var $noResults = $('<li>').append(
      $('<h4>', { class: 'empty-list', text: 'Your search returned no results.' })
    );
    buffer = [$noResults[0]];
  }
  // Empty Buffer
  else if (buffer.length == 0) {
    var $empty = $('<li>').append(
      $('<h4>', { class: 'empty-list', text: 'Your buyback queue is empty.' })
    );
    buffer = [$empty[0]];
  }

  HangarXPLOR._buybackTotalRecords = buffer.length;

  var maxPages = Math.ceil(HangarXPLOR._buybackTotalRecords / HangarXPLOR._buybackPageCount);
  if (HangarXPLOR._buybackPageNo > maxPages) HangarXPLOR._buybackPageNo = Math.max(1, maxPages);

  // Apply pagination
  if (HangarXPLOR._buybackPageCount < 1000) {
    buffer = buffer.slice(
      (HangarXPLOR._buybackPageNo - 1) * HangarXPLOR._buybackPageCount,
      HangarXPLOR._buybackPageNo * HangarXPLOR._buybackPageCount
    );
  }

  HangarXPLOR.$list.empty();
  HangarXPLOR.$list.append(buffer);

  // Update pager display (uses callback system defined in DrawBuybackUI.js)
  HangarXPLOR.RefreshBuybackPager();
};
