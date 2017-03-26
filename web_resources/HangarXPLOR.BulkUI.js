
var HangarXPLOR = HangarXPLOR || {};
HangarXPLOR.Loading = HangarXPLOR.Loading || false;
HangarXPLOR.BulkEnabled = HangarXPLOR.BulkEnabled || false;

HangarXPLOR.$bulkUI = null;

HangarXPLOR._callbacks = HangarXPLOR._callbacks || {};
HangarXPLOR._callbacks.Gift = HangarXPLOR._callbacks.Gift || function(e) { window.alert('Coming Soon') }
HangarXPLOR._callbacks.GiftConfirm = HangarXPLOR._callbacks.GiftConfirm || function(e) { window.alert('Coming Soon') }

HangarXPLOR._callbacks.Melt = HangarXPLOR._callbacks.Melt || function(e) { window.alert('Coming Soon') }
HangarXPLOR._callbacks.MeltConfirm = HangarXPLOR._callbacks.MeltConfirm || function(e) { window.alert('Coming Soon') }

// Render UI controls
HangarXPLOR.BulkUI = function()
{
  var bulkHeight = $('.js-bulk-ui').height();
  var maxOffset = document.body.scrollHeight - ($('#billing .inner-content').height() + $('#billing .inner-content').offset().top - 150);
  var minOffset = $('.billing-title-pager-wrapper').offset().top;
  
  var positionUI = function() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (scrollTop > document.body.scrollHeight - maxOffset - bulkHeight) HangarXPLOR.$bulkUI[0].style.top = (document.body.scrollHeight - maxOffset - bulkHeight - scrollTop + 150) + 'px';
    else if (scrollTop < minOffset) HangarXPLOR.$bulkUI[0].style.top = (minOffset - scrollTop + 150) + 'px';
    else HangarXPLOR.$bulkUI[0].style.top = '160px';
  };
  
  $(document).on('scroll', positionUI);
  
  var $billing = $('#billing');
  
  HangarXPLOR.$bulkUI = $('<div>', { class: 'js-bulk-ui' });
  HangarXPLOR.$bulkUI.summaryType = $.cookie('HangarXPLOR.$bulkUI.summaryType') || 'cash';
  
  HangarXPLOR.$bulkUI.$inner = $('<div>', { class: 'inner content-block1 loading' });
  HangarXPLOR.$bulkUI.$value = $('<div>', { class: 'value' });
  HangarXPLOR.$bulkUI.$actions = $('<div>', { class: 'actions' });
  HangarXPLOR.$bulkUI.$loading = $('<div>', { class: 'status value' });
  
  HangarXPLOR.$bulkUI.addClass(HangarXPLOR.$bulkUI.summaryType);
  
  $billing.append(HangarXPLOR.$bulkUI);
  HangarXPLOR.$bulkUI.append(HangarXPLOR.$bulkUI.$inner);
  HangarXPLOR.$bulkUI.$inner.append(
    HangarXPLOR.$bulkUI.$loading,
    HangarXPLOR.$bulkUI.$value,
    HangarXPLOR.$bulkUI.$actions,
    $('<div>', { class: 'top-line-thin' }),
    $('<div>', { class: 'top-line' }),
    $('<div>', { class: 'corner corner-top-right' }),
    $('<div>', { class: 'corner corner-bottom-right' }));
  
  bulkHeight = $('.js-bulk-ui').height();
  positionUI();
}

HangarXPLOR.BindBulkUI = function()
{

  HangarXPLOR.$bulkUI.$inner.removeClass('loading');
  HangarXPLOR.$list.addClass(HangarXPLOR.$bulkUI.summaryType);
  HangarXPLOR.$list.on('click.HangarXPLOR', 'a', function(e) { e.originalEvent.isButton = true; });
  HangarXPLOR.$list.on('click.HangarXPLOR', 'li', function(e) {
    if (!e.originalEvent.isButton)
    {
      $('.row', this).removeClass('js-selected');
      this.isSelected = !this.isSelected;
      if (this.isSelected) $('.row', this).addClass('js-selected');
      
      HangarXPLOR.RefreshBulkUI();
      
      bulkHeight = $('.js-bulk-ui').height();
    }
  });
  
  HangarXPLOR.$bulkUI.$value.bind('click', function() {
    
    HangarXPLOR.$bulkUI.removeClass(HangarXPLOR.$bulkUI.summaryType);
    HangarXPLOR.$list.removeClass(HangarXPLOR.$bulkUI.summaryType);
    
    switch (HangarXPLOR.$bulkUI.summaryType)
    {
      case "cash": HangarXPLOR.$bulkUI.summaryType = "count"; break;
      case "count": HangarXPLOR.$bulkUI.summaryType = "cash"; break;
    }
    $.cookie('HangarXPLOR.$bulkUI.summaryType', HangarXPLOR.$bulkUI.summaryType);
    
    HangarXPLOR.$bulkUI.addClass(HangarXPLOR.$bulkUI.summaryType);
    HangarXPLOR.$list.addClass(HangarXPLOR.$bulkUI.summaryType);
    
    HangarXPLOR.RefreshBulkUI();
  });
  
}

