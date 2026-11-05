
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR._shipCount     = HangarXPLOR._shipCount || 0;
HangarXPLOR._upgradeCount  = HangarXPLOR._upgradeCount || 0;
HangarXPLOR._giftableCount = HangarXPLOR._giftableCount || 0;
HangarXPLOR._packageCount  = HangarXPLOR._packageCount || 0;
HangarXPLOR._ltiCount      = HangarXPLOR._ltiCount || 0;
HangarXPLOR._warbondCount  = HangarXPLOR._warbondCount || 0;
HangarXPLOR._raw           = HangarXPLOR._raw || [];

// RSI lists many items (armor pieces, paints in packs, hangars...) without any .kind; infer one from the title
// so packs made only of such items still land in a category. Words are checked in this order.
HangarXPLOR._inferredKinds = [
  { kind: 'Skin',              pattern: /\b(paints?|livery|liveries|skins?)\b/i },
  { kind: 'Hangar',            pattern: /\bhangar$/i },
  { kind: 'Component',         pattern: /\b(repeater|cannon|scattergun|gatling|missile|torpedo|turret|shield generator|cooler|power plant|quantum drive)s?\b/i },
  { kind: 'FPS Equipment',     pattern: /\b(helmets?|head ?gear|mask|hood|core|arms|legs|backpack|undersuit|armou?r|suit|jumpsuit|outfit|uniform|vest|jacket|coat|sweater|shirt|t-shirt|pants|boots?|gloves?|hat|rifle|pistol|smg|shotgun|sniper|lmg|crossbow|knife|grenade|magazine|ammo|optic|scope|telescopic|multi-?tool|salvage tool|medical device|attachment|canister)\b/i },
  { kind: 'Hangar decoration', pattern: /\b(model|hologram|poster|trophy|statue|plush|plushie|bear|figurine|painting|plant|flag|rug|lamp|coin|chair|bed|chest|dice|die|display|prop|container|skull)\b/i },
];

HangarXPLOR.InferKinds = function()
{
  $('.item', this).each(function() {
    if ($('.kind', this).length > 0) return;
    var $title = $('.title', this);
    var title = $title.text().trim();
    for (var i = 0, j = HangarXPLOR._inferredKinds.length; i < j; i++) {
      if (HangarXPLOR._inferredKinds[i].pattern.test(title)) {
        // Same nesting as RSI's own items (.item > .text > .title + .kind), which the Parse* functions rely on
        if (!$title.parent().hasClass('text')) $title.wrap('<div class="text"></div>');
        $title.after($('<div>', { class: 'kind inferred', text: HangarXPLOR._inferredKinds[i].kind }));
        return;
      }
    }
  });
}

// One unexpected pledge must not stop the rest of the hangar from loading
HangarXPLOR.SafeParsePledge = function()
{
  try {
    HangarXPLOR.ParsePledge.apply(this, arguments);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('HangarXPLOR: could not fully parse a pledge, showing it unclassified', e, this);

    // ParsePledge only adds the pledge to the inventory as its last step, so a failure would hide it.
    // Keep it visible under All Types, with the fields that filtering, sorting and bulk totals rely on.
    if (HangarXPLOR._inventory.indexOf(this) === -1) {
      this.filters = this.filters || {};
      this.filters.is_selected = false;
      if (typeof this.melt_value !== 'number' || this.melt_value !== this.melt_value) this.melt_value = 0;
      this.displayName = this.displayName || $('.js-pledge-name', this).val() || '';
      this.sortName = this.sortName || this.displayName;
      HangarXPLOR._inventory.push(this);
    }
  }
}

