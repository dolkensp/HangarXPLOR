
var HangarXPLOR = HangarXPLOR || {};

// Load a page of pledges from RSI
HangarXPLOR.LoadPage = function(pageNo)
{
  var url = '/account/pledges?page=' + pageNo + '&pagesize=100';
  
  if (pageNo == 1)
  {
    var currentPage = $('.js-pager .selected').attr('rel');
    if (currentPage == '/account/pledges?page=1&pagesize=100')
      return HangarXPLOR.ProcessPage(document.body, pageNo);
  }
  
  console.log('Loading', url);
  
  $.ajax({ url, method: 'GET', success: function(html) { HangarXPLOR.ProcessPage(html, pageNo) } });
}
