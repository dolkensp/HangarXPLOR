
var HangarXPLOR = HangarXPLOR || {};

// Render a searchbox
HangarXPLOR.SearchBox = function()
{
  if (HangarXPLOR.logsEnabled) {
    console.log('Rendering SearchBox', value);
  }

  const $searchBox = $('<input>', { id: 'searchInput', class: 'js-custom-search' });
  const $searchBoxMirror = $('<input>', { class: 'js-custom-search js-custom-search-complete', disabled: "disabled" });

  $searchBox.keyup(function(event) {
      HangarXPLOR.Render();
      HangarXPLOR.RefreshPager();
  });

  $searchBox.keydown(function(event) {
      if(event.keyCode === 9) {
          event.preventDefault();
          $('#searchInput').val($('.js-custom-search-complete').val());
      }
  })

  return [$searchBox[0], $searchBoxMirror[0]];
}
