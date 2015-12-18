
var HangarXPLOR = HangarXPLOR || {};

// Render UI controls
HangarXPLOR.DrawUI = function()
{
  var $controls = $($('.controls')[0]);
  $controls.addClass('js-custom-controls');
  $controls.removeClass('controls');
  $controls.empty();
  
  var $controls1 = $('<div class="controls clearfix" />');
  var $controls2 = $('<div class="controls clearfix" />');
  
  $controls.append($controls1, $controls2);
  
  $('.js-pager').remove();
  
  var $filters = [];
  
  var filter1 = $.cookie('HangarXPLOR.Type') || 'All';
  
  $filters.push(HangarXPLOR.Dropdown([
    { Value: 'All', Text: 'All Types', Class: 'first', Selected: filter1 == 'All' },
    { Value: 'HasShip', Text: 'Ships + Packages', Selected: filter1 == 'HasShip' },
    { Value: 'IsShip', Text: 'Ships', Selected: filter1 == 'IsShip' },
    { Value: 'IsPackage', Text: 'Packages', Selected: filter1 == 'IsPackage' },
    { Value: 'IsExtra', Text: 'All Extras', Class: 'split', Selected: filter1 == 'IsExtra' },
    { Value: 'IsUpgrade', Text: 'Upgrades', Selected: filter1 == 'IsUpgrade' },
    { Value: 'IsAddOn', Text: 'Add Ons', Selected: filter1 == 'IsAddOn' },
    { Value: 'IsComponent', Text: 'Components', Selected: filter1 == 'IsComponent' },
    { Value: 'IsFlair', Text: 'All Flair', Class: 'split', Selected: filter1 == 'IsFlair' },
    { Value: 'IsDecoration', Text: 'Decorations', Selected: filter1 == 'IsDecoration' },
    { Value: 'IsPoster', Text: 'Posters', Selected: filter1 == 'IsPoster' },
    { Value: 'IsModel', Text: 'Models', Selected: filter1 == 'IsModel' },
    { Value: 'IsReward', Text: 'Rewards', Selected: filter1 == 'IsReward' },
  ], '158px', 'js-custom-filter', function(e, value) { $.cookie('HangarXPLOR.Type', value); HangarXPLOR.Render(); HangarXPLOR.RefreshPager(); HangarXPLOR.ResetBulkUI(); }));
  
  var filter2 = $.cookie('HangarXPLOR.Feature') || 'All';
  
  $filters.push(HangarXPLOR.Dropdown([
    { Value: 'All', Text: 'All Features', Class: 'first', Selected: filter2 == 'All' },
    { Value: 'HasLTI', Text: 'LTI', Class: 'split', Selected: filter2 == 'HasLTI' },
    { Value: '!HasLTI', Text: 'SHI', Selected: filter2 == '!HasLTI' },
    { Value: 'IsGiftable', Text: 'Giftable', Class: 'split', Selected: filter2 == 'IsGiftable' },
    { Value: '!IsGiftable', Text: 'Account Bound', Selected: filter2 == '!IsGiftable' },
    { Value: 'HasValue', Text: 'Valuable', Class: 'split', Selected: filter2 == 'HasValue' },
    { Value: '!HasValue', Text: 'Worthless', Selected: filter2 == '!HasValue' },
    { Value: 'IsUpgraded', Text: 'Upgraded', Class: 'split', Selected: filter2 == 'IsUpgraded' },
    { Value: '!IsUpgraded', Text: 'Original', Selected: filter2 == '!IsUpgraded' },
    { Value: 'IsMeltable', Text: 'Meltable', Class: 'split', Selected: filter2 == 'IsMeltable' },
    { Value: '!IsMeltable', Text: 'Unmeltable', Selected: filter2 == '!IsMeltable' },
  ], '137px', 'js-custom-filter', function(e, value) { $.cookie('HangarXPLOR.Feature', value); HangarXPLOR.Render(); HangarXPLOR.RefreshPager(); HangarXPLOR.ResetBulkUI(); }));
  
  $controls1.append($filters);
  
  $controls1.append(HangarXPLOR.Pager([
    { Value: '9999', Text: 'Display All', Class: 'first', Selected: HangarXPLOR._pageCount == 9999 },
    { Value: '10', Text: '10 per page', Selected: HangarXPLOR._pageCount == 10 },
    { Value: '20', Text: '20 per page', Selected: HangarXPLOR._pageCount == 20 },
    { Value: '50', Text: '50 per page', Selected: HangarXPLOR._pageCount == 50 },
    { Value: '100', Text: '100 per page', Selected: HangarXPLOR._pageCount == 100 },
  ], '140px', 'js-custom-pager', HangarXPLOR.Render ));
  var sort1 = $.cookie('HangarXPLOR.Sort') || 'Purchased';
  
  $controls2.append(HangarXPLOR.Dropdown([
    { Value: 'Purchased', Text: 'Purchase Date', Selected: sort1 == 'Purchased' },
    { Value: 'Name', Text: 'Pledge Name', Selected: sort1 == 'Name' },
    { Value: 'Value', Text: 'Pledge Value', Selected: sort1 == 'Value' },
  ], '137px', 'js-custom-sort', function(e, value) { $.cookie('HangarXPLOR.Sort', value); HangarXPLOR.Render(); HangarXPLOR.RefreshPager(); }));
  
  HangarXPLOR.BulkUI();
  HangarXPLOR.Render();
  HangarXPLOR.RefreshPager();
}
