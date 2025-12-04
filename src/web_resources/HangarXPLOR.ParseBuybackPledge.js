
var HangarXPLOR = HangarXPLOR || {};

/**
 * Parses a buyback pledge item from the DOM
 * Called with 'this' context set to the pledge <li> element
 */
HangarXPLOR.ParseBuybackPledge = function() {
  // Cache raw HTML for later caching
  if (HangarXPLOR._fromCache != true) {
    HangarXPLOR._buybackRaw.push(this.outerHTML);
  }

  // Initialize filters object
  this.filters = {};

  // Parse title: "Type - Name" from h1 element
  var title = $('h1', this).text().trim();
  var dashIndex = title.indexOf(' - ');
  this.buyback_type = dashIndex > -1 ? title.substring(0, dashIndex).trim() : 'Unknown';
  this.buyback_name = dashIndex > -1 ? title.substring(dashIndex + 3).trim() : title;

  // Normalize type names to standard plural forms (matching dropdown options)
  var typeNormalization = {
    'Standalone Ship': 'Standalone Ships',
    'Upgrade': 'Upgrades',
    'Package': 'Game Packages',
    'Component': 'Components',
    'Weapon': 'Weapons'
  };
  if (typeNormalization[this.buyback_type]) {
    this.buyback_type = typeNormalization[this.buyback_type];
  }

  // Parse last modified date from dl
  var $dl = $('dl', this);
  var $lastModifiedDt = $dl.find('dt').filter(function() {
    return $(this).text().trim() === 'Last Modified';
  });
  this.last_modified = $lastModifiedDt.next('dd').text().trim();

  // Parse contained items from dl
  var $containedDt = $dl.find('dt').filter(function() {
    return $(this).text().trim() === 'Contained';
  });
  this.contained = $containedDt.next('dd').text().trim();

  // Parse pledge ID from buyback link
  var $buybackLink = $('a.holosmallbtn', this);
  var href = $buybackLink.attr('href') || '';
  var match = href.match(/\/pledge\/buyback\/(\d+)/);
  this.pledge_id = match ? parseInt(match[1]) : 0;

  // Set filter flags based on type (types are already normalized to standard forms)
  this.filters.is_ship = this.buyback_type === 'Standalone Ships';
  this.filters.is_paint = this.buyback_type === 'Paints';
  this.filters.is_addon = this.buyback_type === 'Add-Ons';
  this.filters.is_subscriber = this.buyback_type.indexOf('Subscribers') > -1;
  this.filters.is_upgrade = this.buyback_type === 'Upgrades';
  this.filters.is_package = this.buyback_type === 'Game Packages';
  this.filters.is_component = this.buyback_type === 'Components';
  this.filters.is_weapon = this.buyback_type === 'Weapons';
  this.filters.is_hangar_decoration = this.buyback_type === 'Hangar Decorations';
  this.filters.is_flair = this.buyback_type === 'Subscriber Flair';

  // For sorting and display
  this.sortName = this.buyback_name.toLowerCase();
  this.displayName = this.buyback_type + ' - ' + this.buyback_name;

  // Update counts
  HangarXPLOR._buybackCounts.total++;
  if (this.filters.is_ship) HangarXPLOR._buybackCounts.ships++;
  else if (this.filters.is_paint) HangarXPLOR._buybackCounts.paints++;
  else if (this.filters.is_upgrade) HangarXPLOR._buybackCounts.upgrades++;
  else if (this.filters.is_package) HangarXPLOR._buybackCounts.packages++;
  else if (this.filters.is_addon) HangarXPLOR._buybackCounts.addons++;
  else if (this.filters.is_component) HangarXPLOR._buybackCounts.components++;
  else if (this.filters.is_weapon) HangarXPLOR._buybackCounts.weapons++;
  else if (this.filters.is_hangar_decoration) HangarXPLOR._buybackCounts.decorations++;
  else if (this.filters.is_subscriber || this.filters.is_flair) HangarXPLOR._buybackCounts.subscriber++;
  else HangarXPLOR._buybackCounts.other++;

  // Add to buyback inventory
  HangarXPLOR._buybackInventory.push(this);
};
