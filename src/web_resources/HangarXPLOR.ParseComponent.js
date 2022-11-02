
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR.ParseComponent = function()
{
  var $component = $('.kind:contains(Component)', this).parent().parent();

  this.filters.is_component  = $component.length == 1;
  this.filters.has_component = $component.length >= 1;

  if (this.filters.is_component)
  {
    this.component_name      = this.pledge_name
                              .replace(/ (- )?lti/i, '')
                              .replace(/ (- )?warbond edition/i, '')
                              .replace(/ (- )?warbond/i, '')
                              .replace(/ (- )?war bond/i, '')
                              .replace(/ promo wb/i, '');
    
    if (!this.filters.has_ship) {
      for (var i = 0, j = HangarXPLOR._componentMatrix.length; i < j; i++) {
        if (this.component_name.toLowerCase().indexOf(HangarXPLOR._componentMatrix[i].name.toLowerCase()) > -1) {
          $('.basic-infos .image', this).css({ 'background-image': 'url("' + HangarXPLOR._componentMatrix[i].thumbnail + '")'});
          break;
        }
      }
    }
  }
}
