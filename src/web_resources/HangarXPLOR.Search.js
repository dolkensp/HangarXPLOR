
var HangarXPLOR = HangarXPLOR || {};
HangarXPLOR._searchTerm = HangarXPLOR._searchTerm || '';
HangarXPLOR._suggestion = HangarXPLOR._suggestion || '';

// Search a list, based on the specified search term
HangarXPLOR.Search = function(list, term)
{
  HangarXPLOR._searchTerm = term;
  
  if(term.trim().length < 2 || list.length === 0) {
    HangarXPLOR._suggestion = '';
    return list;
  }
  
  var fuse = new Fuse(list, {
    tokenize: true,
    matchAllTokens: true,
    includeScore: true,
    threshold: 0.3,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 3,
    keys: [ "sortName", "shipName", "originalName" ]});
  
  var modified = fuse.search(term);
  
  modified = modified.map(function(e) { e.item.similarityScore = e.score; return e.item; });
  
  if (modified.length > 0) HangarXPLOR._suggestion = modified[0].sortName;
  
  return modified;
}

HangarXPLOR.SearchSuggestion = function(list, term) {
  return term + HangarXPLOR._suggestion.substr(HangarXPLOR._suggestion.toLowerCase().indexOf(term.toLowerCase()) + term.length);
}
