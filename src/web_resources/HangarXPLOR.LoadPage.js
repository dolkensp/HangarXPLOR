
var HangarXPLOR = HangarXPLOR || {};

// Load a page of pledges from RSI
HangarXPLOR.LoadPage = function(pageNo)
{
  pageNo = pageNo || 1;
  
  HangarXPLOR.UpdateStatus(pageNo);
  
  var url = '/account/pledges?page=' + pageNo;
  
  if(pageNo == 1) {
    // TODO should this be place somewhere else? - it just needs to be done before we process the items
    // so that we have the billing data already in order to link to it  
    HangarXPLOR.Billing.LoadData();

    if(document.location.search == '?page=1') {
      return HangarXPLOR.ProcessPage(document.body, pageNo);
    }
  }

  HangarXPLOR.Log('Loading', url);
  
  var $page = $('<div>');
  
  $page.load(url + ' .page-wrapper', function(response, status) { if (status == "success") { HangarXPLOR.ProcessPage(this, pageNo) } else { HangarXPLOR.Log('Error loading page ' + pageNo + ' of your hangar - please contact plugins@ddrit.com for further support') } });
}