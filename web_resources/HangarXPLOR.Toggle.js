
var HangarXPLOR = HangarXPLOR || {};

// Render a toggle that sets the value of an element
HangarXPLOR.Toggle = function(label, value1, value2, className, callback)
{
  console.log('Rendering Toggle', label, value1, value2, className);
  
  var $toggle = $('<div class="status-selector tag-wrapper" />');
  var $tag = $(
    '<div class="tag js-tag">' +
    '  <div class="left"><div class="effect trans-02s trans-opacity"></div></div>' +
    '  <div class="tag-content"><div class="effect trans-02s trans-opacity"></div>' + 
    '    <span class="text">' + label + '</span>' +
    '  </div>' +
    '</div>');
  
  // TODO: Set default value
  var $value = $('<input type="hidden" class="' + className + '" value="" />');
  
  $toggle.append($tag);
  $toggle.append($value);
  
  $toggle.Value1 = value1 || '';
  $toggle.Value2 = value2 || '';
  
  $toggle.bind('click', function(e) {
    if ($value.val() == '')
    {
      $tag.addClass('on');
      $value.val($toggle.Value1);
    } else if ($value.val() == $toggle.Value2 || $toggle.Value2 == '') {
      $tag.removeClass('off');
      $tag.removeClass('on');
      $value.val(null);
    } else {
      $tag.removeClass('on');
      $tag.addClass('off');
      $value.val($toggle.Value2);
    }
    
    if (typeof callback === 'function') callback.call(this, e, $value.val());
  });
  
  return $toggle;
}
