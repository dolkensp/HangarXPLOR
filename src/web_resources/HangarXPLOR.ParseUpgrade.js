
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR.ParseUpgrade = function(pledgeName)
{
  
  this.filters.is_upgrade = $('.js-upgrade-data', this).length > 0;
  
  if (this.filters.is_upgrade)
  {
    this.upgrade_data = JSON.parse($('.js-upgrade-data', this).val());

    $('.title:contains(Upgrade)', this).after('<div class="kind">Upgrade</div>');

    HangarXPLOR._upgradeCount += 1;

    this.displayName = this.upgrade_data.match_items[0].name + ' to ' + this.upgrade_data.target_items[0].name

    var target_name = this.upgrade_data.target_items[0].name;
    var found = false;
    var i, j;
    for (i = 0, j = HangarXPLOR._shipMatrix.length; i < j; i++) {
      if (target_name.toLowerCase().indexOf(HangarXPLOR._shipMatrix[i].name.toLowerCase()) > -1) {

        HangarXPLOR.Log('Matched', HangarXPLOR._shipMatrix[i].name, 'in', target_name);

        target_name = (HangarXPLOR._shipMatrix[i].displayName || HangarXPLOR._shipMatrix[i].name);
        found = true;
        if (HangarXPLOR._shipMatrix[i].thumbnail != undefined) {
          $('.basic-infos .image', this).css({ 'background-image': 'url("' + HangarXPLOR._shipMatrix[i].thumbnail + '")'});
        }
        break;
      }
    }
  }
}
