
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR.ParseSkin = function()
{
  // Fix Best in Show Livery - Christmas 2019
  // Skip titles already labelled Skin (InferKinds labels kind-less liveries), so the label isn't shown twice
  $('.title:contains(Livery Upgrade)', this)
    .not(function() { return $(this).siblings('.kind:contains(Skin)').length > 0; })
    .after('<div class="kind">Skin</div>');
  
  var $skin = $('.kind:contains(Skin)', this).parent().parent();

  this.filters.is_skin  = $skin.length == 1;
  this.filters.has_skin = $skin.length >= 1;
}
