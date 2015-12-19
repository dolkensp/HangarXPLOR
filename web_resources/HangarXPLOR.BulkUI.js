
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR.$bulkUI = null;

HangarXPLOR._callbacks = HangarXPLOR._callbacks || {};
HangarXPLOR._callbacks.Gift = HangarXPLOR._callbacks.Gift || function(e) { window.alert('Coming Soon') }
HangarXPLOR._callbacks.Melt = HangarXPLOR._callbacks.Melt || function(e) { window.alert('Coming Soon') }

// Render UI controls
HangarXPLOR.BulkUI = function()
{
  var bulkHeight = $('.js-bulk-ui').height();
  var maxOffset = document.body.scrollHeight - ($('#billing .inner-content').height() + $('#billing .inner-content').offset().top - 150);
  var minOffset = $('.billing-title-pager-wrapper').offset().top + 150;
  
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
  
  var positionUI = function() {
    if (document.body.scrollTop > document.body.scrollHeight - maxOffset - bulkHeight) HangarXPLOR.$bulkUI[0].style.top = (document.body.scrollHeight - maxOffset - bulkHeight - document.body.scrollTop + 150) + 'px';
    else if (document.body.scrollTop < minOffset) HangarXPLOR.$bulkUI[0].style.top = (minOffset - document.body.scrollTop + 150) + 'px';
    else HangarXPLOR.$bulkUI[0].style.top = '160px';
  };
  
  $(document).on('scroll', positionUI);
  
  var $billing = $('#billing');
  
  HangarXPLOR.$bulkUI = $('<div class="js-bulk-ui"></div>');
  HangarXPLOR.$bulkUI.$inner = $('<div class="inner content-block1"></div>');
  HangarXPLOR.$bulkUI.$value = $('<div class="value"></div>');
  HangarXPLOR.$bulkUI.$actions = $('<div class="actions"></div>');
  // HangarXPLOR.$bulkUI.hide();
  
  $billing.append(HangarXPLOR.$bulkUI);
  HangarXPLOR.$bulkUI.append(HangarXPLOR.$bulkUI.$inner);
  HangarXPLOR.$bulkUI.$inner.append(HangarXPLOR.$bulkUI.$value, HangarXPLOR.$bulkUI.$actions);
  HangarXPLOR.$bulkUI.$inner.append('<div class="top-line-thin"></div><div class="top-line"></div><div class="corner corner-top-right"></div><div class="corner corner-bottom-right"></div>');
  
  HangarXPLOR.RefreshBulkUI();
  bulkHeight = $('.js-bulk-ui').height();
  positionUI();
}

HangarXPLOR.RefreshBulkUI = function()
{
  var totalMelt = 0.00;
  var selectedMelt = 0.00;
  
  HangarXPLOR._meltable = [];
  HangarXPLOR._giftable = [];
  HangarXPLOR._selected = $.grep(HangarXPLOR._inventory, function(item) {
    totalMelt += item.meltValue;
    if (item.isSelected) {
      selectedMelt += item.meltValue;
      if (item.isMeltable) HangarXPLOR._meltable.push(item);
      if (item.isGiftable) HangarXPLOR._giftable.push(item);
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
  
  if (HangarXPLOR._selected.length > 0)
    HangarXPLOR.$bulkUI.$value.append('<span class="amount">$' + selectedMelt.toLocaleString('en-US', {minimumFractionDigits: 2}) + ' USD</span> <span class="label">Selected</span><br />');
  HangarXPLOR.$bulkUI.$value.append('<span class="amount">$' + totalMelt.toLocaleString('en-US', {minimumFractionDigits: 2}) + ' USD</span> <span class="label">Total Value</span>');
  
  HangarXPLOR.$bulkUI.$actions.empty();
  
  // if (HangarXPLOR._meltable.length > 0) HangarXPLOR.$bulkUI.$actions.append(HangarXPLOR.Button('Melt ' + HangarXPLOR._meltable.length + ' Items', 'reclaim rm js-bulk-reclaim', HangarXPLOR._callbacks.Melt));
  // if (HangarXPLOR._giftable.length > 0) HangarXPLOR.$bulkUI.$actions.append(HangarXPLOR.Button('Gift ' + HangarXPLOR._giftable.length + ' Items', 'gift js-bulk-gift', HangarXPLOR._callbacks.Gift));
}

HangarXPLOR.ResetBulkUI = function()
{
  for (var i = 0, j = HangarXPLOR._inventory.length; i < j; i++) HangarXPLOR._inventory.isSelected = false;
  
  $('.row', HangarXPLOR.$list).removeClass('js-selected');  
  
  HangarXPLOR.RefreshBulkUI();
}