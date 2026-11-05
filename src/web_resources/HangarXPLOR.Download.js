
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR._callbacks = HangarXPLOR._callbacks || {};
HangarXPLOR._exportByName = HangarXPLOR._exportByName || {};

(function() {

  var $download = $('<a />');
  $download.hide();
  $(document.body).append($download);
  
  
  $.ajax({
    url: $('#HangarXPLOR-ajax-ship-codes-json').data('ajax'),
    method: 'GET',
    dataType: 'json',
    success: function(data) {
      $.map(data, (ship) => { HangarXPLOR._exportByName[ship.ship_name.toLowerCase().trim()] = ship });
    }
  });

  HangarXPLOR.GetShipList = function($target) {
    
    return $target.map(function() { 
      var $pledge = this;
      var pledge = {};
      pledge.name = $('.js-pledge-name', $pledge).val();
      pledge.id = $('.js-pledge-id', $pledge).val();
      pledge.cost = $('.js-pledge-value', $pledge).val();
      pledge.lti = $('.title:contains(Lifetime Insurance)', $pledge).length > 0;
      pledge.date = $('.date-col:first', $pledge).text().replace(/created:\s+/gi, '').trim();
      pledge.warbond = pledge.name.toLowerCase().indexOf('warbond') > -1;

      return $('.kind:contains(Ship)', this).parent().map(function() {
        var $ship = this;
        var title = $('.title', $ship).text().trim();
        var ship_name = title.replace(/^(?:Aegis|Anvil|Aopoa|Argo|Banu|CNOU|Consolidated Outland|Crusader|Drake|Esperia|Gatac|Greycat Industrial|Greycat|Grey's Market|Grey's|Kruger|MISC|Mirai|Origin|RSI|Tumbril|Vanduul|Xi'an)[^a-z0-9]+/gi, '').trim();
        var lookup = ship_name.toLowerCase();
        var nickname = $('.custom-name-text', $ship).text();
        var i, j;
        var haystack = HangarXPLOR.NormalizeName(title);

        for (i = 0, j = HangarXPLOR._shipMatrix.length; i < j; i++) {
          // Match on the full title: some overrides keep the manufacturer ('Argo Mole - Carbon Edition')
          if (HangarXPLOR.ContainsName(haystack, HangarXPLOR._shipMatrix[i].name) || HangarXPLOR.ContainsName(haystack, HangarXPLOR._shipMatrix[i].displayName)) {

            HangarXPLOR.Log('Matched', HangarXPLOR._shipMatrix[i].name, 'in', lookup);

            lookup = (HangarXPLOR._shipMatrix[i].export || HangarXPLOR._shipMatrix[i].name).toLowerCase().trim();
            break;
          }
        }
        
        // Hangar titles sometimes differ from the matrix by dots ("A.T.L.S.") or an " Edition" suffix
        var known = [ lookup, lookup.replace(/\./g, ''), lookup.replace(/\s+edition$/, '') ].filter((name) => HangarXPLOR._exportByName[name])[0];
        if (known) lookup = known;

        var ship = HangarXPLOR._exportByName[lookup] ? { ...HangarXPLOR._exportByName[lookup] } : {
          unidentified: 'Please report this ship to the plugin developers at https://github.com/dolkensp/HangarXPLOR/issues',
          ship_code: ($('.liner span', $ship).text().trim() + '_' + ship_name).replace(/[^a-z0-9]/gi, '_').replace(/__+/gi, '_'),
          manufacturer_name: $('.liner', $ship).text().trim().replace(/\(.*\)/, '').trim(),
          lookup: lookup,
        };
        
        ship.manufacturer_code = $('.liner span', $ship).text().trim();
        ship.lti         = pledge.lti;
        ship.name        = ship_name;
        ship.warbond     = pledge.warbond;
        ship.entity_type = 'ship';
        ship.ship_name   = nickname.length > 0 ? nickname : ship.ship_name;
        ship.pledge_id   = pledge.id;
        ship.pledge_name = pledge.name;
        ship.pledge_date = pledge.date;
        ship.pledge_cost = pledge.cost;
        
        return ship;
      }).get()
    }).sort(function(a, b) { return a.manufacturer_name == b.manufacturer_name ? (a.name < b.name ? -1 : a.name > b.name ? 1 : 0) : (a.manufacturer_name < b.manufacturer_name ? -1 : 1); }).get();
  }
  
  HangarXPLOR._callbacks.DownloadJSON = function(e) {
    e.preventDefault();
    
    // TODO: Check why
    var $target = $(HangarXPLOR._selected.length > 0 ? HangarXPLOR._selected : HangarXPLOR._inventory);
    
    $download.attr('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(HangarXPLOR.GetShipList($target), null, 2)));
    $download.attr('download', 'shiplist.json');
    $download.attr('type', 'text/json');
    $download[0].click();
  }
  
  HangarXPLOR._callbacks.DownloadCSV = function(e) {
    e.preventDefault();

    var $target = $(HangarXPLOR._selected.length > 0 ? HangarXPLOR._selected : HangarXPLOR._inventory);

    // TODO: CSV support will need to be careful of user-entered data...
    var buffer = "Manufacturer, Ship, Lti, Warbond, ID, Pledge, Cost, Date\n";
    buffer = buffer + HangarXPLOR.GetShipList($target).map(function(ship) { return [ '"' + ship.manufacturer_name + '"', '"' + ship.ship_name + '"', ship.lti, ship.warbond, ship.pledge_id, '"' + ship.pledge_name + '"', '"' + ship.pledge_cost + '"', '"' + ship.pledge_date + '"' ].join(',')}).join('\n')

    $download.attr('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(buffer));
    $download.attr('download', 'shiplist.csv');
    $download.attr('type', 'text/csv');
    $download[0].click();
  }

  HangarXPLOR.GetUpgradeList = function($target) {

    return $target.map(function() {
      var $pledge = this;

      if (!this.filters || !this.filters.is_upgrade) return null;

      var upgrade = this.upgrade_data ? { ...this.upgrade_data } : {};

      upgrade.entity_type = 'upgrade';
      upgrade.lti         = this.filters.is_lti === true;
      upgrade.warbond     = this.filters.is_warbond === true;
      upgrade.pledge_id   = $('.js-pledge-id', $pledge).val();
      upgrade.pledge_name = $('.js-pledge-name', $pledge).val();
      upgrade.pledge_date = $('.date-col:first', $pledge).text().replace(/created:\s+/gi, '').trim();
      upgrade.pledge_cost = $('.js-pledge-value', $pledge).val();

      return upgrade;
    }).get().filter(function(upgrade) { return upgrade !== null });
  }

  HangarXPLOR.GetCombinedList = function($target) {
    return {
      ships:    HangarXPLOR.GetShipList($target),
      upgrades: HangarXPLOR.GetUpgradeList($target)
    };
  }

  HangarXPLOR._callbacks.DownloadUpgradesJSON = function(e) {
    e.preventDefault();

    var $target = $(HangarXPLOR._selected.length > 0 ? HangarXPLOR._selected : HangarXPLOR._inventory);

    $download.attr('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(HangarXPLOR.GetUpgradeList($target), null, 2)));
    $download.attr('download', 'upgradelist.json');
    $download.attr('type', 'text/json');
    $download[0].click();
  }

  HangarXPLOR._callbacks.DownloadUpgradesCSV = function(e) {
    e.preventDefault();

    var $target = $(HangarXPLOR._selected.length > 0 ? HangarXPLOR._selected : HangarXPLOR._inventory);

    var buffer = "Pledge ID, Pledge, Cost, Date, Upgrade ID, Upgrade, From, To, Lti, Warbond\n";
    buffer = buffer + HangarXPLOR.GetUpgradeList($target).map(function(upgrade) {
      var from_name = upgrade.match_items && upgrade.match_items[0] ? upgrade.match_items[0].name : '';
      var to_name   = upgrade.target_items && upgrade.target_items[0] ? upgrade.target_items[0].name : '';
      return [ upgrade.pledge_id, '"' + upgrade.pledge_name + '"', '"' + upgrade.pledge_cost + '"', '"' + upgrade.pledge_date + '"', upgrade.id, '"' + upgrade.name + '"', '"' + from_name + '"', '"' + to_name + '"', upgrade.lti, upgrade.warbond ].join(',');
    }).join('\n')

    $download.attr('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(buffer));
    $download.attr('download', 'upgradelist.csv');
    $download.attr('type', 'text/csv');
    $download[0].click();
  }

  HangarXPLOR._callbacks.DownloadCombinedJSON = function(e) {
    e.preventDefault();

    var $target = $(HangarXPLOR._selected.length > 0 ? HangarXPLOR._selected : HangarXPLOR._inventory);

    $download.attr('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(HangarXPLOR.GetCombinedList($target), null, 2)));
    $download.attr('download', 'hangar.json');
    $download.attr('type', 'text/json');
    $download[0].click();
  }
})();
