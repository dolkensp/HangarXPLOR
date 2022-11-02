
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR.ParseSkin = function()
{
  // Fix Best in Show Livery - Christmas 2019
  $('.title:contains(Livery Upgrade)', this).after('<div class="kind">Skin</div>');
  
  var $skin = $('.kind:contains(Skin)', this).parent().parent();

  this.filters.is_skin  = $skin.length == 1;
  this.filters.has_skin = $skin.length >= 1;
}
