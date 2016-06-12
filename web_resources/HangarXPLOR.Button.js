
var HangarXPLOR = HangarXPLOR || {};

// Render a button that calls a callback
HangarXPLOR.Button = function(label, className, callback)
{
  if (HangarXPLOR.logsEnabled) {
    console.log('Rendering Button', label, className);
  }
  
  className = className || 'js-custom-button';
  
  var $button = $('<a class="shadow-button trans-02s trans-color ' + className + '"><span class="label js-label trans-02s">' + label + '</span><span class="icon trans-02s"><span class="effect trans-opacity trans-03s"></span></span><span class="left-section"></span><span class="right-section"></span></a>');
  
  $button.bind('click.HangarXPLOR', function(e)
  {
    e.preventDefault();
    e.stopPropagation();
    if (typeof callback === 'function') callback.call(this, e);
  });
  
  return $button;
}
