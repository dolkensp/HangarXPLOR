
var HangarXPLOR = HangarXPLOR || {};

// Sort a list, based on the defined sort order
HangarXPLOR.Sort = function(list, sort)
{
  switch (sort) {
    case "Purchased": return list.sort(function(a, b) {
      return a.pledgeId > b.pledgeId ? -1 : a.pledgeId < b.pledgeId ? 1 : 0;
    });
    case "Value":     return list.sort(function(a, b) {
      return a.meltValue > b.meltValue ? -1 : a.meltValue < b.meltValue ? 1 : 0;
    });
    case "Name":      return list.sort(function(a, b) {
      return a.displayName < b.displayName ? -1 : a.displayName > b.displayName ? 1 : 0;
    });
    case "Score":     return list.sort(function(a, b) {
      return a.similarityScore < b.similarityScore ? -1 : a.similarityScore > b.similarityScore ? 1 : 0;
    });
  }
  
  return list;
}
