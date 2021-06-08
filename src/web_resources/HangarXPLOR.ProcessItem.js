
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR._shipCount     = HangarXPLOR._shipCount || 0;
HangarXPLOR._upgradeCount  = HangarXPLOR._upgradeCount || 0;
HangarXPLOR._giftableCount = HangarXPLOR._giftableCount || 0;
HangarXPLOR._packageCount  = HangarXPLOR._packageCount || 0;
HangarXPLOR._ltiCount      = HangarXPLOR._ltiCount || 0;
HangarXPLOR._warbondCount  = HangarXPLOR._warbondCount || 0;
HangarXPLOR._raw           = HangarXPLOR._raw || [];

var cyclone = {
  "Tumbril Cyclone-RN": "/media/ao2p3pw2e7k94r/subscribers_vault_thumbnail/Tumbril-Buggy-Piece-01-Showroom-V009.jpg",
  "Tumbril Cyclone-TR": "/media/cmq3rwpo5ghpvr/subscribers_vault_thumbnail/Tumbril-Buggy-Piece-04-Desert-V012.jpg",
  "Tumbril Cyclone-RC": "/media/w3vw5498xb25mr/subscribers_vault_thumbnail/Tumbril-Buggy-Piece-05-Rocky-Beach-Sport-Fin.jpg",
  "Tumbril Cyclone-AA": "/media/n6535dpiwv2pgr/subscribers_vault_thumbnail/Tumbril-Buggy-Piece-06-Lagoon-V011.jpg",
};

HangarXPLOR.PreProcessTumbrilCyclone = function(item)
{
  //console.log('PreProcessTumbrilCyclone item', item);

  var name = item.text().trim();
  //console.log('PreProcessTumbrilCyclone name', name);

  // NOTE:(pv) I think I own most everything with a Cyclone in it, and I am not seeing this method do anything... :/

  if (name == "Tumbril Cyclone")
      name = "Tumbril Cyclone-RN";
  
  if (name != "Tumbril Cyclone-AA" &&
      name != "Tumbril Cyclone-TR" &&
      name != "Tumbril Cyclone-RN" &&
      name != "Tumbril Cyclone-RC") {
      //console.log('PreProcessTumbrilCyclone ignoring', item);
      return;
  }

  //console.log('PreProcessTumbrilCyclone pre-processing...', item);

  var $block = item.closest('.content-block1');
  var $images = $('.with-images', $block);
  if ($images.length == 0) {
    $block.prepend($('<div />').addClass('also-contains').text("Also Contains"));
    $block.prepend($images = $('<div />').addClass('with-images'));
  }
  
  var $item = $('<div />').addClass('item').append(
    $('<div />').addClass('image').css({ 'background-image': 'url("' + cyclone[name] + '")' }),
    $('<div />').addClass('text').append(
      $('<div />').addClass('title').text(name),
      $('<div />').addClass('kind').text("Ship"),
      $('<div />').addClass('liner').append("Tumbril (", $('<span />').text("TMBL"), ")")
    )
  );
  $images.prepend($item);
  item.parent().remove();
}

