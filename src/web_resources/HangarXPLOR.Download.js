
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
    'CNOU': 'Consolidated',
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

  HangarXPLOR.GetPledgeList = function($target) {
   return $target.map(function() { 
      var $pledge = this;
      var pledge = {};
      pledge.name = $('.js-pledge-name', $pledge).val();
      pledge.id = $('.js-pledge-id', $pledge).val();
      pledge.cost = $('.js-pledge-value', $pledge).val();
      pledge.lti = $('.title:contains(Lifetime Insurance)', $pledge).length > 0;
      pledge.date = $('.date-col:first', $pledge).text().replace(/created:\s+/gi, '').trim();
      pledge.warbond = pledge.name.toLowerCase().indexOf('warbond') > -1;
      pledge.ships = $('.kind:contains(Ship)', this).parent().map(function() {
        var $ship = this;
        var shipName = $('.title', $ship).text();
        shipName = shipName.replace(/^\s*(?:Aegis|Anvil|Banu|Drake|Esperia|Kruger|MISC|Origin|RSI|Tumbril|Vanduul|Xi'an)[^a-z0-9]+/gi, '');
        shipName = shipName.replace(/^\s*(?:Aegis|Anvil|Banu|Drake|Esperia|Kruger|MISC|Origin|RSI|Tumbril|Vanduul|Xi'an)[^a-z0-9]+/gi, '');
        shipName = shipName.replace(/["',]/gi, '');
        return shipName;
      }).get()
      return pledge;
    }).get();
  }

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
        var ship = {};
        ship.manufacturer = $('.liner span', $ship).text();
        ship.manufacturer = _manufacturerShortMap[ship.manufacturer] || ship.manufacturer;
        ship.name = $('.title', $ship).text();
        ship.name = ship.name.replace(/^\s*(?:Aegis|Anvil|Banu|Drake|Esperia|Kruger|MISC|Origin|RSI|Tumbril|Vanduul|Xi'an)[^a-z0-9]+/gi, '');
        ship.name = ship.name.replace(/^\s*(?:Aegis|Anvil|Banu|Drake|Esperia|Kruger|MISC|Origin|RSI|Tumbril|Vanduul|Xi'an)[^a-z0-9]+/gi, '');
        ship.lti = pledge.lti;
        ship.warbond = pledge.warbond;
        ship.package_id = pledge.id;
        ship.pledge = pledge.name;
        ship.pledge_date = pledge.date;
        ship.cost = pledge.cost;
        return ship;
      }).get()
    }).sort(function(a, b) { return a.manufacturer == b.manufacturer ? (a.name < b.name ? -2 : 2) : (a.manufacturer < b.manufacturer ? -1 : 1); }).get();
  }
  
  HangarXPLOR._callbacks.DownloadJSON = function(e) {
    e.preventDefault();
    
    var $target = $(HangarXPLOR._selected.length > 0 ? HangarXPLOR._selected : HangarXPLOR._inventory);
    
    $download.attr('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(HangarXPLOR.GetShipList($target), null, 2)));
    $download.attr('download', 'shiplist.json');
    $download.attr('type', 'text/json');
    $download[0].click();
  }
  
  HangarXPLOR._callbacks.DownloadCSV = function(e) {
    e.preventDefault();
    
    var $target = $(HangarXPLOR._selected.length > 0 ? HangarXPLOR._selected : HangarXPLOR._inventory);
    
    var buffer = "Manufacturer, Ship, Lti, Warbond, ID, Pledge, Cost, Date\n";
    buffer = buffer + HangarXPLOR.GetShipList($target).map(function(ship) { return [ '"' + ship.manufacturer + '"', '"' + ship.name + '"', ship.lti, ship.warbond, ship.package_id, '"' + ship.pledge + '"', '"' + ship.cost + '"', '"' + ship.pledge_date + '"' ].join(',')}).join('\n')

    $download.attr('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(buffer));
    $download.attr('download', 'shiplist.csv');
    $download.attr('type', 'text/csv');
    $download[0].click();
  }

  HangarXPLOR._callbacks.DownloadPledgeJSON = function(e) {
    e.preventDefault();
    
    var $target = $(HangarXPLOR._inventory);
    
    $download.attr('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(HangarXPLOR.GetPledgeList($target), null, 2)));
    $download.attr('download', 'pledgelist.json');
    $download.attr('type', 'text/json');
    $download[0].click();
  }
  
  HangarXPLOR._callbacks.DownloadPledgeCSV = function(e) {
    e.preventDefault();
    
    var $target = $(HangarXPLOR._inventory);
    
    var buffer = "Name, ID, Cost, Date, Lti, Warbond, Ships\n";
    buffer = buffer + HangarXPLOR.GetPledgeList($target).map(function(pledge) { return [ '"' + pledge.name + '"', '"' + pledge.id + '"', '"' + pledge.cost + '"', '"' + pledge.date + '"', pledge.lti, pledge.warbond,  '"' + pledge.ships.join(',') + '"'].join(',')}).join('\n')

    $download.attr('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(buffer));
    $download.attr('download', 'pledgelist.csv');
    $download.attr('type', 'text/csv');
    $download[0].click();
  }

})();
