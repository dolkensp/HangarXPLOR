
var HangarXPLOR = HangarXPLOR || {};

// Render UI controls
HangarXPLOR.DrawUI = function()
{
  var $controls = $($('.controls')[0]);
  $controls.addClass('js-custom-controls');
  $controls.removeClass('controls');
  $controls.empty();

  var $controls1 = $('<div>', { class: 'controls clearfix' });
  var $controls2 = $('<div>', { class: 'controls clearfix' });
  var $controls3 = $('<div>', { class: 'controls clearfix' });

  $controls.append($controls1, $controls2, $controls3);

  $('.js-pager').remove();

  var filter1 = $.cookie('HangarXPLOR.Type') || 'All';

  $controls1.append(HangarXPLOR.Dropdown([
    { Value: 'All', Text: 'All Types', Class: 'first', Selected: filter1 == 'All' },
    { Value: 'HasShip', Text: 'All Ships', Selected: filter1 == 'HasShip' },
    { Value: 'IsShip', Text: 'Standalone Ships', Selected: filter1 == 'IsShip' },
    { Value: 'IsPackage', Text: 'Game Packages', Selected: filter1 == 'IsPackage' },
    { Value: 'IsCombo', Text: 'Combo Packs', Selected: filter1 == 'IsCombo' },
    { Value: 'IsExtra', Text: 'All Extras', Class: 'split', Selected: filter1 == 'IsExtra' },
    { Value: 'IsAddOn', Text: 'Add Ons', Selected: filter1 == 'IsAddOn' },
    { Value: 'IsComponent', Text: 'Components', Selected: filter1 == 'IsComponent' },
    { Value: 'IsUpgrade', Text: 'Upgrades', Selected: filter1 == 'IsUpgrade' },
    { Value: 'IsFlair', Text: 'All Flair', Class: 'split', Selected: filter1 == 'IsFlair' },
    { Value: 'IsDecoration', Text: 'Decorations', Selected: filter1 == 'IsDecoration' },
    { Value: 'IsModel', Text: 'Models', Selected: filter1 == 'IsModel' },
    { Value: 'IsPlant', Text: 'Plants', Selected: filter1 == 'IsPlant' },
    { Value: 'IsPoster', Text: 'Posters', Selected: filter1 == 'IsPoster' },
  ], '158px', 'js-custom-filter', function(e, value) { $.cookie('HangarXPLOR.Type', value); HangarXPLOR.Render(); HangarXPLOR.RefreshPager(); /* HangarXPLOR.ResetBulkUI(); */ }));

  var sort1 = $.cookie('HangarXPLOR.Sort') || 'Purchased';
  $controls1.append(HangarXPLOR.Dropdown([
    { Value: 'Purchased', Text: 'Pledge Date', Selected: sort1 == 'Purchased' },
    { Value: 'Name', Text: 'Pledge Name', Selected: sort1 == 'Name' },
    { Value: 'Value', Text: 'Pledge Value', Selected: sort1 == 'Value' },
  ], '137px', 'js-custom-sort', function(e, value) { $.cookie('HangarXPLOR.Sort', value); HangarXPLOR.Render(); HangarXPLOR.RefreshPager(); }));

  $controls1.append(HangarXPLOR.Pager([
    { Value: '9999', Text: 'Display All', Class: 'first', Selected: HangarXPLOR._pageCount == 9999 },
    { Value: '10', Text: '10 per page', Selected: HangarXPLOR._pageCount == 10 },
    { Value: '20', Text: '20 per page', Selected: HangarXPLOR._pageCount == 20 },
    { Value: '50', Text: '50 per page', Selected: HangarXPLOR._pageCount == 50 },
    { Value: '100', Text: '100 per page', Selected: HangarXPLOR._pageCount == 100 },
  ], '140px', 'js-custom-pager', HangarXPLOR.Render ));

  var toggleHandler = function(e, label, value)
  {
    $.cookie('HangarXPLOR.Feature.' + label, value);

    if (HangarXPLOR.logsEnabled) console.log('HangarXPLOR.Feature.' + label, value);

    HangarXPLOR.Render();
    HangarXPLOR.RefreshPager();
    // HangarXPLOR.ResetBulkUI();
  };

  $controls2.append(HangarXPLOR.Toggle('LTI',      'HasLTI',     '!HasLTI',     'js-custom-filter', toggleHandler, $.cookie('HangarXPLOR.Feature.LTI')));
  $controls2.append(HangarXPLOR.Toggle('Giftable', 'IsGiftable', '!IsGiftable', 'js-custom-filter', toggleHandler, $.cookie('HangarXPLOR.Feature.Giftable')));
  $controls2.append(HangarXPLOR.Toggle('Meltable', 'IsMeltable', '!IsMeltable', 'js-custom-filter', toggleHandler, $.cookie('HangarXPLOR.Feature.Meltable')));
  $controls2.append(HangarXPLOR.Toggle('Upgraded', 'IsUpgraded', '!IsUpgraded', 'js-custom-filter', toggleHandler, $.cookie('HangarXPLOR.Feature.Upgraded')));
  $controls2.append(HangarXPLOR.Toggle('Valuable', 'HasValue',   '!HasValue',   'js-custom-filter', toggleHandler, $.cookie('HangarXPLOR.Feature.Valuable')));
  $controls2.append(HangarXPLOR.Toggle('Reward',   'IsReward',   '!IsReward',   'js-custom-filter', toggleHandler, $.cookie('HangarXPLOR.Feature.Reward')));
  $controls2.append(HangarXPLOR.Toggle('Selected', 'IsSelected',  null,         'js-custom-filter', toggleHandler));
  $controls2.append(HangarXPLOR.Toggle('Free CCUs','IsFreeCCU',  '!IsFreeCCU',  'js-custom-filter', toggleHandler, '!IsFreeCCU'));

  $controls3.append(HangarXPLOR.SearchBox(function(event) { HangarXPLOR.Render();  HangarXPLOR.RefreshPager(); }));
  $controls3.append(HangarXPLOR.SearchBoxSuggestion(function(event) { HangarXPLOR.Render();  HangarXPLOR.RefreshPager(); }));

  HangarXPLOR.Render();
  HangarXPLOR.BindBulkUI();
  HangarXPLOR.RefreshBulkUI();
  HangarXPLOR.RefreshPager();
}
