
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR.Filter = function (list, filter) {
  switch (filter) {
    case "HasLTI":
      list = $.grep(list, function (item) { return item.filters.has_lti });
      break;
    case "!HasLTI":
      list = $.grep(list, function (item) { return !item.filters.has_lti });
      break;
    case "IsGiftable":
      list = $.grep(list, function (item) { return item.filters.is_giftable });
      break;
    case "!IsGiftable":
      list = $.grep(list, function (item) { return !item.filters.is_giftable });
      break;
    case "IsShip":
      list = $.grep(list, function (item) { return item.filters.is_ship && !item.filters.is_package });
      break;
    case "HasShip":
      list = $.grep(list, function (item) { return item.filters.has_ship });
      break;
    case "IsNameable":
      list = $.grep(list, function (item) { return item.filters.is_nameable });
      break;
    case "HasNickname":
      list = $.grep(list, function (item) { return item.filters.has_nickname });
      break;
    case "!HasNickname":
      list = $.grep(list, function (item) { return !item.filters.has_nickname });
      break;
    case "IsPackage":
      list = $.grep(list, function (item) { return item.filters.is_package });
      break;
    case "!IsPackage":
      list = $.grep(list, function (item) { return !item.filters.is_package && item.filters.has_ship });
      break;
    case "IsWarbond":
      list = $.grep(list, function (item) { return item.filters.is_warbond && (item.filters.has_ship || item.filters.is_upgrade) });
      break;
    case "!IsWarbond":
      list = $.grep(list, function (item) { return !item.filters.is_warbond && (item.filters.has_ship || item.filters.is_upgrade) });
      break;
    case "IsCombo":
      list = $.grep(list, function (item) { return item.filters.is_combo });
      break;
    case "IsUpgraded":
      list = $.grep(list, function (item) { return item.filters.is_upgraded });
      break;
    case "!IsUpgraded":
      list = $.grep(list, function (item) { return !item.filters.is_upgraded });
      break;
    case "IsUpgrade":
      list = $.grep(list, function (item) { return item.filters.is_upgrade });
      break;
    case "HasValue":
      list = $.grep(list, function (item) { return item.filters.has_value });
      break;
    case "!HasValue":
      list = $.grep(list, function (item) { return !item.filters.has_value });
      break;
    case "IsMeltable":
      list = $.grep(list, function (item) { return item.filters.is_meltable });
      break;
    case "!IsMeltable":
      list = $.grep(list, function (item) { return !item.filters.is_meltable });
      break;
    case "IsSelected":
      list = $.grep(list, function (item) { return item.filters.is_selected });
      break;

    case "IsDecoration":
      list = $.grep(list, function (item) { return item.filters.is_decoration });
      break;
    case "IsComponent":
      list = $.grep(list, function (item) { return item.filters.is_component });
      break;
    case "IsSkin":
      list = $.grep(list, function (item) { return item.filters.has_skin && !item.filters.has_ship });
      break;
    case "IsEquipment":
      list = $.grep(list, function (item) { return item.filters.is_equipment });
      break;

    case "IsReward":
      list = $.grep(list, function (item) { return item.filters.is_reward });
      break;
    case "!IsReward":
      list = $.grep(list, function (item) { return !item.filters.is_reward });
      break;
    case "IsFreeCCU":
      list = $.grep(list, function (item) { return item.filters.is_upgrade && !item.filters.has_value });
      break;
    case "!IsFreeCCU":
      list = $.grep(list, function (item) { return !item.filters.is_upgrade || item.filters.has_value });
      break;
    case "IsModel":
      list = $.grep(list, function (item) { return item.filters.isModel });
      break;
    case "IsPoster":
      list = $.grep(list, function (item) { return item.filters.isPoster });
      break;
    case "IsPlant":
      list = $.grep(list, function (item) { return item.filters.isSpacePlant });
      break;
    case "IsAddOn":
      list = $.grep(list, function (item) { return item.filters.isAddOn });
      break;
    case "IsExtra":
      list = $.grep(list, function (item) { return item.filters.isAddOn || item.filters.isUpgrade });
      break;
    case "IsFlair":
      list = $.grep(list, function (item) { return item.filters.isFlair });
      break;
  }

  return list;
}