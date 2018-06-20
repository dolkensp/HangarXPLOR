
var HangarXPLOR = HangarXPLOR || {};

// Sort a list, based on the defined sort order
HangarXPLOR.Sort = function(list, sort)
{
  switch (sort) {
    case "Purchased": return list.sort(function(a, b) { return a.pledgeId > b.pledgeId ? -1 : 1 });
    case "Value":     return list.sort(function(a, b) { return a.meltValue > b.meltValue ? -1 : 1; });
    case "Name":      return list.sort(function(a, b) { return a.displayName < b.displayName ? -1 : 1; });
    case "Score":     return list.sort(function(a, b) { return a.similarityScore < b.similarityScore ? -1 : 1; });
  }
  
  return list;
}
