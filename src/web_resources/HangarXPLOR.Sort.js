
var HangarXPLOR = HangarXPLOR || {};

// Sort a list, based on the defined sort order
HangarXPLOR.Sort = function(list, sort)
{
  switch (sort) {
    case "Purchased": return list.sort(function(a, b) { return a.pledge_id > b.pledge_id ? -1 : 1 });
    case "Value":     return list.sort(function(a, b) { return a.melt_value > b.melt_value ? -1 : 1; });
    case "Name":      return list.sort(function(a, b) { return a.displayName < b.displayName ? -1 : 1; });
    case "Score":     return list.sort(function(a, b) { return a.similarityScore < b.similarityScore ? -1 : 1; });
  }
  
  return list;
}
