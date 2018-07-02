
var HangarXPLOR = HangarXPLOR || {};

// Render a dropdown that sets the value of an element
HangarXPLOR.Dropdown = function(options, width, className, callback)
{
  HangarXPLOR.Log('Rendering Dropdown', options);
  
  className = className || 'js-custom-filter';
  width = width || '150px';
  
  var $ul = $('<ul>', { class: 'body', style: 'display: none' });
  var $style = $('<div>', { class: 'js-selectlist selectlist' });
  var $label = $('<span>', { text: options[0].Text });
  var $value = $('<input>', { type: 'hidden', class: className, value: options[0].Value });
  var $dropdown = $('<div>', { style: 'width: ' + width });
  
  for (var i = 0, j = options.length; i < j; i++) {
    if (options[i].Selected) {
      $label.text(options[i].Text);
      $value.val(options[i].Value);
      options[i].Class = options[i].Class + ' selected';
    }
    $ul.append($('<li>', { class: 'js-option option ' + (options[i].Class || ''), rel: options[i].Value, text: options[i].Text }));
  }
  var $options = $('li', $ul);
  
  $dropdown.append($style);
  $style.append($('<div>', { class: 'arrow' }));
  $style.append($label);
  $style.append($ul);
  $style.append($value);
  
  $options.bind('mouseover', function() { $(this).addClass('hover'); });
  $options.bind('mouseout', function() { $(this).removeClass('hover'); });
  
  $dropdown.bind('click', function() { $ul.toggle(); });
  $options.bind('click', function(e) {
    var $this = $(this);
    
    $options.removeClass('selected');
    $options.removeClass('hover');
    $this.addClass('selected');
    
    $('ul.body').hide();
    
    var newValue = $this.attr('rel');
    if ($value.val() != newValue) {
      $value.val(newValue);
      $label.text($this.text());
      if (typeof callback === 'function') callback.call(this, e, newValue);
    }
    
    return false;
  });
  
  $dropdown.val = function(value) {
    // TODO: Update selected
    
    return $value.val(value);
  }
  
  return $dropdown;
}
