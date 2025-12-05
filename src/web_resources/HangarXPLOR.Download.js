
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
      $.map(data, (ship) => { HangarXPLOR._exportByName[ship.ship_name.toLowerCase()] = ship });
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
        var ship_name = $('.title', $ship).text().trim();
        ship_name = ship_name.replace(/^(?:Aegis|Anvil|Aopoa|Banu|CNOU|Crusader|Drake|Greycat Industrial|Greycat|Esperia|Kruger|MISC|Origin|RSI|Tumbril|Vanduul|Xi'an)[^a-z0-9]+/gi, '').trim();
        var lookup = ship_name.toLowerCase();
        var nickname = $('.custom-name-text', $ship).text();
        var i, j;
        
        for (i = 0, j = HangarXPLOR._shipMatrix.length; i < j; i++) {
          if (lookup.indexOf(HangarXPLOR._shipMatrix[i].name.toLowerCase()) > -1 || lookup.indexOf((HangarXPLOR._shipMatrix[i].displayName || 'NOTFOUND').toLowerCase()) > -1) {

            HangarXPLOR.Log('Matched', HangarXPLOR._shipMatrix[i].name, 'in', lookup);

            lookup = (HangarXPLOR._shipMatrix[i].export || HangarXPLOR._shipMatrix[i].name).toLowerCase().trim();
            break;
          }
        }
        
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
    }).sort(function(a, b) { return a.manufacturer == b.manufacturer ? (a.name < b.name ? -2 : 2) : (a.manufacturer < b.manufacturer ? -1 : 1); }).get();
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

  // =============================================
  // Buyback Export Functions
  // =============================================

  /**
   * Gets the buyback list for export
   * @param {Array} target - Array of buyback items to export (optional, defaults to full inventory)
   * @returns {Array} Array of buyback item objects
   */
  HangarXPLOR.GetBuybackList = function(target) {
    var items = target || HangarXPLOR._buybackInventory;

    return $.map(items, function(item) {
      return {
        type: item.buyback_type,
        name: item.buyback_name,
        pledge_id: item.pledge_id,
        last_modified: item.last_modified,
        contained: item.contained,
        is_available: item.is_available
      };
    });
  };

  /**
   * Downloads buyback inventory as JSON
   */
  HangarXPLOR._callbacks.DownloadBuybackJSON = function(e) {
    e.preventDefault();

    var exportData = {
      fetched_at: new Date().toISOString(),
      total_items: HangarXPLOR._buybackInventory.length,
      counts: HangarXPLOR._buybackCounts,
      items: HangarXPLOR.GetBuybackList()
    };

    $download.attr('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2)));
    $download.attr('download', 'buyback-list.json');
    $download.attr('type', 'text/json');
    $download[0].click();
  };

  /**
   * Downloads buyback inventory as CSV
   */
  HangarXPLOR._callbacks.DownloadBuybackCSV = function(e) {
    e.preventDefault();

    var fetchedAt = new Date().toISOString();
    var items = HangarXPLOR.GetBuybackList();

    // CSV header with fetch timestamp as a comment
    var buffer = "# Fetched: " + fetchedAt + "\n";
    buffer += "Type,Name,Pledge ID,Last Modified,Contained,Available\n";

    // CSV rows
    buffer += items.map(function(item) {
      // Escape quotes in strings
      var escapeCsv = function(str) {
        if (str === null || str === undefined) return '""';
        str = String(str);
        // Escape double quotes by doubling them
        str = str.replace(/"/g, '""');
        return '"' + str + '"';
      };

      return [
        escapeCsv(item.type),
        escapeCsv(item.name),
        item.pledge_id,
        escapeCsv(item.last_modified),
        escapeCsv(item.contained),
        item.is_available
      ].join(',');
    }).join('\n');

    $download.attr('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(buffer));
    $download.attr('download', 'buyback-list.csv');
    $download.attr('type', 'text/csv');
    $download[0].click();
  };

})();
