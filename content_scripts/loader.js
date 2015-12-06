
!function() {
  var hangarUrl = chrome.extension.getURL('web_resources/hangar.js'); // Causing problems in Firefox
  console.log('Loading', hangarUrl);
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = hangarUrl;
  document.body.appendChild(script);
}();
