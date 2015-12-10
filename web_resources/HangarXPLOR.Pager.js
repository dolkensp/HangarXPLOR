
var HangarXPLOR = HangarXPLOR || {};

// Render a toggle that sets the value of an element
HangarXPLOR.Pager = function(className, callback)
{
  className = className || '';
  
  console.log('Rendering Pagination', HangarXPLOR._totalRecords, HangarXPLOR._pageNo, HangarXPLOR._pageCount, className);
  
  var $control = $('<div class="options-selector pager-wrapper' + className + '" />');
  var $pager = $('<div class="pager clearfix js-pager" />');
  var $left = $('<div class="left" />');
  var $right = $('<div class="right" />');
  var maxButtons = 5;
  
  $control.append($pager);
  $pager.append($left, $right);
  
  HangarXPLOR.RefreshPager = function() {
  
    var maxPages = Math.ceil(HangarXPLOR._totalRecords / HangarXPLOR._pageCount);
    var firstPage = Math.max(1, Math.min(maxPages - maxButtons, HangarXPLOR._pageNo - Math.floor(maxButtons / 2)));
    if (HangarXPLOR._pageNo == maxPages) firstPage = Math.max(1, maxPages - Math.floor(maxButtons / 2));
    
    $right.empty();
    
    for (var i = firstPage, j = Math.min(firstPage + maxButtons - 1, maxPages); i <= j; i++)
      $right.append('<a class="trans-02s trans-color' + ((i == HangarXPLOR._pageNo) ? ' active' : '') + '" rel="' + i + '">' + i + '</a>');
    var $buttons = $('a', $right);
    
    $buttons.bind('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      var $this = $(this);
      
      var newPage = $this.attr('rel');
      
      if (newPage != HangarXPLOR._pageNo) {
        HangarXPLOR._pageNo = newPage;
        
        if (typeof callback === 'function') callback.call(this, e, HangarXPLOR._pageNo);
        
        HangarXPLOR.RefreshPager();
      }
    });
    
  };
  
  HangarXPLOR.RefreshPager();
  
  $left.append(HangarXPLOR.Dropdown([
    { Value: '10', Text: '10 per page', Class: 'selected' },
    { Value: '20', Text: '20 per page' },
    { Value: '50', Text: '50 per page' },
    { Value: '100', Text: '100 per page' },
  ], '140px', 'js-custom-pager', function(e, pageCount) {
    HangarXPLOR._pageNo = 1;
    HangarXPLOR._pageCount = pageCount;
    
    HangarXPLOR.RefreshPager();
    
    if (typeof callback === 'function') callback.call(this, e, HangarXPLOR._pageNo);
  }));
  
  return $control;
}
