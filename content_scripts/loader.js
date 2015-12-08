
!function() {
  var scripts = [
    'HangarXPLOR.DrawUI.js',
    'HangarXPLOR.Dropdown.js',
    'HangarXPLOR.Filter.js',
    'HangarXPLOR.LoadPage.js',
    'HangarXPLOR.ProcessItem.js',
    'HangarXPLOR.ProcessPage.js',
    'HangarXPLOR.Render.js',
    'HangarXPLOR.Search.js',
    'HangarXPLOR.SearchBox.js',
    'HangarXPLOR.Ships.js',
    'HangarXPLOR.Sort.js',
    'HangarXPLOR.Toggle.js',
    'HangarXPLOR.js'
  ];
  
  for (var i = 0, j = scripts.length; i < j; i++) {
    var scriptURL = chrome.extension.getURL('web_resources/' + scripts[i]);
    console.log('Loading', scriptURL);
    var script = document.createElement('script');
    script.id = 'xplorjs-' + i;
    script.type = 'text/javascript';
    script.src = scriptURL;
    document.body.appendChild(script);
  }
}()
