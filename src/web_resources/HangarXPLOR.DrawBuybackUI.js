
var HangarXPLOR = HangarXPLOR || {};

// Buyback UI state
HangarXPLOR._buybackType = 'All';
HangarXPLOR._buybackSort = 'PledgeId';
HangarXPLOR._buybackFeature = HangarXPLOR._buybackFeature || {};
HangarXPLOR._buybackPagerCallbacks = [];

/**
 * Renders the buyback page UI controls
 * Styled to match the hangar page UI
 */
HangarXPLOR.DrawBuybackUI = function() {
  // Remove RSI's native pagination FIRST, before we create our own pager-wrapper
  // This prevents users from accidentally navigating away and losing our enhancements
  $('.pager-wrapper').remove();

  // Find the controls area - on buyback page it's the form.filters element
  var $controlsContainer = $('section.available-pledges form.filters');

  if ($controlsContainer.length === 0) {
    // Fallback - create a controls container before the pledges list
    $controlsContainer = $('<div>', { class: 'js-custom-controls' });
    $('section.available-pledges').prepend($controlsContainer);
  } else {
    $controlsContainer.addClass('js-custom-controls');
    $controlsContainer.removeClass('controls');
    $controlsContainer.empty();
  }

  var $controls1 = $('<div>', { class: 'controls clearfix mrn15' });

  $controlsContainer.append($controls1);

  // Row 1 (inside .filters): Type filter dropdown and Sort dropdown only
  $controls1.append(HangarXPLOR.Dropdown([
    { Value: 'All', Text: 'All Types', Class: 'first', Selected: HangarXPLOR._buybackType == 'All' },
    { Value: 'Ships', Text: 'Standalone Ships', Selected: HangarXPLOR._buybackType == 'Ships' },
    { Value: 'Packages', Text: 'Game Packages', Selected: HangarXPLOR._buybackType == 'Packages' },
    { Value: 'Upgrades', Text: 'Upgrades', Selected: HangarXPLOR._buybackType == 'Upgrades' },
    { Value: 'Paints', Text: 'Paints', Class: 'split', Selected: HangarXPLOR._buybackType == 'Paints' },
    { Value: 'AddOns', Text: 'Add-Ons', Selected: HangarXPLOR._buybackType == 'AddOns' },
    { Value: 'Components', Text: 'Components', Selected: HangarXPLOR._buybackType == 'Components' },
    { Value: 'Weapons', Text: 'Weapons', Selected: HangarXPLOR._buybackType == 'Weapons' },
    { Value: 'Decorations', Text: 'Hangar Decorations', Selected: HangarXPLOR._buybackType == 'Decorations' },
    { Value: 'Subscriber', Text: 'Subscriber Items', Class: 'split', Selected: HangarXPLOR._buybackType == 'Subscriber' },
    { Value: 'Other', Text: 'Other', Selected: HangarXPLOR._buybackType == 'Other' },
  ], '170px', 'js-buyback-filter', function(e, value) {
    HangarXPLOR._buybackType = value;
    HangarXPLOR.RenderBuyback();
    HangarXPLOR.RefreshBuybackPager();
  }));

  $controls1.append(HangarXPLOR.Dropdown([
    { Value: 'PledgeId', Text: 'Recent First', Selected: HangarXPLOR._buybackSort == 'PledgeId' },
    { Value: 'Name', Text: 'Name A-Z', Selected: HangarXPLOR._buybackSort == 'Name' },
    { Value: 'NameDesc', Text: 'Name Z-A', Selected: HangarXPLOR._buybackSort == 'NameDesc' },
    { Value: 'Type', Text: 'By Type', Selected: HangarXPLOR._buybackSort == 'Type' },
    { Value: 'Modified', Text: 'Last Modified', Selected: HangarXPLOR._buybackSort == 'Modified' },
  ], '137px', 'js-buyback-sort', function(e, value) {
    HangarXPLOR._buybackSort = value;
    HangarXPLOR.RenderBuyback();
    HangarXPLOR.RefreshBuybackPager();
  }));

  // Create a container for pager and search OUTSIDE the .filters form (below the blue line)
  var $extendedControls = $('<div>', { class: 'js-buyback-extended-controls' });
  $controlsContainer.after($extendedControls);

  // Pager row (below the blue line)
  $extendedControls.append(HangarXPLOR.BuybackPager([
    { Value: '9999', Text: 'Display All', Class: 'first', Selected: HangarXPLOR._buybackPageCount == 9999 },
    { Value: '10', Text: '10 per page', Selected: HangarXPLOR._buybackPageCount == 10 },
    { Value: '20', Text: '20 per page', Selected: HangarXPLOR._buybackPageCount == 20 },
    { Value: '50', Text: '50 per page', Selected: HangarXPLOR._buybackPageCount == 50 },
    { Value: '100', Text: '100 per page', Selected: HangarXPLOR._buybackPageCount == 100 },
  ], '130px', 'js-buyback-pager', function() {
    HangarXPLOR.RenderBuyback();
  }));

  // Search box
  var $searchWrapper = $('<div>', { class: 'js-buyback-search-wrapper' });
  $searchWrapper.append(HangarXPLOR.BuybackSearchBox());
  $extendedControls.append($searchWrapper);

  // Initial render
  HangarXPLOR.RenderBuyback();
  HangarXPLOR.RefreshBuybackBulkUI();
  HangarXPLOR.RefreshBuybackPager();
};

