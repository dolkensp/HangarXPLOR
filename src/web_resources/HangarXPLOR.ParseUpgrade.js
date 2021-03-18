
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR.ParseUpgrade = function(pledgeName)
{
  this.filters.is_upgrade = (pledgeName.indexOf('upgrade') == 0 ||
                             pledgeName.indexOf('upgrade') == pledgeName.length - 7) &&
                             pledgeName.indexOf(' to ') > -1;
  
  if (this.filters.is_upgrade)
  {
    $('.title:contains(Upgrade)', this).after('<div class="kind">Upgrade</div>');

    HangarXPLOR._upgradeCount += 1;

    this.displayName = this.displayName.replace(/^upgrade (- )?/i, '')
                                       .replace(/^ (- )?upgrade$/i, '');
  }
}
