
var HangarXPLOR = HangarXPLOR || {};

// Render UI controls
HangarXPLOR.DrawUI = function()
{
  var $controls = $('.controls');
  $controls.addClass('js-custom-controls');
  $controls.empty();
  
  $('.js-pager').remove();
  
  var $filters = [];
  
  $filters.push(HangarXPLOR.Dropdown([
    { Value: 'All', Text: 'All Types', Class: 'first', Selected: true },
    { Value: 'HasShip', Text: 'Ships + Packages' },
    { Value: 'IsShip', Text: 'Ships' },
    { Value: 'IsPackage', Text: 'Packages' },
    { Value: 'IsExtra', Text: 'All Extras', Class: 'split' },
    { Value: 'IsUpgrade', Text: 'Upgrades' },
    { Value: 'IsAddOn', Text: 'Add Ons' },
    { Value: 'IsComponent', Text: 'Components' },
    { Value: 'IsFlair', Text: 'All Flair', Class: 'split' },
    { Value: 'IsDecoration', Text: 'Decorations' },
    { Value: 'IsPoster', Text: 'Posters' },
    { Value: 'IsModel', Text: 'Models' },
    { Value: 'IsReward', Text: 'Rewards' },
  ], '158px', 'js-custom-filter', function() { HangarXPLOR.Render(); HangarXPLOR.RefreshPager() }));
  
  $filters.push(HangarXPLOR.Dropdown([
    { Value: 'All', Text: 'All Features', Class: 'first', Selected: true },
    { Value: 'HasLTI', Text: 'LTI', Class: 'split' },
    { Value: '!HasLTI', Text: 'STI' },
    { Value: 'IsGiftable', Text: 'Giftable', Class: 'split' },
    { Value: '!IsGiftable', Text: 'Account Bound' },
    { Value: 'HasValue', Text: 'Valuable', Class: 'split' },
    { Value: '!HasValue', Text: 'Worthless' },
    { Value: 'IsUpgraded', Text: 'Upgraded', Class: 'split' },
    { Value: '!IsUpgraded', Text: 'Original' },
  ], '137px', 'js-custom-filter', function() { HangarXPLOR.Render(); HangarXPLOR.RefreshPager() }));
  
  $controls.append($filters);
  $controls.append(HangarXPLOR.Pager([
    { Value: '9999', Text: 'Display All', Class: 'first' },
    { Value: '10', Text: '10 per page', Selected: true },
    { Value: '20', Text: '20 per page' },
    { Value: '50', Text: '50 per page' },
    { Value: '100', Text: '100 per page' },
  ], '140px', 'js-custom-pager', HangarXPLOR.Render));
  
  HangarXPLOR.Render();
  HangarXPLOR.RefreshPager();
}