HangarXPLOR.CleanPledgeName = function(pledgeName)
{
  pledgeName = pledgeName.replace(/^ORIGIN 600i Exploration Edition - /i, 'Combo - ORIGIN 600i Exploration Edition - ');
  pledgeName = pledgeName.replace(/^1 Year (Centurion|Imperator) Reward - /i, 'Reward - ');
  pledgeName = pledgeName.replace(/^(Conner.s Beard Moss|Opera Mushroom)/i, 'Space Plant - $1');
  pledgeName = pledgeName.replace(/^Space (?:Plant|Cactus|Flower) - /i, 'Space Plant - ');
  pledgeName = pledgeName.replace(/^Subscribers Exclusive - /i, '');
  pledgeName = pledgeName.replace(/^(UEE Calendar|Workbench|Patron of the Arts Award|StellarSonic JukeBox|Locker from Another Universe|UEE Towel|Mr. Refinement's Cabinet of Rare & Exquisite Spirits)/i, 'Decorations - $1');
  pledgeName = pledgeName.replace(/^(UEE Environment Coat|Omni Role Combat Armor \(ORC\) mk9)/i, 'Add-Ons - $1');
  pledgeName = pledgeName.replace(/^(The |)Puglisi Collection[: ]/i, 'Puglisi Collection - ');
  pledgeName = pledgeName.replace(/Battlefield Upgrade Kit/i, 'BUK');
  pledgeName = pledgeName.replace(/^Takuetsu/i, 'Models - Takuetsu');
  pledgeName = pledgeName.replace(/^Takuetsu (.*) Model$/i, 'Models - Takuetsu $1');
  pledgeName = pledgeName.replace(/^(Oshi|Thorshu Grey|Vindel|Ribbon Fish|Midas)/i, 'Fishtank - $1');
  pledgeName = pledgeName.replace(/^(Badger and Badges|Gimbals and Guns|Surf and Turf|Gladius and Gold)/i, 'Reward - $1');
  pledgeName = pledgeName.replace(/^Your RSI space suit reward/i, 'Reward - RSI Class II Space Suit');
  pledgeName = pledgeName.replace(/^Original and Veteran Backers Reward/i, 'Reward - AMX-1 Repair Bot');
  pledgeName = pledgeName.replace(/^Hangar Fees Reward/i, 'Reward - Free Hangar Fees');
  pledgeName = pledgeName.replace(/^Christmas 2014 reward!/i, 'Reward - Holiday Wreath - Christmas 2014');
  pledgeName = pledgeName.replace(/^Christmas Reward!/i, 'Reward - Holiday Wreath - Christmas 2015');
  pledgeName = pledgeName.replace(/^#YOU'RE A STAR CITIZEN/i, 'Reward - Vanguard Harbinger - You\'re A Star Citizen');
  pledgeName = pledgeName.replace(/^15 Million Reward/i, 'Reward - Digital 42-page Upgrade Handbook - 15 Million');
  pledgeName = pledgeName.replace(/^16 Million Reward/i, 'Reward - Laser Pistol side arm- 16 Million');
  pledgeName = pledgeName.replace(/^17 Million Reward/i, 'Reward - Mystery engine modifier - 17 Million');
  pledgeName = pledgeName.replace(/^19 Million Reward/i, 'Reward - Jane\'s Fighting Ships style manual - 19 Million');
  pledgeName = pledgeName.replace(/^20 Million Reward/i, 'Reward - Fishtank Mark 1 - 20 Million');
  pledgeName = pledgeName.replace(/^23 Million Reward/i, 'Reward - Takuetsu Prestige Khartu-Al Model - 23 Million');
  pledgeName = pledgeName.replace(/^200 Million Commemorative Coin/i, 'Reward - Commemorative Coin - 200 Million');
  pledgeName = pledgeName.replace(/^300 Million Reward/i, 'Reward - S-38 \'One Empire\' Pistol - 300 Million');
  pledgeName = pledgeName.replace(/^(\d+)M (Reward - .+)$/i, '$2 - $1 Million');
  pledgeName = pledgeName.replace(/^(Decorations - |Add-Ons - )?"?PAX Australia (\d+)(.*?) Trophy"?/i, 'Trophy - PAX Australia $2');
  pledgeName = pledgeName.replace(/^(Decorations - |Add-Ons - )?"?Gamescom (\d+)(.*?) Trophy"?/i, 'Trophy - Gamescom $2');
  pledgeName = pledgeName.replace(/^(Decorations - |Add-Ons - )?"?CitizenCon (\d+)( Subscriber)? Trophy"?/i, 'Trophy - CitizenCon $2');
  pledgeName = pledgeName.replace(/^(Decorations - |Add-Ons - )?"?CitizenCon (\d+)"?/i, 'Reward - CitizenCon $2');
  pledgeName = pledgeName.replace(/^(Decorations - |Add-Ons - )?(.*?) Painting/i, 'Decoration - $2 Painting');
  pledgeName = pledgeName.replace(/^(Decorations - |Add-Ons - )?(.*?) Statue/i, 'Decoration - $2 Statue');
  pledgeName = pledgeName.replace(/^(Decorations - |Add-Ons - )?(.*?) Model/i, 'Models - $2');
  pledgeName = pledgeName.replace(/^December 2014 Backer Reward/i, 'Reward - Takuetsu Mustang Model - December 2014');
  pledgeName = pledgeName.replace(/^(Hornet|Freelancer|Decorations - CitizenCon \d+) Poster/i, 'Posters - $1');
  pledgeName = pledgeName.replace(/ Poster$/i, '');
  pledgeName = pledgeName.replace(/^(.*) (Helmet|Armor|Armor Set)$/i, 'Equipment - $1 $2');
  pledgeName = pledgeName.replace(/^Masters of Design Series ?- ?(.*)$/i, 'Decoration - $1');
  pledgeName = pledgeName.replace(/(.*) T-Shirt$/i, 'Equipment - $1 T-Shirt');
  pledgeName = pledgeName.replace(/T-Shirt (.*)$/i, 'Equipment - $1 T-Shirt');
  pledgeName = pledgeName.replace(/^(.*) Best in Show Livery Upgrade/i, 'Paints - $1 Best in Show Livery');
  pledgeName = pledgeName.replace(/^Space Globe /i, 'Space Globes ');
  pledgeName = pledgeName.replace(/^Standalone Ship - Drake Dragonfly Ride Together Two-Pack/i, 'Combo - Drake Dragonfly Ride Together Two-Pack');
  pledgeName = pledgeName.replace(/^Add-ons - (.*) Mega(?: |-)Pack$/i, 'Combo - $1 Mega Pack');
  pledgeName = pledgeName.replace(/ - Holiday 20\d\d$/i, '');
  pledgeName = pledgeName.replace(/"Be A Hero"$/i, 'Be A Hero');
  pledgeName = pledgeName.replace(/^Cross-Chassis Upgrades/i, 'Ship Upgrades');
  pledgeName = pledgeName.replace(/^(.*) Skin$/i, 'Paints - $1');
  pledgeName = pledgeName.replace(/^Freelancer MIS upgrade$/i, 'Ship Upgrades - Freelancer MIS Upgrade');
  pledgeName = pledgeName.replace(/^F7A Military Hornet Upgrade$/i, 'Ship Upgrades - F7A Military Hornet Upgrade');
  pledgeName = pledgeName.replace(/ Upgrade$/i, '');
  pledgeName = pledgeName.replace(/^You Got Our Backs (Electro Skin Hull)$/i, 'Ship Upgrades - You Got Our Backs (Electro Skin Hull)');
  pledgeName = pledgeName.replace(/^Next Generation Aurora$/i, 'Package - Next Generation Aurora - LTI');
  pledgeName = pledgeName.replace(/Discount Pack/i, 'Pack');
  pledgeName = pledgeName.replace(/Watch the Skies Tip Line Reward/i, 'Reward - Watch the Skies Tip Line');
  pledgeName = pledgeName.replace(/Tumbril Cyclone LTI Presale/i, 'Tumbril Cyclone - LTI');
  pledgeName = pledgeName.replace(/^(Aegis Dynamics Idris Corvette|Aegis Dynamics Retaliator Heavy Bomber|Anvil Gladiator Bomber|Banu Merchantman|Captured Vanduul Fighter|Drake Interplanetary Caterpillar|Idris Corvette|MISC Freelancer|MISC Starfarer Tanker|ORIGIN M50 Interceptor|RSI Aurora LN|RSI Aurora LX|RSI Constellation|ORIGIN 350R Racer|Xi'An Scout - +Khartu)( - LTI)?$/i, 'Standalone Ship - $1$2');
  pledgeName = pledgeName.replace(/^(Digital )?(Advanced Hunter|Arbiter|Bounty Hunter|Colonel|Cutlass|Freelancer|Mercenary|Pirate|Rear Admiral|Scout|Specter|Weekend Warrior)( - LTI)?$/i, 'Package - $1$2$3');
  pledgeName = pledgeName.replace("  ", " ").trim();

  // TODO: Add pre-processing for Reliant Variants Here if required
  
  // Package - Mustang Omega : AMD Edition
  // 1 Year Imperator Reward - 15% Coupon: SSSSSSSSSS
  // Greycat PTV

  return pledgeName;
}

HangarXPLOR.CleanShipName = function(shipName)
{
  // These just standardize some naming
  shipName = shipName.replace('Origin 600i Exploration Module', 'Origin 600i');
  shipName = shipName.replace('M50 Interceptor', 'M50');
  shipName = shipName.replace('M50', 'M50 Interceptor');
  shipName = shipName.replace('Hornet F7C', 'F7C Hornet');
  return shipName;
}

HangarXPLOR.CleanComboShips = function(comboShips, debug)
{
  comboShips.each(function (index, value) {
    if (debug) {
      console.log('CleanComboShips comboShips[' + index + ']=', value);
    }
    var comboShip = $(this)
    if (debug) {
      console.log('CleanComboShips comboShip BEFORE', comboShip);
    }
    var comboShipName = comboShip.text();
    if (debug) {
      console.log('CleanComboShips comboShipName BEFORE', comboShipName);
    }
    comboShipName = HangarXPLOR.CleanComboShipName(comboShipName);
    if (debug) {
      console.log('CleanComboShips comboShipName AFTER', comboShipName);
    }
    comboShip[0].textContent = comboShipName;
    if (debug) {
      console.log('CleanComboShips comboShip AFTER', comboShip);
    }
  })
}

HangarXPLOR.CleanComboShipName = function(comboShipName)
{
  comboShipName = comboShipName.replace('Tumbril Cyclone-TR', 'Tumbril Cyclone TR');
  return comboShipName;
}

// Apply a pre-defined filter to a list of items
HangarXPLOR.ProcessItem = function()
{
  // Preprocessing Begin
  // Tumbril Cyclone
  $('.without-images .title:contains(Tumbril Cyclone)', this).each(function(index, value) {
    //console.log('ProcessItem PreProcessTumbrilCyclone index=' + index + ', value=', value);
    HangarXPLOR.PreProcessTumbrilCyclone($(this));
  })
  // Preprocessing End
  
  var pledgeName = $('.js-pledge-name', this).val() || '';

  var debugName = pledgeName.toLowerCase();
  //console.log('ProcessItem debugName', debugName);
  var debug = //debugName.includes('pisces') ||
              //debugName.includes('tumbril') ||
              //debugName.includes('origin x1') ||
              //debugName.includes('space globe') ||
              //debugName.includes('anniversary 2017 mustang discount starter package')
              //debugName.includes('aegis idris-p after market kit')
              //debugName.includes('upgrade - ')
              false;
  if (debug) {
    console.log('ProcessItem pledgeName', pledgeName);
  }

  var $ship      = $('.kind:contains(Ship)', this).parent().find('.title');
  if (debug) {
    console.log('ProcessItem $ship', $ship);
  }
  var $component = $('.kind:contains(Component)', this);
  var $wrapper   = $('.wrapper-col', this);
    
  var h3Text     = $('h3', this).contents().filter(function() { return this.nodeType == 3 && this.nodeValue.trim().length > 0 })[0];
    
  if (pledgeName.length > 0) {
    // Clean up existing hangar items
    
    pledgeName = pledgeName.trim();
    this.originalName = pledgeName;
    pledgeName = HangarXPLOR.CleanPledgeName(pledgeName);
   
    var titleParts = pledgeName.split(/\s-\s/);
    
    for (var i = 0, j = titleParts.length; i < j; i++)
      titleParts[i] = titleParts[i].trim();
    if (debug) {
      console.log('ProcessItem titleParts', titleParts);
    }
    var titlePartsFirst = titleParts[0];
    var titlePartsMiddle = titleParts.slice(1, titleParts.length).join(' '); 
    var titlePartsLast = titleParts[titleParts.length - 1];
    if (debug) {
      console.log('ProcessItem titlePartsFirst', titlePartsFirst);
      console.log('ProcessItem titlePartsMiddle', titlePartsMiddle);
      console.log('ProcessItem titlePartsLast', titlePartsLast);
    }
      
    this.pledgeId = parseInt($('.js-pledge-id', this).val().trim());
    this.pledgeValue = $('.js-pledge-value', this).val();
    this.componentName = $component.prev().text();
    this.shipName = $.map($ship, $.text).join(", ");

    this.shipName = HangarXPLOR.CleanShipName(this.shipName);
    if (debug) {
      console.log('ProcessItem this.shipName', this.shipName);
    }
      
    this.nickname = $('.custom-name-text', this).text();
    this.meltValue = parseFloat(this.pledgeValue.replace("$", "").replace(",", "").replace(" USD", ""));
    if (debug) {
      console.log('ProcessItem this.meltValue', this.meltValue);
    }
    if (this.meltValue != this.meltValue) this.meltValue = 0; // NaN safety
    this.hasValue = this.meltValue > 0;
    this.hasLTI = $('.title:contains(Lifetime Insurance)', this).length > 0;
    this.hasShip = $ship.length > 0;
    this.hasNickname = this.nickname.length > 0;
    this.isMeltable = $('.js-reclaim', this).length > 0;
    this.isUpgraded = $('.upgraded', this).length > 0;
    this.isNameable = $('.contains-nameable', this).length > 0;
    this.isGiftable = $('.label:contains(Gift)', this).length > 0 && this.meltValue < 1001;
    this.isPackage = ($('.title:contains(Squadron 42 Digital Download)', this).length + $('.title:contains(Star Citizen Digital Download)', this).length) > 0;
    this.isShip = $ship.length == 1;
    this.isCombo = $ship.length > 1;
    this.isUpgrade = (titlePartsFirst == "Ship Upgrades" || titlePartsFirst == "Upgrade");
    this.isAddOn = (titlePartsFirst == "Add-Ons");
    this.isPaint = (titlePartsFirst == "Paints") || (pledgeName.indexOf("Livery") > 0) || $('.kind:contains(Skin)', this).length > 0;
    this.isTrophy = (titlePartsFirst == "Trophy");
    this.isPoster = (titlePartsFirst == "Posters");
    this.isFishtank = (titlePartsFirst == "Fishtank");
    this.isReward = (titlePartsFirst == "Reward" || pledgeName.indexOf("VIP") == 0 || pledgeName.indexOf("Referral") == 0); // TODO: Add UEE Towel and Omni Role Combat Armor (ORC) MK9 to this (May 09, 2014)
    this.isSpacePlant = (titlePartsFirst == "Space Plant");
    this.isSpaceGlobe = (titlePartsFirst == "Space Globes");
    this.isModel = (pledgeName.indexOf("Takuetsu") > -1) || (pledgeName.indexOf("Models - ") > -1);
    this.isFlair = $('.kind:contains(Hangar decoration)', this).length > 0;
    this.isDecoration = !this.isModel && !this.isPoster && this.isFlair && !this.isFishtank &&!this.isPlant;
    this.isComponent = $('.kind:contains(Component)', this).length > 0;
    this.isEquipment = $('.kind:contains(FPS Equipment)', this).length > 0;
    this.isWarbond = this.originalName.toLowerCase().indexOf('warbond') > -1 || this.originalName.toLowerCase().indexOf(' wb') > -1;
    this.isSelected = false;
    
    HangarXPLOR._shipCount += $ship.length;
    if (this.hasShip)    this.isAddOn = false;
    if (this.isUpgrade)  HangarXPLOR._upgradeCount += 1;
    if (this.isPackage)  HangarXPLOR._packageCount += 1;
    if (this.isGiftable) HangarXPLOR._giftableCount += 1;
    if (this.isWarbond)  HangarXPLOR._warbondCount += 1;
    if (this.hasLTI)     HangarXPLOR._ltiCount += 1;
    
    // Special case for Gladius and Gold referal reward
    if (titlePartsMiddle == 'Gladius and Gold') this.isFlair = this.isModel = this.isDecoration = true;
    if (titlePartsMiddle == 'Gimbals and Guns') this.isFlair = this.isDecoration = false;
    if (titlePartsMiddle == 'Badger and Badges') this.isFlair = false;
    
    if (this.isShip) {
      for (i = 0, j = HangarXPLOR._ships.length; i < j; i++) {
        if (this.shipName.toLowerCase().indexOf(HangarXPLOR._ships[i].name.toLowerCase()) > -1) {
          $('.basic-infos .image', this).css({ 'background-image': 'url("' + HangarXPLOR._ships[i].thumbnail + '")'});
          break;
        }
      }
    }

    if (this.isCombo) {
      HangarXPLOR.CleanComboShips($ship, debug);
    }
    
    if (this.isComponent && !this.hasShip) {
      for (i = 0, j = HangarXPLOR._components.length; i < j; i++) {
        if (this.componentName.toLowerCase().indexOf(HangarXPLOR._components[i].name.toLowerCase()) > -1) {
          $('.basic-infos .image', this).css({ 'background-image': 'url("' + HangarXPLOR._components[i].thumbnail + '")'});
          break;
        }
      }
    }
    
    $wrapper.append($("<div>", { class: 'date-col melt-col' }).append($('<label>', { text: 'Melt Value' }), this.pledgeValue));
    
    var ltiSuffix = this.hasLTI ? ' - LTI' : '';
    
    if (this.isSpaceGlobe) {
      titleParts = $('.title', this).text().split(' - ')
      titlePartsFirst = titleParts[0]
      titlePartsMiddle = titleParts.slice(1).join(' - ')
    }
    
    if (titleParts.length == 1) titlePartsMiddle = pledgeName;
    
    if (this.isShip) {
      titlePartsFirst = "Ship";
      titlePartsMiddle = this.shipName;
    } 
    if (this.isDecoration) titlePartsFirst = "Decoration";
    if (this.isModel) titlePartsFirst = "Model";
    if (this.isEquipment) titlePartsFirst = "Equipment";
    if (this.isComponent) titlePartsFirst = "Component";
    if ((this.isDecoration ? 1 : 0) +
        (this.isEquipment ? 1 : 0) +
        (this.isPaint ? 1 : 0) > 1)titlePartsFirst = "Loot";
    if (this.isCombo) titlePartsFirst = "Combo";
    if (this.isPackage) titlePartsFirst = "Package";
    if (this.isUpgrade) titlePartsFirst = "Upgrade";
    if (this.isReward) titlePartsFirst = "Reward";
    
    if (this.isUpgraded || this.isPackage || this.isReward || this.isCombo || this.isShip) {
      this.originalName = this.originalName
        .replace(/^(?:Standalone Ship|Package|Combo|Add-ons|Extras) - /, '')
        .replace(' lti', ' LTI');
      $wrapper.append($("<div>", { class: 'items-col pledge-col' }).append($('<label>', { text: 'Base Pledge' }), this.originalName));
    }
    
    this.displayName = titlePartsFirst + ' - ' + titlePartsMiddle
    
    if (this.hasShip) this.displayName += ltiSuffix

    if (HangarXPLOR._setting.NoPledgeID != true) this.displayName += ' (' + this.pledgeId + ')';

    this.sortName = this.displayName.replace(/^.*? - (.*)$/, '$1');
    
    if ($.cookie('noPrefix') == 'true')
      this.displayName = this.sortName;
      
    // console.log('ProcessItem this.displayName', this.displayName);
    h3Text.textContent = this.displayName;
    
  } else {
    HangarXPLOR.Log('Warning: Error parsing', this.innerHTML);
  }

  HangarXPLOR._inventory.push(this);
}
