
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR._throttleAfterPage = 50;   // start throttling after this page number
HangarXPLOR._throttleDelay     = 500;  // ms to wait between pages once throttling kicks in
HangarXPLOR._retryDelay        = 5000; // ms for first retry after a 429; multiplied by attempt number
HangarXPLOR._maxRetries        = 5;

// Load a page of pledges from RSI
HangarXPLOR.LoadPage = function(pageNo, retryCount)
{
  pageNo     = pageNo     || 1;
  retryCount = retryCount || 0;

  HangarXPLOR.UpdateStatus(pageNo);

  var url = '/account/pledges?page=' + pageNo;

  if (pageNo == 1 && document.location.search == '?page=1')
      return HangarXPLOR.ProcessPage(document.body, pageNo);

  HangarXPLOR.Log('Loading', url);

  var doLoad = function() {
    $.ajax({
      url: url,
      method: 'GET',
      dataType: 'html',
      success: function(data) {
        var $tmp  = $('<div>').html(data);
        var page  = $tmp.find('.page-wrapper')[0] || $tmp[0];
        HangarXPLOR.ProcessPage(page, pageNo);
      },
      error: function(xhr) {
        if (xhr.status === 429 && retryCount < HangarXPLOR._maxRetries) {
          var delay = HangarXPLOR._retryDelay * (retryCount + 1);
          HangarXPLOR.Log('Rate limited on page ' + pageNo + ', retrying in ' + (delay / 1000) + 's (attempt ' + (retryCount + 1) + '/' + HangarXPLOR._maxRetries + ')');
          HangarXPLOR.UpdateStatus(pageNo, 'rate-limited', retryCount + 1, delay / 1000);
          setTimeout(function() { HangarXPLOR.LoadPage(pageNo, retryCount + 1); }, delay);
        } else {
          HangarXPLOR.Log('Error loading page ' + pageNo + ' of your hangar - please contact plugins@ddrit.com for further support');
          HangarXPLOR.UpdateStatus(pageNo, 'error');
        }
      }
    });
  };

  if (pageNo > HangarXPLOR._throttleAfterPage) {
    setTimeout(doLoad, HangarXPLOR._throttleDelay);
  } else {
    doLoad();
  }
}
