
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR._callbacks = HangarXPLOR._callbacks || {};

(function() {

  var $download = $('<a />');
  $download.hide();
  $(document.body).append($download);

  var _manufacturerNameByCode = {
    'ANVL': 'Anvil Aerospace',
    'AEGS': 'Aegis Dynamics',
    'AOPOA': 'Xi\'an Aopoa',
    'ARGO': 'ARGO Astronautics',
    'BANU': 'Banu Souli',
    'CNOU': 'Consolidated Outland',
    'CRSD': 'Crusader Industries',
    'DRAK': 'Drake Interplanetary',
    'ESPR': 'Esperia Inc',
    'ESPERIA': 'Esperia Inc',
    'KRGR': 'Kruger Intergalactic',
    'MISC': 'Musashi Industrial & Starflight Concern',
    'ORIG': 'Origin Jumpworks GmbH',
    'RSI': 'Roberts Space Industries',
    'TMBL': 'Tumbril Land Systems',
    'VNCL': 'Vanduul',
    'VANDUUL': 'Vanduul',
    'XIAN': 'Xi\'an Aopoa',
    'XNAA': 'Xi\'an Aopoa',
  };

  var _manufacturerCodeByName = {
    'Anvil Aerospace': 'ANVL',
    'Aegis Dynamics': 'AEGS',
    'ARGO Astronautics': 'ARGO',
    'Banu Souli': 'BANU',
    'Consolidated Outland': 'CNOU',
    'Crusader Industries': 'CRSD',
    'Drake Interplanetary': 'DRAK',
    'Esperia Inc': 'ESPR',
    'Kruger Intergalactic': 'KRGR',
    'Musashi Industrial & Starflight Concern': 'MISC',
    'Origin Jumpworks GmbH': 'ORIG',
    'Roberts Space Industries': 'RSI',
    'Tumbril Land Systems': 'TMBL',
    'Vanduul': 'VNCL',
    'Xi\'an Aopoa': 'XIAN',
  };
  
  var _shipNameCorrection = {
    '890 JUMP': '890 Jump',
    '600i Exploration Module': '600i',
    '315p Explorer': '315p',
    '350r Racer': '350r',
    'Caterpillar Pirate Edition': 'Caterpillar - Pirate Edition',
    'Dragonfly Black': 'Dragonfly',
    'Dragonfly Yellowjacket': 'Dragonfly',
    'Pirate Gladius': 'Gladius - Pirate Edition',
    'Valkyrie Liberator Edition': 'Valkyrie',
  };
  
  var _shipCodeCorrection = {
    '890_Jump': '890Jump',
    'ESPR_Blade': 'VNCL_Blade',
    'ESPR_Scythe': 'VNCL_Scythe',
    'ESPR_Glaive': 'VNCL_Glaive',
    'Mercury_Star_Runner': 'Star_Runner',
    'F7CM_Super_Hornet': 'Hornet_F7CM',
    'F7CS_Hornet_Ghost': 'Hornet_F7S',
    'F7CR_Hornet_Tracker': 'Hornet_F7S',
    'F7CN_Hornet_Heartseeker': 'Hornet_F7CM',
    'F7C_Hornet_Wildfire': 'Hornet_F7C',
  };

  HangarXPLOR.GetShipList = function() {
    var $target = $(HangarXPLOR._selected.length > 0 ? HangarXPLOR._selected : HangarXPLOR._inventory); //: HangarXPLOR._filtered);
    // console.log('GetShipList $target', JSON.stringify($target));
    return $target.map(function() { 
      var $pledge = this;
      var item = {};
      item.name = $('.js-pledge-name', $pledge).val();
      
      item.id = $pledge.pledgeId; // $('.js-pledge-id', $pledge).val();
      item.cost = $pledge.meltValue; // $('.js-pledge-value', $pledge).val();
      item.lti = $pledge.hasLTI; // $('.title:contains(Lifetime Insurance)', $pledge).length > 0;
      item.date = $('.date-col:first', $pledge).text().replace(/created:\s+/gi, '').trim();
      item.warbond = $pledge.isWarbond; // item.name.toLowerCase().indexOf('warbond') > -1;
      item.giftable = $pledge.isGiftable;
      item.pledge = $pledge.displayName;
      item.package = $pledge.isPackage ? 1 : 0;

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
          ship.name = $('.title', $ship).text().trim();
          ship.name = HangarXPLOR.CleanShipName(ship.name);
          ship.name = ship.name.replace(/^\s*(?:Aegis|Anvil|Banu|Drake|Esperia|Kruger|MISC|Origin|RSI|Tumbril|Vanduul|Xi'an)[^a-z0-9]+/gi, '');
          ship.manufacturer_code = $('.liner span', $ship).text();
          ship.manufacturer_name = _manufacturerNameByCode[ship.manufacturer_code] || ship.manufacturer_code;
          ship.manufacturer_code = _manufacturerCodeByName[ship.manufacturer_name] || ship.manufacturer_code;
          ship.ship_code = ship.manufacturer_code + '_' + ship.name.replace(/Aurora [A-Z]+/gi, 'Aurora').replace(/ - .*/gi, '').replace(/-/gi, '').replace(/ /gi, '_');
          ship.ship_code = _shipCodeCorrection[ship.ship_code] || ship.ship_code;
          ship.ship_name = $('.custom-name-text', $ship).text() || ship.name;
          ship.ship_serial = $('.liner:contains(Serial)',  $ship).text().replace(/Serial: /, '') || null;
          ship.pledge_id = pledge.id;
          ship.pledge_name = pledge.name;
          ship.pledge_date = new Date(Date.parse(pledge.date)).toISOString().substr(0, 10);
          ship.pledge_cost = pledge.cost;
          ship.lti = pledge.lti;
          ship.warbond = pledge.warbond;
          ship.type = 'Ship';
          item.cost = 0; // Don't report cost for remaining ships in this Package/Combo
          item.package = 0; // Don't report package for remaining ships in this Package/Combo
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
    
    var items = HangarXPLOR.GetShipList();

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
    
    var items = HangarXPLOR.GetShipList();
    
    // TODO: CSV support will need to be careful of user-entered data...
    //var buffer = "Pledge,Type,Manufacturer,Name,ID,Cost,Date,LTI,Warbond,Package,Giftable\r\n"; // Other header idea (would need to adjust below)
    var buffer = "Manufacturer, Ship, Lti, Warbond, ID, Pledge, Cost, Date\n";
    buffer = buffer + items.map(function(item) {
        return [
            '"' + item.manufacturer_code + '"',
            '"' + item.name + '"',
            item.lti,
            item.warbond,
            item.pledge_id,
            '"' + item.pledge_name + '"',
            '"' + item.pledge_cost + '"',
            '"' + item.pledge_date + '"' 
        ]
        .join(',')
    })
    .join('\n')


    // console.log('DownloadCSV buffer\n', buffer);
    // return;

    $download.attr('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(buffer));
    $download.attr('download', 'HangarItems.csv');
    $download.attr('type', 'text/csv');
    $download[0].click();
  }
})();