HangarXPLOR.UpdateStatus = function(pageNo)
{
  HangarXPLOR.$bulkUI.$loading.empty();
  
  HangarXPLOR.$bulkUI.$loading.append(
    $('<span>', { class: 'amount', text: 'Loading' }),
    $('<span>', { class: 'label', text: 'Please Wait' }),
    $('<br>')
  );
}

HangarXPLOR.RefreshBulkUI = function()
{
  HangarXPLOR._meltable = [];
  HangarXPLOR._giftable = [];
  HangarXPLOR._selectedUpgrades = 0;
  HangarXPLOR._selectedShips = 0;
  HangarXPLOR._selectedPackages = 0;
  HangarXPLOR._selectedMelt = 0.00;
  HangarXPLOR._totalMelt = 0.00;
  HangarXPLOR._selected = $.grep(HangarXPLOR._inventory, function(item) {
    HangarXPLOR._totalMelt += item.meltValue;
    if (item.isSelected) {
      HangarXPLOR._selectedMelt += item.meltValue;
      if (item.isMeltable) HangarXPLOR._meltable.push(item);
      if (item.isGiftable) HangarXPLOR._giftable.push(item);
      if (item.isUpgrade) HangarXPLOR._selectedUpgrades += 1;
      if (item.isPackage) HangarXPLOR._selectedPackages += 1;
      if (item.hasShip) HangarXPLOR._selectedShips += $('.kind:contains(Ship)', item).length;
      return true;
    }
    return false
  });
  
  /*
  if (HangarXPLOR._selected.length > 0)
  {
    HangarXPLOR.$bulkUI.show();
  } else {
    HangarXPLOR.$bulkUI.hide();
  }
  */
  
  HangarXPLOR.$bulkUI.$value.empty();

  if (HangarXPLOR._selected.length > 0) {
    HangarXPLOR.$bulkUI.$value.append(
      $('<span>', { class: 'count' }).append(
        $('<span>', { class: 'amount', text: HangarXPLOR._selectedUpgrades }),
        $('<span>', { class: 'label-short', text: 'CCUs' }),
        $('<span>', { class: 'amount', text: HangarXPLOR._selectedShips }),
        $('<span>', { class: 'label-short', text: 'Ships' }),
        $('<span>', { class: 'amount', text: HangarXPLOR._selectedPackages }),
        $('<span>', { class: 'label', text: 'Packages' })
      ),
      $('<span>', { class: 'cash' }).append(
        $('<span>', { class: 'amount', text: HangarXPLOR._selectedMelt.toLocaleString('en-US', {minimumFractionDigits: 2}) + ' USD' }),
        $('<span>', { class: 'label', text: 'Selected' })
      ),
      $('<br>')
    );
  }
  
  HangarXPLOR.$bulkUI.$value.append(
    $('<span>', { class: 'count' }).append(
      $('<span>', { class: 'amount', text: HangarXPLOR._upgradeCount }),
      $('<span>', { class: 'label-short', text: 'CCUs' }),
      $('<span>', { class: 'amount', text: HangarXPLOR._shipCount }),
      $('<span>', { class: 'label-short', text: 'Ships' }),
      $('<span>', { class: 'amount', text: HangarXPLOR._packageCount }),
      $('<span>', { class: 'label', text: 'Packages' })
    ),
    $('<span>', { class: 'cash' }).append(
      $('<span>', { class: 'amount', text: HangarXPLOR._totalMelt.toLocaleString('en-US', {minimumFractionDigits: 2}) + ' USD' }),
      $('<span>', { class: 'label', text: 'Total Spend' })
    ),
    $('<br>')
  );

  HangarXPLOR.$bulkUI.$actions.empty();
  
  if (HangarXPLOR.BulkEnabled && HangarXPLOR._meltable.length > 0) HangarXPLOR.$bulkUI.$actions.append(HangarXPLOR.Button('Melt ' + HangarXPLOR._meltable.length + ' Items', 'reclaim rm js-bulk-reclaim', HangarXPLOR._callbacks.Melt));
  if (HangarXPLOR.BulkEnabled && HangarXPLOR._giftable.length > 0) HangarXPLOR.$bulkUI.$actions.append(HangarXPLOR.Button('Gift ' + HangarXPLOR._giftable.length + ' Items', 'gift js-bulk-gift', HangarXPLOR._callbacks.Gift));
}

HangarXPLOR.ResetBulkUI = function()
{
  for (var i = 0, j = HangarXPLOR._inventory.length; i < j; i++) HangarXPLOR._inventory.isSelected = false;
  
  $('.row', HangarXPLOR.$list).removeClass('js-selected');  
  
  HangarXPLOR.RefreshBulkUI();
}