
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR.ParseHangar = function()
{
  var $hangar = $('.kind:contains(RSIItem_kind_HANGARPASS), .kind:contains(Hangar)', this).parent().parent();

  this.filters.is_hangar  = $hangar.length == 1;
  this.filters.has_hangar = $hangar.length >= 1;

  if (this.filters.has_hangar) $('.kind', $hangar).text('Hangar');
}
