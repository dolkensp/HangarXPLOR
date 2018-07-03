
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
    // console.log('GetDownloadItems $target', JSON.stringify($target));    
    return $target.map(function() { 
      var $pledge = this;
      var item = {};
      item.id = $pledge.pledgeId;
      item.cost = $pledge.meltValue;
      item.lti = $pledge.hasLTI;
      item.date = $('.date-col:first', $pledge).text().replace(/created:\s+/gi, '').trim();
      item.warbond = $pledge.isWarbond;
      item.giftable = $pledge.isGiftable;
      item.pledge = $pledge.displayName;
      item.package = $pledge.isPackage;

      if (this.isUpgrade) {
        // console.log('GetDownloadItems $pledge', JSON.stringify($pledge));
        var parts = /^(.+?) - (.+?)( - .+)? \(\d+\)$/m.exec(item.pledge)
        // console.log('GetDownloadItems parts', JSON.stringify(parts));
        item.type = parts[1];
        item.manufacturer = 'N/A';
        item.name = parts[2];
        return item;
      } else {
        return $('.kind:contains(Ship)', this).parent().map(function() {
          var $ship = this;
          // console.log('GetDownloadItems $ship', JSON.stringify($ship));          
          var ship = Object.assign({}, item);
          item.cost = 0; // Don't report cost for remaining ships in this Package/Combo
          ship.type = 'Ship';
          ship.manufacturer = $('.liner span', $ship).text();
          ship.manufacturer = _manufacturerShortMap[ship.manufacturer] || ship.manufacturer;
          ship.name = $('.title', $ship).text();
          ship.name = HangarXPLOR.CleanShipName(ship.name);
          ship.name = ship.name.replace(/^\s*(?:Aegis|Anvil|Banu|Drake|Esperia|Kruger|MISC|Origin|RSI|Tumbril|Vanduul|Xi'an)[^a-z0-9]+/gi, '');
          return ship;
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
        .get()
      }
    })
    .get();
  }
  
  HangarXPLOR._callbacks.DownloadJSON = function(e) {
    e.preventDefault();
    
    var items = HangarXPLOR.GetDownloadItems();

    var buffer = JSON.stringify(items, null, 2);

    // console.log('DownloadJSON buffer\n', buffer);
    // return;
    
    $download.attr('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(buffer));
    $download.attr('download', 'HangarItems.json');
    $download.attr('type', 'text/json');
    $download[0].click();
  }
  
  HangarXPLOR._callbacks.DownloadCSV = function(e) {
    e.preventDefault();
    
    var items = HangarXPLOR.GetDownloadItems();
    
    var buffer = "Pledge,Type,Manufacturer,Name,ID,Cost,Date,LTI,Warbond,Package,Giftable\r\n";
    buffer = buffer + items.map(function(item) {
      return [
        '"' + item.pledge + '"',
        '"' + item.type + '"',
        '"' + item.manufacturer + '"',
        '"' + item.name + '"',
        item.id,
        item.cost,
        '"' + item.date + '"',
        item.lti,
        item.warbond,
        item.package,
        item.giftable
      ]
      .join(',')
    })
    .join('\r\n')

    // console.log('DownloadCSV buffer\n', buffer);
    // return;

    $download.attr('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(buffer));
    $download.attr('download', 'HangarItems.csv');
    $download.attr('type', 'text/csv');
    $download[0].click();
  }
})();
