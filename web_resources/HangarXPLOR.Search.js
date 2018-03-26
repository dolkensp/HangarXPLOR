
var HangarXPLOR = HangarXPLOR || {};

//@Source https://stackoverflow.com/a/36566052
HangarXPLOR.similarity = function (s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - HangarXPLOR.editDistance(longer, shorter)) / parseFloat(longerLength);
}

HangarXPLOR.editDistance = function (s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}
//@End-Source

// Search a list, based on the specified search term
HangarXPLOR.Search = function(list, term)
{

  if(term.trim().length === 0 || list.length === 0) return list;

  var _modified = [];

  var recoverSimilarity = list[0];

  list.forEach(function(e) {
      e.similarityScore = HangarXPLOR.similarity(term.toLowerCase(), e.displayName.toLowerCase());
      if(e.similarityScore >= HangarXPLOR._similarityThreshold) {
          _modified.push(e);
      }

      if(e.similarityScore > recoverSimilarity.similarityScore) {
          recoverSimilarity = e;
      }
  });

  if(_modified.length > 0) {
      _modified.sort(function(a,b) {
          if(a.similarityScore < b.similarityScore) return 1;
          else if(a.similarityScore > b.similarityScore) return -1;
          else return 0;
      });
  } else {
      _modified.push(recoverSimilarity);
  }

  return _modified;
}

HangarXPLOR.SearchSuggestion = function(list, term, elementClass) {

    var suggestion = "";

    if(term.trim().length > 0) {
        var similarityScore = 0;

        list.forEach(function(e) {
            var _t = HangarXPLOR.similarity(term.toLowerCase(), e.displayName.toLowerCase());

            if(_t > similarityScore) {
                similarityScore = _t;
                suggestion = e.displayName;
            }
        });
    }

    //@TODO Implement auto-suggestion & auto-fill (tab)
    //$(elementClass).text(suggestion);
    return suggestion;

}
