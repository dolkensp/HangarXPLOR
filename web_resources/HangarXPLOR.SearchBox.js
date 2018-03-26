
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

HangarXPLOR.SearchBoxSuggestion = function(callback)
{
    if (HangarXPLOR.logsEnabled) {
      console.log('Rendering SearchBoxSuggestion', value);
    }

    var $suggestion = $('<p>', { class: 'js-custom-search-suggestion' });
    $suggestion.keyup(function(event) {
        callback(event);
    });

    return $suggestion;
}