/**
 * Refresh all buyback pager callbacks
 */
HangarXPLOR.RefreshBuybackPager = function() {
  for (var i = 0, j = HangarXPLOR._buybackPagerCallbacks.length; i < j; i++) {
    HangarXPLOR._buybackPagerCallbacks[i]();
  }
};

/**
 * Creates a pager component for buyback pagination
 * Styled to match the hangar page pager
 */
HangarXPLOR.BuybackPager = function(options, width, className, callback) {
  width = width || '140px';
  className = className || 'js-buyback-pager';
  var maxButtons = 5;

  var $control = $('<div>', { class: 'options-selector pager-wrapper ' + className });
  var $pager = $('<div>', { class: 'pager clearfix js-pager' });
  var $left = $('<div>', { class: 'left' });
  var $right = $('<div>', { class: 'right' });

  $control.append($pager);
  $pager.append($left, $right);

  HangarXPLOR._buybackPagerCallbacks.push(function() {
    // Update selected state for dropdown options
    for (var i = 0, j = options.length; i < j; i++) {
      options[i].Selected = HangarXPLOR._buybackPageCount == options[i].Value;
      if (i > 0) options[i].Class = '';
    }

    var maxPages = Math.ceil(HangarXPLOR._buybackTotalRecords / HangarXPLOR._buybackPageCount);
    if (HangarXPLOR._buybackPageNo > maxPages) HangarXPLOR._buybackPageNo = Math.max(1, maxPages);

    var firstPage = Math.max(1, HangarXPLOR._buybackPageNo - Math.floor(maxButtons / 2));
    if (firstPage > maxPages - maxButtons) firstPage = Math.max(1, maxPages - maxButtons + 1);

    $left.empty();
    $right.empty();

    $left.append(HangarXPLOR.Dropdown(options, width, className, function(e, pageCount) {
      HangarXPLOR._buybackPageNo = 1;
      HangarXPLOR._buybackPageCount = parseInt(pageCount) || 20;

      if (typeof callback === 'function') callback.call(this, e, HangarXPLOR._buybackPageNo);

      HangarXPLOR.RefreshBuybackPager();
    }));

    if (maxPages <= 1) {
      $left.addClass('mr5');
      return;
    } else {
      $left.removeClass('mr5');
    }

    // Render page number buttons
    for (var p = firstPage, pMax = Math.min(firstPage + maxButtons - 1, maxPages); p <= pMax; p++) {
      $right.append($('<a>', {
        class: 'trans-02s trans-color' + ((p == HangarXPLOR._buybackPageNo) ? ' active' : ''),
        rel: p,
        text: p,
        href: '#'
      }));
    }

    var $buttons = $('a', $right);
    $buttons.bind('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

      var $this = $(this);
      var newPage = parseInt($this.attr('rel'));

      if (newPage != HangarXPLOR._buybackPageNo) {
        HangarXPLOR._buybackPageNo = newPage;

        if (typeof callback === 'function') callback.call(this, e, HangarXPLOR._buybackPageNo);

        HangarXPLOR.RefreshBuybackPager();
      }
    });
  });

  return $control;
};

/**
 * Creates a search box for buyback page
 * Styled to match the hangar page search box
 */
HangarXPLOR.BuybackSearchBox = function() {
  var $searchBox = $('<input>', {
    id: 'buybackSearchInput',
    class: 'js-custom-search',
    placeholder: 'Search'
  });

  $searchBox.on('keyup', function() {
    HangarXPLOR._buybackSearchTerm = $(this).val();
    HangarXPLOR.RenderBuyback();
    HangarXPLOR.RefreshBuybackPager();
  });

  return $searchBox;
};
