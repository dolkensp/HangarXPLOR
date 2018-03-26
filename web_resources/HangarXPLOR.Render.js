
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR._pageNo = 1;
HangarXPLOR._pageCount = 10;
HangarXPLOR._totalRecords = 10;

// Render items that match the search, filter and sort criteria
HangarXPLOR.Render = function()
{
  var filterBy = 'js-custom-filter';
  var sortBy = 'js-custom-sort';
  var searchBy = 'js-custom-search';

  if (HangarXPLOR.logsEnabled) {
    console.log('Rendering', filterBy, sortBy, searchBy, HangarXPLOR._pageNo, HangarXPLOR._pageCount);
  }

  filterBy = '.' + filterBy;
  sortBy = '.' + sortBy;
  searchBy = '.' + searchBy;

  var buffer = HangarXPLOR._inventory;
  
  $(filterBy).each(function() { buffer = HangarXPLOR.Filter(buffer, $(this).val()); });
  $(searchBy).each(function() { buffer = HangarXPLOR.Search(buffer, $(this).val()); });
  $(sortBy).each(function() { buffer = HangarXPLOR.Sort(buffer, $(this).val()); });

  HangarXPLOR._filtered = buffer;

  if (buffer.length == 0) {
    buffer.push($('<h4>', { class: 'empy-list', text: 'Your hangar is empty.' }));
  }

  HangarXPLOR._totalRecords = buffer.length;

  var maxPages = Math.ceil(HangarXPLOR._totalRecords / HangarXPLOR._pageCount);
  if (HangarXPLOR._pageNo > maxPages) HangarXPLOR._pageNo = maxPages;

  if (HangarXPLOR._pageCount < 1000) buffer = buffer.slice((HangarXPLOR._pageNo - 1) * HangarXPLOR._pageCount, HangarXPLOR._pageNo * HangarXPLOR._pageCount);

  HangarXPLOR.$list.empty();
  HangarXPLOR.$list.append(buffer);
}
