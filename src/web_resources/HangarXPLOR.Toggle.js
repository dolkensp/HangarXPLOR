
var HangarXPLOR = HangarXPLOR || {};

// Render a toggle that sets the value of an element
HangarXPLOR.Toggle = function(label, value1, value2, className, callback, defaultValue)
{
  HangarXPLOR.Log('Rendering Toggle', label, value1, value2, className);
  
  var $toggle = $('<div>', { class: 'status-selector tag-wrapper' });
  var $tag = 
    $('<div>', { class: 'tag js-tag' }).append(
      $('<div>', { class: 'left' }).append(
        $('<div>', { class: 'effect trans-02s trans-opacity' })),
      $('<div>', { class: 'tag-content' }).append(
        $('<div>', { class: 'effect trans-02s trans-opacity' }),
        $('<span>', { class: 'text', text: label })
      )
    );
    
  defaultValue = defaultValue || '';
  
  // TODO: Set default value
  var $value = $('<input>', { type: 'hidden', class: className, value: defaultValue });
  
  $toggle.append($tag);
  $toggle.append($value);
  
  $toggle.Value1 = value1 || '';
  $toggle.Value2 = value2 || '';
  
  var getState = function() {
    if ($value.val() == '')
      return null;
    else if ($value.val() == $toggle.Value2)
      return false;
    else
      return true;
  }
  
  var updateState = function() {
    var state = getState();
    
    $tag.removeClass('off');
    $tag.removeClass('on');

    switch (state)
    {
      case true: $tag.addClass('on'); break;
      case false: $tag.addClass('off'); break;
    }
  };
  
  updateState();
  
  $toggle.bind('click', function(e) {
  
    var state = getState();
    
    switch (state)
    {
      case null:  $value.val($toggle.Value1); break;
      case true:  $value.val($toggle.Value2); break;
      case false: $value.val(null); break;
    }
    
    updateState();
    
    if (typeof callback === 'function') callback.call(this, e, label, $value.val());
  });
  
  return $toggle;
}
