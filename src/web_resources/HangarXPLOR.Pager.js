
var HangarXPLOR = HangarXPLOR || {};
HangarXPLOR._callbacks = HangarXPLOR._callbacks || {};
HangarXPLOR._callbacks.Pager = [];

HangarXPLOR.RefreshPager = function() {
  for (var i = 0, j = HangarXPLOR._callbacks.Pager.length; i < j; i++)
    HangarXPLOR._callbacks.Pager[i]();
}

// Render a toggle that sets the value of an element
HangarXPLOR.Pager = function(options, width, className, callback)
{
  width = width || '150px';
  className = className || 'js-custom-pager';
  
  HangarXPLOR.Log('Rendering Pagination', HangarXPLOR._totalRecords, HangarXPLOR._pageNo, HangarXPLOR._pageCount, className);
  
  var $control = $('<div>', { class: 'options-selector pager-wrapper ' + className });
  var $pager = $('<div>', { class: 'pager clearfix js-pager' });
  var $left = $('<div>', { class: 'left' });
  var $right = $('<div>', { class: 'right' });
  var maxButtons = 5;
  
  $control.append($pager);
  $pager.append($left, $right);
  
  HangarXPLOR._callbacks.Pager.push(function() {
    
    for (var i = 0, j = options.length; i < j; i++)
    {
      options[i].Selected = HangarXPLOR._pageCount == options[i].Value;
      options[i].Class = '';
    }
    
    var maxPages = Math.ceil(HangarXPLOR._totalRecords / HangarXPLOR._pageCount);
    if (HangarXPLOR._pageNo > maxPages) HangarXPLOR._pageNo = maxPages;
    
    var firstPage = Math.max(1, HangarXPLOR._pageNo - Math.floor(maxButtons / 2));
    if (firstPage > maxPages - maxButtons) firstPage = Math.max(1, maxPages - maxButtons + 1);
    
    $left.empty();
    $right.empty();
    
    $left.append(HangarXPLOR.Dropdown(options, width, className, function(e, pageCount) {
      HangarXPLOR._pageNo = 1;
      HangarXPLOR._pageCount = pageCount;
      
      if (typeof callback === 'function') callback.call(this, e, HangarXPLOR._pageNo);
      
      HangarXPLOR.SaveSettings();
      HangarXPLOR.RefreshPager();
    }));
    
    if (maxPages == 1) {
      $left.addClass('mr5');
      return;
    } else {
      $left.removeClass('mr5');
    }
    
    for (i = firstPage, j = Math.min(firstPage + maxButtons - 1, maxPages); i <= j; i++)
      $right.append($('<a>', { class: 'trans-02s trans-color' + ((i == HangarXPLOR._pageNo) ? ' active' : ''), rel: i, text: i }));
    var $buttons = $('a', $right);
    
    $buttons.bind('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      var $this = $(this);
      
      var newPage = $this.attr('rel');
      
      if (newPage != HangarXPLOR._pageNo) {
        HangarXPLOR._pageNo = newPage;
        
        if (typeof callback === 'function') callback.call(this, e, HangarXPLOR._pageNo);
        
        HangarXPLOR.SaveSettings();
        HangarXPLOR.RefreshPager();
      }
    });
  });
  
  HangarXPLOR.RefreshPager();
  
  return $control;
}
