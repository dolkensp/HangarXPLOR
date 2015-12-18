
var HangarXPLOR = HangarXPLOR || {};

// Render UI controls
HangarXPLOR.BulkUI = function()
{
  HangarXPLOR.$list.on('click.HangarXPLOR', 'a', function(e) { e.originalEvent.isButton = true; });
  HangarXPLOR.$list.on('click.HangarXPLOR', 'li', function(e) {
    if (!e.originalEvent.isButton)
    {
      $('.row', this).removeClass('js-selected');
      this.isSelected = !this.isSelected;
      if (this.isSelected) $('.row', this).addClass('js-selected');
    }
  });
}

HangarXPLOR.RefreshBulkUI = function()
{
  console.log('Redraw BulkUI');
}

HangarXPLOR.ResetBulkUI = function()
{
  console.log('Reset BulkUI');
  
  for (var i = 0, j = HangarXPLOR._inventory.length; i < j; i++)
  {
    HangarXPLOR._inventory.isSelected = false;
  }
  
  $('.row', HangarXPLOR.$list).removeClass('js-selected');  
}