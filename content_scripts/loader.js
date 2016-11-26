
!function() {
  var namespace = 'HangarXPLOR';
  
  var styles = [
    'web_resources/HangarXPLOR.css'
  ];
  
  var scripts = [
    'web_resources/HangarXPLOR.BulkUI.js',
    'web_resources/HangarXPLOR.Button.js',
    'web_resources/HangarXPLOR.DrawUI.js',
    'web_resources/HangarXPLOR.Dropdown.js',
    'web_resources/HangarXPLOR.Filter.js',
    'web_resources/HangarXPLOR.LoadPage.js',
    'web_resources/HangarXPLOR.Pager.js',
    'web_resources/HangarXPLOR.ProcessItem.js',
    'web_resources/HangarXPLOR.ProcessPage.js',
    'web_resources/HangarXPLOR.Render.js',
    'web_resources/HangarXPLOR.Search.js',
    'web_resources/HangarXPLOR.SearchBox.js',
    'web_resources/HangarXPLOR.Ships.js',
    'web_resources/HangarXPLOR.Sort.js',
    'web_resources/HangarXPLOR.Templates.js',
    'web_resources/HangarXPLOR.Toggle.js',
    'web_resources/HangarXPLOR.Debug.js', // Uncomment to debug third party hangar HTML
    'web_resources/HangarXPLOR.js'
  ];
  
  var templates = [ ];
  
  for (var i = 0, j = styles.length; i < j; i++) {
    var styleURL = chrome.extension.getURL(styles[i]);
    console.log('Loading', styleURL);
    var style = document.createElement('link');
    style.id = namespace + '-css-' + i;
    style.type = 'text/css';
    style.rel = 'stylesheet';
    style.href = styleURL;
    document.body.appendChild(style);
  }
  
  for (var i = 0, j = scripts.length; i < j; i++) {
    var scriptURL = chrome.extension.getURL(scripts[i]);
    console.log('Loading', scriptURL);
    var script = document.createElement('script');
    script.id = namespace + '-js-' + i;
    script.type = 'text/javascript';
    script.src = scriptURL;
    document.body.appendChild(script);
  }
  
  for (var i = 0, j = templates.length; i < j; i++) {
    var templateURL = chrome.extension.getURL(templates[i].url);
    console.log('Loading', templateURL);
    var script = document.createElement('script');
    script.id = templates[i].id;
    script.type = 'text/x-jsmart-tmpl';
    script.src = templateURL;
    document.body.appendChild(script);
  }

  var browser = chrome || browser;
  browser.storage.local.get({
    showMeltValues: true
  }, function (items) {
    var script = document.createElement("script");
    script.id = "hangarXPLORoptions";
    script.type = "text/javascript";
    script.innerHTML = "var hangarXPLORoptions = " + JSON.stringify(items);
    document.body.appendChild(script);
  });
}();
