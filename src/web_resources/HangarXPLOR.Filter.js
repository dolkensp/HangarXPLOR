
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR.Filter = function(list, filter)
{
  switch (filter) {
    case "HasLTI":
      list = $.grep(list, function(item) { return item.hasLTI; });
      break;
    case "!HasLTI":
      list = $.grep(list, function(item) { return !item.hasLTI; });
      break;
    case "IsGiftable":
      list = $.grep(list, function(item) { return item.isGiftable; });
      break;
    case "!IsGiftable":
      list = $.grep(list, function(item) { return !item.isGiftable; });
      break;
    case "IsShip":
      list = $.grep(list, function(item) { return item.isShip && !item.isPackage; });
      break;
    case "HasShip":
      list = $.grep(list, function(item) { return item.hasShip; });
      break;
    case "IsUpgradeOrHasShip":
      list = $.grep(list, function(item) { return item.hasShip || item.isUpgrade; });
      break;      
    case "IsPackage":
      list = $.grep(list, function(item) { return item.isPackage; });
      break;
    case "!IsPackage":
      list = $.grep(list, function(item) { return !item.isPackage && item.hasShip; });
      break;
    case "IsWarbond":
      list = $.grep(list, function(item) { return item.isWarbond && item.hasShip; });
      break;
    case "!IsWarbond":
      list = $.grep(list, function(item) { return !item.isWarbond && item.hasShip; });
      break;
    case "IsCombo":
      list = $.grep(list, function(item) { return item.isCombo; });
      break;
    case "IsUpgrade":
      list = $.grep(list, function(item) { return item.isUpgrade; });
      break;
    case "IsUpgraded":
      list = $.grep(list, function(item) { return item.isUpgraded; });
      break;
    case "!IsUpgraded":
      list = $.grep(list, function(item) { return !item.isUpgraded; });
      break;
    case "IsAddOn":
      list = $.grep(list, function(item) { return item.isAddOn; });
      break;
    case "IsPaint":
      list = $.grep(list, function(item) { return item.isPaint; });
      break;
    case "IsExtra":
      list = $.grep(list, function(item) { return item.isAddOn || item.isUpgrade; });
      break;
    case "IsFlair":
      list = $.grep(list, function(item) { return item.isFlair; });
      break;
    case "HasValue":
      list = $.grep(list, function(item) { return item.hasValue; });
      break;
    case "!HasValue":
      list = $.grep(list, function(item) { return !item.hasValue; });
      break;
    case "IsMeltable":
      list = $.grep(list, function(item) { return item.isMeltable; });
      break;
    case "!IsMeltable":
      list = $.grep(list, function(item) { return !item.isMeltable; });
      break;
    case "IsModel":
      list = $.grep(list, function(item) { return item.isModel; });
      break;
    case "IsPoster":
      list = $.grep(list, function(item) { return item.isPoster; });
      break;
    case "IsPlant":
      list = $.grep(list, function(item) { return item.isSpacePlant; });
      break;
    case "IsDecoration":
      list = $.grep(list, function(item) { return item.isDecoration; });
      break;
    case "IsComponent":
      list = $.grep(list, function(item) { return item.isComponent; });
      break;
    case "IsReward":
      list = $.grep(list, function(item) { return item.isReward; });
      break;
    case "!IsReward":
      list = $.grep(list, function(item) { return !item.isReward; });
      break;
    case "IsSelected":
      list = $.grep(list, function(item) { return item.isSelected; });
      break;
    case "IsFreeCCU":
      list = $.grep(list, function(item) { return item.isUpgrade && !item.hasValue; });
      break;
    case "!IsFreeCCU":
      list = $.grep(list, function(item) { return !item.isUpgrade || item.hasValue; });
      break;
  }
  
  return list;
}
