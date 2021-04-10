
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR.$list = null;                            // Element where we display the pledges
HangarXPLOR._inventory = [];                         // Inventory containing all pledges
HangarXPLOR._debugRoot = $('#HangarXPLOR-js-0').attr('src').replace(/(.*)web_resources.*/, "$1");
HangarXPLOR._shipCount     = HangarXPLOR._shipCount || 0;
HangarXPLOR._upgradeCount  = HangarXPLOR._upgradeCount || 0;
HangarXPLOR._giftableCount = HangarXPLOR._giftableCount || 0;
HangarXPLOR._packageCount  = HangarXPLOR._packageCount || 0;
HangarXPLOR._ltiCount      = HangarXPLOR._ltiCount || 0;
HangarXPLOR._cacheSalt     = HangarXPLOR._cacheSalt || btoa(Math.random());

var RSI = RSI || {};

HangarXPLOR.Initialize = function()
{
  $.ajax({ 
    url: '/ship-matrix/index', 
    method: 'GET', 
    dataType: 'json', 
    success: (response) => { 
      
      var customShips = $.extend({}, HangarXPLOR._ships);
      
      HangarXPLOR._shipMatrix = response.data
        .map((ship) => {
          var rsiShip = {
            name: ship.name
              .replace(/^Aegis /i, '')
              .replace(/^Anvil /i, '')
              .replace(/^Aopoa /i, '')
              .replace(/^Argo /i, '')
              .replace(/^Banu /i, '')
              .replace(/^CNOU /i, '')
              .replace(/^Drake /i, '')
              .replace(/^Esperia /i, '')
              .replace(/^Greycat /i, '')
              .replace(/^Kruger /i, '')
              .replace(/^MISC /i, '')
              .replace(/^Origin /i, '')
              .replace(/^RSI /i, '')
              .replace(/^Tumbril /i, '')
              .replace(/^Vanduul /i, '')
              .replace(/^Xi'an /i, '')
              .trim(),
            thumbnail: ship.media[0].images.heap_infobox,
            url: ship.url,
            focus: ship.focus,
          };
          
          var customShip = HangarXPLOR._ships[rsiShip.name];

          delete customShips[rsiShip.name];

          return $.extend({}, rsiShip, customShip);
        })
      
        .concat($.map(customShips, (ship, key) => {
          if (ship.name == undefined) ship.name = key;
          return ship;
        }))
      
        .sort((a, b) => {
          if (a.name.length > b.name.length) return -1;
          if (a.name < b.name) return 0;
          return 1;
        });
      
      HangarXPLOR._componentMatrix = []
        .concat($.map(HangarXPLOR._components, (component, key) => {
          if (component.name == undefined) component.name = key;
          return component;
        }))
        .sort((a, b) => {
          if (a.name.length > b.name.length) return -1;
          if (a.name < b.name) return -1;
          return 1;
        });
      
      HangarXPLOR.LoadSettings(function() {
        var $lists = $('.list-items');
        
        if ($lists.length == 1) {
          HangarXPLOR.BulkUI();
          HangarXPLOR.$list = $($lists[0]);
          HangarXPLOR.$list.addClass('js-inventory');
          $lists = undefined;
          
          HangarXPLOR.UpdateStatus(0);
          
          RSI.Api.Account.pledgeLog((payload) => {
    
            var today = new Date().toISOString();
            var safetySalt = '';
    
            // CIG Released ship naming in March 2021, which requires us to invalidate cache
            if (today.substr(0, 7) == '2021-03') safetySalt = today.substr(0, 13) + ':';
    
            HangarXPLOR._activeHash = safetySalt + payload.data.rendered.length + ':' + btoa(payload.data.rendered.substr(39, 20)) + ':' + HangarXPLOR._cacheSalt;
            
            HangarXPLOR.LoadCache(HangarXPLOR.LoadPage);
          });
          
        } else {
          HangarXPLOR.Log('Error locating inventory');
        }
      });
    }
  });
}

HangarXPLOR.Initialize();
