
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR.ParseReward = function(pledgeName)
{
  this.filters.is_reward = pledgeName.indexOf('reward') > -1;
}
