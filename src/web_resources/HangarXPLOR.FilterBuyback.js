
var HangarXPLOR = HangarXPLOR || {};

/**
 * Filters buyback inventory based on filter type
 * @param {Array} list - Array of buyback pledge items to filter
 * @param {string} filterType - The filter type to apply
 * @returns {Array} Filtered array of buyback pledge items
 */
HangarXPLOR.FilterBuyback = function(list, filterType) {
  switch(filterType) {
    // Type filters
    case 'All':
    case '':
      return list;

    case 'Ships':
      return $.grep(list, function(item) { return item.filters.is_ship; });

    case 'Paints':
      return $.grep(list, function(item) { return item.filters.is_paint; });

    case 'AddOns':
      return $.grep(list, function(item) { return item.filters.is_addon; });

    case 'Upgrades':
      return $.grep(list, function(item) { return item.filters.is_upgrade; });

    case 'Packages':
      return $.grep(list, function(item) { return item.filters.is_package; });

    case 'Subscriber':
      return $.grep(list, function(item) { return item.filters.is_subscriber || item.filters.is_flair; });

    case 'Components':
      return $.grep(list, function(item) { return item.filters.is_component; });

    case 'Weapons':
      return $.grep(list, function(item) { return item.filters.is_weapon; });

    case 'Decorations':
      return $.grep(list, function(item) { return item.filters.is_hangar_decoration; });

    case 'Other':
      return $.grep(list, function(item) {
        return !item.filters.is_ship &&
               !item.filters.is_paint &&
               !item.filters.is_addon &&
               !item.filters.is_upgrade &&
               !item.filters.is_package &&
               !item.filters.is_component &&
               !item.filters.is_weapon &&
               !item.filters.is_hangar_decoration &&
               !item.filters.is_subscriber &&
               !item.filters.is_flair;
      });

    default:
      return list;
  }
};

/**
 * Sorts buyback inventory
 * @param {Array} list - Array of buyback pledge items to sort
 * @param {string} sortType - The sort type to apply
 * @returns {Array} Sorted array of buyback pledge items
 */
HangarXPLOR.SortBuyback = function(list, sortType) {
  var sorted = list.slice(); // Copy array

  switch(sortType) {
    case 'Name':
      sorted.sort(function(a, b) {
        return a.sortName.localeCompare(b.sortName);
      });
      break;

    case 'NameDesc':
      sorted.sort(function(a, b) {
        return b.sortName.localeCompare(a.sortName);
      });
      break;

    case 'Type':
      sorted.sort(function(a, b) {
        return a.buyback_type.localeCompare(b.buyback_type) || a.sortName.localeCompare(b.sortName);
      });
      break;

    case 'Modified':
      sorted.sort(function(a, b) {
        // Parse dates for comparison (format: "December 02, 2025")
        var dateA = new Date(a.last_modified);
        var dateB = new Date(b.last_modified);
        return dateB - dateA; // Most recent first
      });
      break;

    case 'PledgeId':
      sorted.sort(function(a, b) {
        return b.pledge_id - a.pledge_id; // Highest ID first (most recent purchases)
      });
      break;

    default:
      // Default: most recent pledge ID first
      sorted.sort(function(a, b) {
        return b.pledge_id - a.pledge_id;
      });
  }

  return sorted;
};
