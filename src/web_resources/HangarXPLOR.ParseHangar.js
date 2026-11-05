
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR.ParseHangar = function()
{
  // Exact kinds only: "Hangar decoration" items are decorations, not hangars
  var $hangar = $('.kind', this).filter(function() { var kind = $(this).text().trim(); return kind == 'Hangar' || kind.indexOf('RSIItem_kind_HANGARPASS') > -1; }).parent().parent();

  this.filters.is_hangar  = $hangar.length == 1;
  this.filters.has_hangar = $hangar.length >= 1;

  if (this.filters.has_hangar) $('.kind', $hangar).text('Hangar');
}
