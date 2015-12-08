
var HangarXPLOR = HangarXPLOR || {};

// Render items that match the search, filter and sort criteria
HangarXPLOR.Render = function(filterBy, sortBy, searchBy)
{
  filterBy = filterBy || 'js-custom-filter';
  sortBy = sortBy || 'js-custom-sort';
  searchBy = searchBy || 'js-custom-search';
  
  console.log('Rendering', filterBy, sortBy, searchBy);
  
  filterBy = '.' + filterBy;
  sortBy = '.' + sortBy;
  searchBy = '.' + searchBy;
  
  var buffer = HangarXPLOR._inventory;
  
  $(filterBy).each(function() { buffer = HangarXPLOR.Filter(buffer, $(this).val()); });
  $(sortBy).each(function() { buffer = HangarXPLOR.Sort(buffer, $(this).val()); });
  $(searchBy).each(function() { buffer = HangarXPLOR.Search(buffer, $(this).val()); });
  
  if (buffer.length == 0)
    buffer.push($('<h4 class="empy-list">Your hangar is empty.</h4>'));
    
  HangarXPLOR.$list.empty();
  HangarXPLOR.$list.append(buffer);
}
