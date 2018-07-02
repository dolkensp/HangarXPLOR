
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR._callbacks = HangarXPLOR._callbacks || {};

(function() {

  var $download = $('<a />');
  $download.hide();
  $(document.body).append($download);

  var _manufacturerShortMap = {
    'ANVL': 'Anvil',
    'AEGS': 'Aegis',
    'AOPOA': 'Aopoa',
    'ARGO': 'Argo',
    'BANU': 'Banu',
    'CNOU': 'Consolidated Outland',
    'CRSD': 'Crusader',
    'DRAK': 'Drake',
    'ESPERIA': 'Esperia',
    'KRGR': 'Kruger',
    'MISC': 'MISC',
    'ORIG': 'Origin',
    'RSI': 'RSI',
    'TMBL': 'Tumbril',
    'VANDUUL': 'Vanduul',
    'XIAN': 'Xi\'an',
  };

  HangarXPLOR.GetDownloadItems = function() {
    var $target = $(HangarXPLOR._selected.length > 0 ? HangarXPLOR._selected : HangarXPLOR._filtered);
    return $target.map(function() { 
      var $pledge = this;
      var item = {};
      item.name = $('.js-pledge-name', $pledge).val();
      item.id = $('.js-pledge-id', $pledge).val();
      item.cost = $('.js-pledge-value', $pledge).val();
      item.lti = $('.title:contains(Lifetime Insurance)', $pledge).length > 0;
      item.date = $('.date-col:first', $pledge).text().replace(/created:\s+/gi, '').trim();
      item.warbond = item.name.toLowerCase().indexOf('warbond') > -1;

      return $('.kind:contains(Ship)', this).parent().map(function() {
        var $ship = this;
        var ship = {};
        ship.manufacturer = $('.liner span', $ship).text();
        ship.manufacturer = _manufacturerShortMap[ship.manufacturer] || ship.manufacturer;
        ship.name = $('.title', $ship).text();
        ship.name = ship.name.replace(/^\s*(?:Aegis|Anvil|Banu|Drake|Esperia|Kruger|MISC|Origin|RSI|Tumbril|Vanduul|Xi'an)[^a-z0-9]+/gi, '');
        ship.lti = item.lti;
        ship.warbond = item.warbond;
        ship.package_id = item.id;
        ship.pledge = item.name;
        ship.pledge_date = item.date;
        ship.cost = item.cost;
        return ship;
      }).get()
    })
    // Sort any inner ships by manufacturer and then name
    .sort(function(a, b) {
      if (a.manufacturer < b.manufacturer) {
        return -1
      }
      if (a.manufacturer > b.manufacturer) {
        return 1
      }
      if (a.name < b.name) {
        return -1
      }
      if (a.name > b.name) {
        return 1
      }
      return 0;
    })
    .get();
  }
  
  HangarXPLOR._callbacks.DownloadJSON = function(e) {
    e.preventDefault();
    
    var items = HangarXPLOR.GetDownloadItems();

    var buffer = JSON.stringify(items, null, 2);
    
    $download.attr('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(buffer));
    $download.attr('download', 'HangarItems.json');
    $download.attr('type', 'text/json');
    $download[0].click();
  }
  
  HangarXPLOR._callbacks.DownloadCSV = function(e) {
    e.preventDefault();
    
    var items = HangarXPLOR.GetDownloadItems();
    
    var buffer = "Manufacturer, Ship, Lti, Warbond, ID, Pledge, Cost, Date\n";
    buffer = buffer + items.map(function(ship) {
      return [
        '"' + ship.manufacturer + '"',
        '"' + ship.name + '"',
        ship.lti,
        ship.warbond,
        ship.package_id,
        '"' + ship.pledge + '"',
        '"' + ship.cost + '"',
        '"' + ship.pledge_date + '"'
      ]
      .join(',')
    })
    .join('\n')

    $download.attr('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(buffer));
    $download.attr('download', 'HangarItems.csv');
    $download.attr('type', 'text/csv');
    $download[0].click();
  }
})();
