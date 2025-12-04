
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR.$buybackBulkUI = null;

/**
 * Creates the buyback summary panel UI
 * Shows counts by type and availability status
 */
HangarXPLOR.BuybackBulkUI = function() {
  var $billing = $('#billing');

  if ($billing.length === 0) {
    // Fallback to body if #billing doesn't exist
    $billing = $('body');
  }

  HangarXPLOR.$buybackBulkUI = $('<div>', { class: 'js-bulk-ui js-buyback-bulk-ui' });

  HangarXPLOR.$buybackBulkUI.$inner = $('<div>', { class: 'inner content-block1 loading' });
  HangarXPLOR.$buybackBulkUI.$value = $('<div>', { class: 'value' });
  HangarXPLOR.$buybackBulkUI.$downloads = $('<div>', { class: 'actions' });
  HangarXPLOR.$buybackBulkUI.$loading = $('<div>', { class: 'status value' });

  $billing.append(HangarXPLOR.$buybackBulkUI);
  HangarXPLOR.$buybackBulkUI.append(HangarXPLOR.$buybackBulkUI.$inner);
  HangarXPLOR.$buybackBulkUI.$inner.append(
    HangarXPLOR.$buybackBulkUI.$loading,
    HangarXPLOR.$buybackBulkUI.$value,
    HangarXPLOR.$buybackBulkUI.$downloads,
    $('<div>', { class: 'top-line-thin' }),
    $('<div>', { class: 'top-line' }),
    $('<div>', { class: 'corner corner-top-right' }),
    $('<div>', { class: 'corner corner-bottom-right' })
  );

  // Add download buttons
  HangarXPLOR.$buybackBulkUI.$downloads.append(
    HangarXPLOR.Button('Download CSV', 'download js-download-buyback-csv', HangarXPLOR._callbacks.DownloadBuybackCSV)
  );
  HangarXPLOR.$buybackBulkUI.$downloads.append(
    HangarXPLOR.Button('Download JSON', 'download js-download-buyback-json', HangarXPLOR._callbacks.DownloadBuybackJSON)
  );

  // Position the UI
  var positionUI = function() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    var minOffset = 150;

    if (scrollTop < minOffset) {
      HangarXPLOR.$buybackBulkUI[0].style.top = (minOffset - scrollTop + 150) + 'px';
    } else {
      HangarXPLOR.$buybackBulkUI[0].style.top = '160px';
    }
  };

  $(document).on('scroll', positionUI);
  positionUI();
};

/**
 * Refreshes the buyback summary panel with current counts
 */
HangarXPLOR.RefreshBuybackBulkUI = function() {
  if (!HangarXPLOR.$buybackBulkUI) return;

  HangarXPLOR.$buybackBulkUI.$inner.removeClass('loading');
  HangarXPLOR.$buybackBulkUI.$value.empty();

  var counts = HangarXPLOR._buybackCounts;

  // Total count
  HangarXPLOR.$buybackBulkUI.$value.append(
    $('<div>', { class: 'buyback-summary-row' }).append(
      $('<span>', { class: 'amount', text: counts.total }),
      $('<span>', { class: 'label', text: 'Total Buyback Items' })
    )
  );

  // Type breakdown - vertical list
  var $typeBreakdown = $('<div>', { class: 'buyback-type-breakdown' });

  // Define all types to display
  var types = [
    { count: counts.ships, label: 'Ships' },
    { count: counts.packages, label: 'Packages' },
    { count: counts.upgrades, label: 'Upgrades' },
    { count: counts.paints, label: 'Paints' },
    { count: counts.addons, label: 'Add-Ons' },
    { count: counts.components, label: 'Components' },
    { count: counts.weapons, label: 'Weapons' },
    { count: counts.decorations, label: 'Decorations' },
    { count: counts.subscriber, label: 'Subscriber' },
    { count: counts.other, label: 'Other' }
  ];

  // Only show types with count > 0
  types.forEach(function(type) {
    if (type.count > 0) {
      $typeBreakdown.append(
        $('<div>', { class: 'buyback-count-row' }).append(
          $('<span>', { class: 'count-num', text: type.count }),
          $('<span>', { class: 'count-label', text: type.label })
        )
      );
    }
  });

  HangarXPLOR.$buybackBulkUI.$value.append($typeBreakdown);
};