// Apply a pre-defined filter to a list of items
HangarXPLOR.ParsePledge = function()
{
  // Pre-cache raw markup
  if (HangarXPLOR._fromCache != true) HangarXPLOR._raw.push(this.outerHTML);

  var pledgeName  = $('.js-pledge-name', this).val() || '';
  var $wrapper    = $('.wrapper-col', this);
  
  var h3Text     = $('.title-col h3', this)[0];

  if (pledgeName.length > 0) {

    pledgeName = pledgeName.replace(/ {2}/gi, " ")
                           .replace(/^add-ons - /i, '')
                           .replace(/^standalone ship - /i, '')
                           .replace(/^combo - /i, '')
                           .replace(/^package - /i, '')
                           .replace(/^ship upgrades - /i, '')
                           .replace(/^extras - /i, '')
                           .replace(/^paints - /i, '')
                           .trim();

    this.filters                 = {};

    this.pledge_type             = 'pledge';
    this.pledge_name             = pledgeName;
    this.pledge_id               = parseInt($('.js-pledge-id', this).val().trim());
    this.pledge_cost             = $('.js-pledge-value', this).val();
    this.displayName             = pledgeName;

    pledgeName = pledgeName.toLowerCase();

    HangarXPLOR.InferKinds.apply(this);
    HangarXPLOR.PreProcess.apply(this, [ pledgeName ]);
    HangarXPLOR.ParseShip.apply(this, [ pledgeName ]);
    HangarXPLOR.ParseComponent.apply(this, [ pledgeName ]);
    HangarXPLOR.ParseEquipment.apply(this, [ pledgeName ]);
    HangarXPLOR.ParseSkin.apply(this, [ pledgeName ]);
    HangarXPLOR.ParseDecoration.apply(this, [ pledgeName ]);
    HangarXPLOR.ParseUpgrade.apply(this, [ pledgeName ]);
    HangarXPLOR.ParseReward.apply(this, [ pledgeName ]);
    HangarXPLOR.ParseCoupon.apply(this, [ pledgeName ]);
    HangarXPLOR.ParseHangar.apply(this, [ pledgeName ]);

    this.melt_value              = parseFloat(this.pledge_cost.replace("$", "").replace(",", "").replace(" USD", ""));
    if (this.melt_value != this.melt_value) this.melt_value = 0; // NaN safety

    this.filters.has_squadron    = $('.title:contains(Squadron 42 Digital Download)', this).length > 0;
    this.filters.has_starcitizen = $('.title:contains(Star Citizen Digital Download)', this).length > 0;
    this.filters.is_warbond      = this.pledge_name.toLowerCase().indexOf(' warbond') > -1 || this.pledge_name.toLowerCase().indexOf(' wb') > -1 || this.pledge_name.toLowerCase().indexOf(' war bond') > -1;
    this.filters.is_meltable     = $('.js-reclaim', this).length > 0;
    this.filters.is_giftable     = $('.label:contains(Gift)', this).length > 0 && this.melt_value <= 1000;
    this.filters.is_package      = this.filters.has_squadron || this.filters.has_starcitizen;
    this.filters.has_value       = this.melt_value > 0;

    // TODO: Support for js-pledge-configuration-value
    
    this.filters.is_selected     = false;

    if (this.filters.is_ship)             this.pledge_type = 'ship';
    else if (this.filters.has_ship)       this.pledge_type = 'combo';
    else if (this.filters.has_component)  this.pledge_type = 'component';
    else if (this.filters.has_equipment)  this.pledge_type = 'equipment';
    else if (this.filters.has_skin)       this.pledge_type = 'skin';
    else if (this.filters.has_decoration) this.pledge_type = 'decoration';
    else if (this.filters.is_upgrade)     this.pledge_type = 'upgrade';
    else if (this.filters.is_coupon)      this.pledge_type = 'coupon';

    if (!this.filters.has_ship &&
        (this.filters.has_skin ? 1 : 0) +
        (this.filters.has_equipment ? 1 : 0) +
        (this.filters.has_component ? 1 : 0) +
        (this.filters.has_decoration ? 1 : 0) > 1) this.pledge_type = 'loot';
    
    if (this.filters.is_package)  HangarXPLOR._packageCount += 1;
    if (this.filters.is_giftable) HangarXPLOR._giftableCount += 1;
    
    var prefix = HangarXPLOR._setting.NoPrefix   ? '' : this.pledge_type + ' - ';
    var suffix = HangarXPLOR._setting.NoPledgeID ? '' : ' (' + this.pledge_id + ')';
    this.displayName = prefix + this.displayName + suffix;
    
    $wrapper.append($("<div>", { class: 'date-col melt-col' }).append($('<label>', { text: 'Melt Value: ' }), this.pledge_cost));
    $wrapper.append($("<div>", { class: 'items-col pledge-col' }).append($('<label>', { text: 'Base Pledge: ' }), this.pledge_name));
    
    this.sortName = this.displayName;
    // Replace only the title's text: RSI puts elements in it too (Upgrades log button, game access tags)
    $(h3Text).contents().filter(function() { return this.nodeType === 3; }).remove();
    h3Text.insertBefore(document.createTextNode(this.displayName + ' '), h3Text.firstChild);
    
    // if ($('.basic-infos .image', this).css('background-image') == 'url("https://cdn.robertsspaceindustries.com/static/images/Temp/default-image.png")' &&
    //     $('.items .image', this).length > 0)
    // {
    //     $('.basic-infos .image', this).css({ 'background-image': $($('.items .image', this)[0]).css('background-image') });
    // }
    
  } else {
    HangarXPLOR.Log('Warning: Error parsing', this.innerHTML);
  }

  HangarXPLOR._inventory.push(this);
}
