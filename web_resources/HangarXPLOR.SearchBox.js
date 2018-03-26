
var HangarXPLOR = HangarXPLOR || {};

// Render a searchbox
HangarXPLOR.SearchBox = function(callback)
{
  if (HangarXPLOR.logsEnabled) {
    console.log('Rendering SearchBox', value);
  }

  var $searchBox = $('<input>', { class: 'js-custom-search', placeholder: 'Search...' });

  $searchBox.keyup(function(event) {
     callback(event);
  });

  return $searchBox;
}
