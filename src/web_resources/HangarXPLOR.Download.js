
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
        ship.name = $('.title', $ship).text().trim();
        ship.name = ship.name.replace(/^\s*(?:Aegis|Anvil|Aopoa|Argo|Banu|CNOU|Crusader|Drake|Esperia Vanduul|Esperia|Kruger|MISC|Origin|RSI|Tumbril|Captured Vanduul|Vanduul|Xi'an)[^a-z0-9]+/gi, '');
        ship.name = _shipNameCorrection[ship.name] || ship.name;
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
    
    // TODO: CSV support will need to be careful of user-entered data...
    var buffer = "Manufacturer, Ship, Lti, Warbond, ID, Pledge, Cost, Date\n";
    buffer = buffer + HangarXPLOR.GetShipList($target).map(function(ship) { return [ '"' + ship.manufacturer + '"', '"' + ship.name + '"', ship.lti, ship.warbond, ship.package_id, '"' + ship.pledge + '"', '"' + ship.cost + '"', '"' + ship.pledge_date + '"' ].join(',')}).join('\n')

    $download.attr('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(buffer));
    $download.attr('download', 'shiplist.csv');
    $download.attr('type', 'text/csv');
    $download[0].click();
  }
})();
