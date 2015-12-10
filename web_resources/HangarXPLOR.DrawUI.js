
var HangarXPLOR = HangarXPLOR || {};

// Render UI controls
HangarXPLOR.DrawUI = function()
{
  var $controls = $('.controls');
  $controls.empty();
  
  $('.js-pager').remove();
  
  var $filters = [];
  
  $filters.push(HangarXPLOR.Dropdown([
    { Value: 'All', Text: 'All Types', Class: 'selected first' },
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
  ], '160px', 'js-custom-filter', function() { HangarXPLOR.Render(); HangarXPLOR.RefreshPager() }));
  
  $filters.push(HangarXPLOR.Dropdown([
    { Value: 'All', Text: 'All Features', Class: 'selected first' },
    { Value: 'HasLTI', Text: 'LTI' },
    { Value: '!HasLTI', Text: 'Standard Insurance' },
    { Value: 'IsGiftable', Text: 'Giftable', Class: 'split' },
    { Value: '!IsGiftable', Text: 'Account Bound' },
    { Value: 'HasValue', Text: 'Valuable', Class: 'split' },
    { Value: '!HasValue', Text: 'Worthless' },
    { Value: 'IsUpgraded', Text: 'Upgraded', Class: 'split' },
    { Value: '!IsUpgraded', Text: 'Original' },
  ], '140px', 'js-custom-filter', function() { HangarXPLOR.Render(); HangarXPLOR.RefreshPager() }));
  
  $controls.append($filters);
  $controls.append(HangarXPLOR.Pager('js-custom-pager', HangarXPLOR.Render));
  
  $(document.body).append('<style>.js-inventory h3 { margin-top: -5px !important } .first { border-bottom: 3px double #162a3f } .split { border-top: 1px solid #162a3f; }</style>');
  
  HangarXPLOR.Render();
  HangarXPLOR.RefreshPager();
}
