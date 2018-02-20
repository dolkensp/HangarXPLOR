
!function() {
  var namespace = 'HangarXPLOR';
  
  var styles = [
    'web_resources/HangarXPLOR.css'
  ];
  
  var scripts = [
    'web_resources/HangarXPLOR.js',
    'web_resources/HangarXPLOR.Debug.js', // Uncomment to debug third party hangar HTML
    'web_resources/HangarXPLOR.Download.js',
    'web_resources/HangarXPLOR.Toggle.js',
    'web_resources/HangarXPLOR.Templates.js',
    'web_resources/HangarXPLOR.Sort.js',
    'web_resources/HangarXPLOR.Ships.js',
    'web_resources/HangarXPLOR.SearchBox.js',
    'web_resources/HangarXPLOR.Search.js',
    'web_resources/HangarXPLOR.Render.js',
    'web_resources/HangarXPLOR.ProcessPage.js',
    'web_resources/HangarXPLOR.ProcessItem.js',
    'web_resources/HangarXPLOR.Pager.js',
    'web_resources/HangarXPLOR.LoadPage.js',
    'web_resources/HangarXPLOR.Filter.js',
    'web_resources/HangarXPLOR.Dropdown.js',
    'web_resources/HangarXPLOR.DrawUI.js',
    'web_resources/HangarXPLOR.Components.js',
    'web_resources/HangarXPLOR.Button.js',
    'web_resources/HangarXPLOR.BulkUI.js'
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
  
  for (var i = 0, j = templates.length; i < j; i++) {
    var templateURL = chrome.extension.getURL(templates[i].url);
    console.log('Loading', templateURL);
    var script = document.createElement('script');
    script.id = templates[i].id;
    script.type = 'text/x-jsmart-tmpl';
    script.src = templateURL;
    document.body.appendChild(script);
  }
  
  var i = 1;
  
  var loadScript = function() {
    if (scripts.length == 0) return;
    
    var scriptURL = chrome.extension.getURL(scripts.pop());
    console.log('Loading', scriptURL);
    var script = document.createElement('script');
    script.id = namespace + '-js-' + i++;
    script.type = 'text/javascript';
    script.src = scriptURL;
    
    script.onload = loadScript;
    script.onreadystatechange = function() {
      if (this.readyState == 'complete') loadScript();
    }

    document.body.appendChild(script);
  };
  
  loadScript();
  
}()
