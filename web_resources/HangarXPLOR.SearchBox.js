
var HangarXPLOR = HangarXPLOR || {};

// Render a searchbox
HangarXPLOR.SearchBox = function(callback)
{
  if (HangarXPLOR.logsEnabled) {
    console.log('Rendering SearchBox', value);
  }

  const $searchBox = $('<input>', { id: 'searchInput', class: 'js-custom-search' });
  const $searchBoxMirror = $('<input>', { class: 'js-custom-search js-custom-search-complete', disabled: "disabled" })

  $searchBox.keyup(function(event) {
      callback(event);
  });

  $searchBox.keydown(function(event) {
      if(event.keyCode === 9) {
          event.preventDefault();
          $('#searchInput').val($('.js-custom-search-complete').val());
      }
  })

  return [$searchBox, $searchBoxMirror];
}
