
var HangarXPLOR = HangarXPLOR || {};

// Apply a pre-defined filter to a list of items
HangarXPLOR.ProcessItem = function()
{
  
  var $ship = $('.kind:contains(Ship)', this);
  var $wrapper = $('.wrapper-col', this);
    
  var h3Text = $('h3', this).contents().filter(function() { return this.nodeType == 3 && this.nodeValue.trim().length > 0 })[0];
    
  var pledgeName = $('.js-pledge-name', this).val() || '';
  
  if (pledgeName.length > 0) {
    // Clean up existing hangar items
    
    pledgeName = pledgeName.trim();
    this.originalName = pledgeName;
    
    pledgeName = pledgeName.replace(/^Subscribers Exclusive - /i, '');
    pledgeName = pledgeName.replace(/^(UEE Calendar|Workbench|Patron of the Arts Award|StellarSonic JukeBox|Locker from Another Universe|UEE Towel|Mr. Refinement's Cabinet of Rare & Exquisite Spirits)/i, 'Decorations - $1');
    pledgeName = pledgeName.replace(/^(UEE Environment Coat|Omni Role Combat Armor \(ORC\) mk9)/i, 'Add-Ons - $1');
    pledgeName = pledgeName.replace(/^Puglisi Collection[: ]/i, 'Puglisi Collection - ');
    pledgeName = pledgeName.replace(/Battlefield Upgrade Kit/i, 'BUK');
    pledgeName = pledgeName.replace(/^Takuetsu/i, 'Models - Takuetsu');
    pledgeName = pledgeName.replace(/^Takuetsu (.*) Model$/i, 'Models - Takuetsu $1');
    pledgeName = pledgeName.replace(/^(Oshi|Thorshu Grey|Vindel|Ribbon Fish|Midas)/i, 'Fishtank - $1');
    pledgeName = pledgeName.replace(/^(Badger and Badges|Gimbals and Guns|Surf and Turf|Gladius and Gold)/i, 'Reward - $1');
    pledgeName = pledgeName.replace(/^Your RSI space suit reward/i, 'Reward - RSI Class II Space Suit');
    pledgeName = pledgeName.replace(/^Original and Veteran Backers Reward/i, 'Reward - AMX-1 Repair Bot');
    pledgeName = pledgeName.replace(/^Hangar Fees Reward/i, 'Reward - Free Hangar Fees');
    pledgeName = pledgeName.replace(/^Christmas 2014 reward!/i, 'Reward - Holiday Wreath - Christmas 2014');
    pledgeName = pledgeName.replace(/^#YOU'RE A STAR CITIZEN/i, 'Reward - Vanguard Harbinger - You\'re A Star Citizen');
    pledgeName = pledgeName.replace(/^15 Million Reward/i, 'Reward - Digital 42-page Upgrade Handbook - 15 Million');
    pledgeName = pledgeName.replace(/^16 Million Reward/i, 'Reward - Laser Pistol side arm- 16 Million');
    pledgeName = pledgeName.replace(/^17 Million Reward/i, 'Reward - Mystery engine modifier - 17 Million');
    pledgeName = pledgeName.replace(/^19 Million Reward/i, 'Reward - Jane\'s Fighting Ships style manual - 19 Million');
    pledgeName = pledgeName.replace(/^20 Million Reward/i, 'Reward - Fishtank Mark 1 - 20 Million');
    pledgeName = pledgeName.replace(/^23 Million Reward/i, 'Reward - Takuetsu Prestige Khartu-Al Model - 23 Million');
    pledgeName = pledgeName.replace(/^(\d+)M (Reward - .+)$/i, '$2 - $1 Million');
    pledgeName = pledgeName.replace(/^(Decorations - |Add-Ons - )?"?PAX Australia (\d+)( Trophy)?"?/i, 'Trophy - PAX Australia $2');
    pledgeName = pledgeName.replace(/^(Decorations - |Add-Ons - )?"?Gamescom (\d+)( Trophy)?"?/i, 'Trophy - Gamescom $2');
    pledgeName = pledgeName.replace(/^(Decorations - |Add-Ons - )?"?CitizenCon (\d+)( Subscriber)?( Trophy)?"?/i, 'Trophy - CitizenCon $2');
    pledgeName = pledgeName.replace(/^December 2014 Backer Reward/i, 'Reward - Takuetsu Mustang Model - December 2014');
    pledgeName = pledgeName.replace(/^(Hornet|Freelancer|Decorations - CitizenCon \d+) Poster/i, 'Posters - $1');
    pledgeName = pledgeName.replace(/ Poster$/i, '');
    pledgeName = pledgeName.replace(/^Space Globe /i, 'Space Globes ');
    pledgeName = pledgeName.replace(/"Be A Hero"$/i, 'Be A Hero');
    pledgeName = pledgeName.replace(/^Cross-Chassis Upgrades/i, 'Ship Upgrades');
    pledgeName = pledgeName.replace(/^(.*) Skin$/i, 'Skins - $1');
    pledgeName = pledgeName.replace(/^Freelancer MIS upgrade$/i, 'Ship Upgrades - Freelancer MIS Upgrade');
    pledgeName = pledgeName.replace(/^F7A Military Hornet Upgrade$/i, 'Ship Upgrades - F7A Military Hornet Upgrade');
    pledgeName = pledgeName.replace(/ Upgrade$/i, '');
    pledgeName = pledgeName.replace(/^You Got Our Backs (Electro Skin Hull)$/i, 'Ship Upgrades - You Got Our Backs (Electro Skin Hull)');
    pledgeName = pledgeName.replace(/^Next Generation Aurora$/i, 'Package - Next Generation Aurora - LTI');
    pledgeName = pledgeName.replace(/^(Aegis Dynamics Idris Corvette|Aegis Dynamics Retaliator Heavy Bomber|Anvil Gladiator Bomber|Banu Merchantman|Captured Vanduul Fighter|Drake Interplanetary Caterpillar|Idris Corvette|MISC Freelancer|MISC Starfarer Tanker|ORIGIN M50 Interceptor|RSI Aurora LN|RSI Aurora LX|RSI Constellation|Xi'An Scout -  Khartu)( - LTI)?$/i, 'Standalone Ship - $1$2');
    pledgeName = pledgeName.replace(/^(Digital )?(Advanced Hunter|Arbiter|Bounty Hunter|Colonel|Cutlass|Freelancer|Mercenary|Pirate|Rear Admiral|Scout|Specter|Weekend Warrior)( - LTI)?$/i, 'Package - $1$2$3');
    pledgeName = pledgeName.replace("  ", " ").trim();
    // TODO: Add pre-processing for Reliant Variants Here if required
    
    // 
    // Package - Mustang Omega : AMD Edition
    // 1 Year Imperator Reward - 15% Coupon: SSSSSSSSSS
    // Greycat PTV
    
    var titleParts = pledgeName.split(/\s-\s/);
    
    for (var i = 0, j = titleParts.length; i < j; i++)
      titleParts[i] = titleParts[i].trim();
    
    this.pledgeId = parseInt($('.js-pledge-id', this).val().trim());
    this.pledgeValue = $('.js-pledge-value', this).val();
    this.shipName = $ship.prev().text().replace('M50 Interceptor', 'M50').replace('M50', 'M50 Interceptor');
    this.meltValue = parseFloat(this.pledgeValue.replace("$", "").replace(",", "").replace(" USD", ""));
    this.hasValue = this.meltValue > 0;
    this.hasLTI = $('.title:contains(Lifetime Insurance)', this).length > 0;
    this.hasShip = $ship.length > 0;
    this.isMeltable = $('.js-reclaim', this).length > 0;
    this.isUpgraded = $('.upgraded', this).length > 0;
    this.isGiftable = $('.label:contains(Gift)', this).length > 0;
    this.isPackage = $('.title:contains(Squadron 42 Digital Download)', this).length > 0;
    this.isShip = $ship.length == 1;
    this.isUpgrade = (titleParts[0] == "Ship Upgrades");
    this.isAddOn = (titleParts[0] == "Add-Ons");
    this.isTrophy = (titleParts[0] == "Trophy");
    this.isPoster = (titleParts[0] == "Posters");
    this.isFishtank = (titleParts[0] == "Fishtank");
    this.isReward = (titleParts[0] == "Reward");
    this.isSpaceGlobe = (titleParts[0] == "Space Globes");
    this.isModel = (pledgeName.indexOf("Takuetsu") > -1);
    this.isFlair = !this.isShip && !this.isPackage && !this.isUpgrade && !this.isAddOn;
    this.isDecoration = !this.isModel && !this.isPoster && this.isFlair;
    this.isComponent = $('.kind:contains(Component)', this).length > 0;
    this.isSelected = false;
    
    if (this.hasLTI && titleParts[2] == null) titleParts[2] = ' - LTI';
    
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
    
    var ltiSuffix = this.hasLTI ? ' - LTI' : (titleParts[3] || '');
    
    if (this.isUpgraded || this.isPackage || this.isReward)
      $wrapper.append($("<div class='items-col'><label>Base Pledge</label>" + this.originalName + '</div>'));
    
    if (this.isShip)
      this.displayName = titleParts[0] + ' - ' + this.shipName + ltiSuffix + ' (' + this.pledgeId + ')';
    else if (this.isSpaceGlobe)
      this.displayName = $('.title', this).text();
    else
      this.displayName = pledgeName + ' (' + this.pledgeId + ')';
    
    this.sortName = this.displayName.replace(/^.*? - (.*)$/, '$1');
    
    if ($.cookie('noPrefix') == 'true')
      this.displayName = this.sortName;
      
    h3Text.textContent = this.displayName;
    
  } else {
    console.log('Warning: Error parsing', this.innerHTML);
  }

  HangarXPLOR._inventory.push(this);
}
