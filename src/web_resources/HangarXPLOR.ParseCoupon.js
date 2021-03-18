
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR.ParseCoupon = function(pledgeName)
{
  this.filters.is_coupon = pledgeName.indexOf('coupon') > -1;
}
