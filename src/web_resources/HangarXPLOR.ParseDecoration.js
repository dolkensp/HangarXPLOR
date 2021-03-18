
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR.ParseDecoration = function()
{
  var $decoration = $('.kind:contains(Hangar decoration)', this).parent().parent();

  this.filters.is_decoration  = $decoration.length == 1;
  this.filters.has_decoration = $decoration.length >= 1;
}
