
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
HangarXPLOR._initCount     = HangarXPLOR._initCount || 0;

var RSI = RSI || {};

// Lower-case a name, collapse dotted acronyms ("A.T.L.S." -> "atls") and turn any other punctuation into
// single spaces, padded with a space either side so whole words can be found with indexOf(' word ').
HangarXPLOR.NormalizeName = function(name)
{
  return ' ' + (name || '').toLowerCase()
    .replace(/\b[a-z](?:\.[a-z])+\.?(?![a-z0-9])/g, function(acronym) { return acronym.replace(/\./g, ''); })
    .replace(/[^a-z0-9]+/g, ' ')
    .trim() + ' ';
}

// Matrix names are matched against every pledge, so normalize each one only once
HangarXPLOR._normalizedNames = {};

// True when needle appears in haystack as whole words, so "Mk I" doesn't match inside "Mk II".
// Punctuation is ignored: "Argo Mole - Carbon Edition" matches "Argo Mole Carbon Edition".
// haystack must already be passed through NormalizeName; callers do that once per title, not once per needle.
HangarXPLOR.ContainsName = function(haystack, needle)
{
  if (!needle) return false;
  var normalized = HangarXPLOR._normalizedNames[needle];
  if (normalized === undefined) normalized = HangarXPLOR._normalizedNames[needle] = HangarXPLOR.NormalizeName(needle);
  // Both sides are space-padded, so a match can't start or end part-way through a word
  return normalized.length > 2 && haystack.indexOf(normalized) > -1;
}

// Longest names first, so the first match is the most specific ("Sabre Raven" before "Sabre")
HangarXPLOR.ByLongestName = function(a, b)
{
  return b.name.length - a.name.length || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
}

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
          
          // Overrides may be keyed by the stripped name or by the raw matrix name (e.g. 'Argo Mole Talus Edition')
          var customShip = HangarXPLOR._ships[rsiShip.name] || HangarXPLOR._ships[ship.name.trim()];

          delete customShips[rsiShip.name];
          delete customShips[ship.name.trim()];

          return $.extend({}, rsiShip, customShip);
        })
      
        .concat($.map(customShips, (ship, key) => {
          if (ship.name == undefined) ship.name = key;
          return ship;
        }))
      
        .sort(HangarXPLOR.ByLongestName);
      
      HangarXPLOR._componentMatrix = []
        .concat($.map(HangarXPLOR._components, (component, key) => {
          if (component.name == undefined) component.name = key;
          return component;
        }))
        .sort(HangarXPLOR.ByLongestName);
      
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

if (HangarXPLOR._initCount++ == 0) HangarXPLOR.Initialize();
