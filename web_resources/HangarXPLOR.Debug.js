
if ($.cookie('logsEnabled') == "true") {
  var HangarXPLOR = HangarXPLOR || {};
  HangarXPLOR.logsEnabled = true;
}

if ($.cookie('debug') == "true") {
  var HangarXPLOR = HangarXPLOR || {};

  // Load a page of pledges from RSI
  HangarXPLOR.LoadPage = function(pageNo)
  {
    var url = HangarXPLOR._debugRoot + 'debug/hangar-' + pageNo + '.html';
    
    if (HangarXPLOR.logsEnabled) {
      console.log('Loading', url);
    }
    
    $.ajax({ url, method: 'GET', 
      success: function(html) { HangarXPLOR.ProcessPage(html, pageNo) }, 
      error: function() { HangarXPLOR.DrawUI() }
    });
  }

  // Pre-process all the items in a document, then load the next page, or render the UI
  HangarXPLOR.ProcessPage = function(html, pageNo)
  {
    var $page = $(html);
    var $lists = $('.list-items', $page);

    // Check to see if we have 2 lists - The Hangar, and the Inventory
    if ($lists.length == 2)
    {
      var $items = $('li', $lists[1]);
        
      $items.each(HangarXPLOR.ProcessItem);
      HangarXPLOR.LoadPage(pageNo + 1);
      
    } else {
      HangarXPLOR.DrawUI();
    }
  }
}