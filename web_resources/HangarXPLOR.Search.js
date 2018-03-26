
var HangarXPLOR = HangarXPLOR || {};

//@Source https://gist.github.com/doorhammer/9957864
HangarXPLOR.similarity = function(sa1, sa2){
    var s1 = sa1.replace(/\s/g, "").toLowerCase();
    var s2 = sa2.replace(/\s/g, "").toLowerCase();

    function intersect(arr1, arr2) {
        var r = [], o = {}, l = arr2.length, i, v;
        for (i = 0; i < l; i++) {
            o[arr2[i]] = true;
        }
        l = arr1.length;
        for (i = 0; i < l; i++) {
            v = arr1[i];
            if (v in o) {
                r.push(v);
            }
        }
        return r;
    }

    var pairs = function(s){
        var pairs = [];
        for(var i = 0; i < s.length - 1; i++){
            pairs[i] = s.slice(i, i+2);
        }
        return pairs;
    }

    var similarity_num = 2 * intersect(pairs(s1), pairs(s2)).length;
    var similarity_den = pairs(s1).length + pairs(s2).length;
    var similarity = similarity_num / similarity_den;

    return similarity;
};
//@End-Source

// Search a list, based on the specified search term
HangarXPLOR.Search = function(list, term)
{

  if(term.trim().length === 0 || list.length === 0) return list;

  var _modified = [];
  var maxSimilarity = 0;

  //--- Calculate similarity score for all entities
  list.forEach(function(e) {
      const itemName = (e.shipName || e.displayName).toLowerCase();
      e.similarityScore = HangarXPLOR.similarity(term.toLowerCase(), itemName);
      maxSimilarity = Math.max(e.similarityScore, maxSimilarity);
  });

  //--- Normalize similarity score
  list.forEach(function(e) {
     e.similarityScore = e.similarityScore / maxSimilarity;
     if(e.similarityScore >= HangarXPLOR._similarityThreshold) {
         _modified.push(e);
     }
  });

  //--- Sort entities; similarity score highest -> lowest
  _modified.sort(function(a,b) {
      if(a.similarityScore < b.similarityScore) return 1;
      else if(a.similarityScore > b.similarityScore) return -1;
      else return 0;
  });

  return _modified;
}

HangarXPLOR.SearchSuggestion = function(list, term, elementClass) {

    var suggestion = "";

    if(term.trim().length > 0) {
        var similarityScore = 0;

        list.forEach(function(e) {
            const itemName = (e.shipName || e.displayName).toLowerCase();
            var _t = HangarXPLOR.similarity(term.toLowerCase(), itemName);

            if(_t > similarityScore) {
                similarityScore = _t;
                suggestion = e.displayName;
            }
        });
    }

    $(elementClass).val(suggestion.substr(suggestion.toLowerCase().indexOf(term.toLowerCase())));
    return suggestion;

}
