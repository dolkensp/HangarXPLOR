
var HangarXPLOR = HangarXPLOR || {};

// Search a list, based on the specified search term
HangarXPLOR.Search = function(list, term)
{

  if(term.trim().length === 0) return list;

  var _modified = [];

  list.forEach(function(e) {
     if(e.displayName.toLowerCase().indexOf(term.toLowerCase()) > -1) {
         _modified.push(e);
     }
  });

  return _modified;
}
