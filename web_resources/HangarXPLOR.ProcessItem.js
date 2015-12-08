
var HangarXPLOR = HangarXPLOR || {};

// Apply a pre-defined filter to a list of items
HangarXPLOR.ProcessItem = function()
{
  
  var $ship = $('.kind:contains(Ship)', this);
  var $wrapper = $('.wrapper-col', this);
    
  var h3Text = $('h3', this).contents().filter(function() { return this.nodeType == 3 && this.nodeValue.trim().length > 0 })[0];
    
  var pledgeName = $('.js-pledge-name', this).val() || '';
  var pledgeId = $('.js-pledge-id', this).val();
  
  if (pledgeName.length > 0) {
    // Clean up existing hangar items
    pledgeName = pledgeName.replace('Subscribers Exclusive - ', '');
    pledgeName = pledgeName.replace('StellarSonic JukeBox', 'Decorations - StellarSonic JukeBox');
    pledgeName = pledgeName.replace('UEE Calendar', 'Decorations - UEE Calendar');
    pledgeName = pledgeName.replace('Puglisi Collection:', 'Puglisi Collection');
    pledgeName = pledgeName.replace('Puglisi Collection ', 'Puglisi Collection - ');
    pledgeName = pledgeName.replace('Takuetsu', 'Models - Takuetsu');
    pledgeName = pledgeName.replace('TAKUETSU', 'Models - Takuetsu');
    pledgeName = pledgeName.replace('Badger and Badges', 'Rewards - Badger and Badges');
    pledgeName = pledgeName.replace('Gimbals and Guns', 'Rewards - Gimbals and Guns');
    pledgeName = pledgeName.replace('Surf and Turf', 'Rewards - Surf and Turf');
    pledgeName = pledgeName.replace('Gladius and Gold', 'Rewards - Gladius and Gold');
    
    // TODO - Space Globe support
    
    var titleParts = pledgeName.split(/\s-\s/);
    
    this.pledgeValue = $('.js-pledge-value', this).val();
    this.shipName = $ship.prev().text();
    this.hasValue = this.pledgeValue != '$0.00 USD';
    this.hasLTI = $('.title:contains(Lifetime Insurance)', this).length > 0;
    this.hasShip = $ship.length > 0;
    this.isUpgraded = $('.upgraded', this).length > 0;
    this.isGiftable = $('.label:contains(Gift)', this).length > 0;
    this.isPackage = $('.title:contains(Squadron 42 Digital Download)', this).length > 0;
    this.isShip = $ship.length == 1;
    this.isUpgrade = (titleParts[0] == "Ship Upgrades") || (titleParts[0] == "Cross-Chassis Upgrades");
    this.isAddOn = (titleParts[0] == "Add-Ons");
    this.isPoster = (titleParts[0] == "Posters");
    this.isFishtank = (titleParts[0] == "Fishtank");
    this.isReward = (titleParts[0] == "Rewards");
    this.isModel = (pledgeName.indexOf("Takuetsu") > -1);
    this.isFlair = !this.isShip && !this.isPackage && !this.isUpgrade && !this.isAddOn;
    this.isDecoration = !this.isModel && !this.isPoster && this.isFlair;
    this.isComponent = $('.kind:contains(Component)', this).length > 0;
    
    // Special case for Gladius and Gold referal reward
    if (titleParts[1] == 'Gladius and Gold') this.isFlair = this.isModel = this.isDecoration = true;
    if (titleParts[1] == 'Gimbals and Guns') this.isFlair = this.isDecoration = false;
    if (titleParts[1] == 'Badger and Badges') this.isFlair = false;
    
    if (this.isShip) {
      for (var i = 0, j = HangarXPLOR._ships.length; i < j; i++) {
        if (this.shipName.toLowerCase().indexOf(HangarXPLOR._ships[i].name.toLowerCase()) > -1) {
          $('.basic-infos .image', this).css({ 'background-image': 'url("' + HangarXPLOR._ships[i].thumbnail + '")'});
          break;
        }
      }
    }
    
    $wrapper.append($("<div class='date-col'><label>Melt Value</label>" + this.pledgeValue + '</div>'));
    
    if (titleParts[0] == "Package" || titleParts[0] == "Standalone Ship") {
      $wrapper.append($("<div class='items-col'><label>Base Pledge</label>" + pledgeName + '</div>'));
      if (titleParts.length == 3)
        h3Text.textContent = titleParts[0] + ' - ' + this.shipName + ' - ' + titleParts[2] + ' (' + pledgeId + ')';
      else
        h3Text.textContent = titleParts[0] + ' - ' + this.shipName + ' (' + pledgeId + ')';
    } else {
      h3Text.textContent = pledgeName + ' (' + pledgeId + ')';
    }
  } else {
    console.log('Warning: Error parsing', this.innerHTML);
  }

  
  HangarXPLOR._inventory.push(this);
}
