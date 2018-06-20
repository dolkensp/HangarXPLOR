
var HangarXPLOR = HangarXPLOR || {};

// Render a button that calls a callback
HangarXPLOR.Button = function(label, className, callback)
{
  HangarXPLOR.Log('Rendering Button', label, className);
  
  className = className || 'js-custom-button';
  
  var $button = 
    $('<a>', { class: 'shadow-button trans-02s trans-color ' + className }).append(
      $('<span>', { class: 'label js-label trans-02s', text: label }),
      $('<span>', { class: 'icon trans-02s' }).append(
        $('span', { class: 'effect trans-opacity trans-03s' })),
      $('<span>', { class: 'left-section' }),
      $('<span>', { class: 'right-section' })
    );
  
  $button.bind('click.HangarXPLOR', function(e)
  {
    e.preventDefault();
    e.stopPropagation();
    if (typeof callback === 'function') callback.call(this, e);
    else HangarXPLOR.Log('Error With Callback', callback);
  });
  
  return $button;
}
