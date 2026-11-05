
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR.ParseShip = function()
{
  var $ship = $('.kind:contains(Ship)', this).parent().parent();

  this.filters.is_ship      = $ship.length == 1;
  this.filters.has_ship     = $ship.length >= 1;

  this.nickname             = $.map($('.custom-name-text', this), $.text).join(", ");
  this.serial               = $.map($('.liner:contains(Serial:)', this), $.text).join(", ").replace(/Serial: /gi, '');

  this.filters.is_lti       = $('.title:contains(Lifetime Insurance)', this).length > 0;
  this.filters.is_upgraded  = $('.upgraded', this).length > 0;
  this.filters.is_nameable  = $('.contains-nameable', this).length > 0;
  this.filters.is_combo     = $ship.length > 1;
  this.filters.has_serial   = this.serial.length > 0;
  this.filters.has_nickname = this.nickname.length > 0;

  if (this.filters.is_ship)
  {
    this.ship_name          = $('.title', $ship).text()
                                                .replace(/ (- )?lti/i, '')
                                                .replace(/ (- )?warbond edition/i, '')
                                                .replace(/ (- )?warbond/i, '')
                                                .replace(/ (- )?war bond/i, '')
                                                .replace(/ promo wb/i, '');
    
    var found = false;
    var i, j;
    for (i = 0, j = HangarXPLOR._shipMatrix.length; i < j; i++) {
      if (this.ship_name.toLowerCase().indexOf(HangarXPLOR._shipMatrix[i].name.toLowerCase()) > -1) {

        HangarXPLOR.Log('Matched', HangarXPLOR._shipMatrix[i].name, 'in', this.ship_name);

        this.ship_name = (HangarXPLOR._shipMatrix[i].displayName || HangarXPLOR._shipMatrix[i].name);
        found = true;
        // Use the matrix image, which is usually newer than an old pledge's, except where RSI's own image likely
        // shows a paint bundled with the pledge ("Hermes plus Tripline Paint"). CCU'd pledges and RSI's placeholder
        // always get the matrix image: RSI's image then shows the original hull, or nothing.
        var imageStyle = $('.basic-infos .image', this).attr('style') || '';
        var ownImage = imageStyle.indexOf('url(') > -1 && !/default-image/.test(imageStyle);
        var hasPaint = $('.kind:contains(Skin)', this).length > 0 || /\b(paints?|livery|liveries|skins?)\b/i.test(this.pledge_name || '');
        if (HangarXPLOR._shipMatrix[i].thumbnail != undefined && (this.filters.is_upgraded || !ownImage || !hasPaint)) {
          $('.basic-infos .image', this).css({ 'background-image': 'url("' + HangarXPLOR._shipMatrix[i].thumbnail + '")'});
        }
        break;
      }
    }

    if (!found) {
      HangarXPLOR.Log('Unmatched', this.ship_name.toLowerCase());
    }
    
    this.displayName = this.ship_name;
    if (this.filters.has_nickname && !HangarXPLOR._setting.NoNickname) this.displayName = this.nickname;
    if (this.filters.is_lti) this.displayName += ' - LTI';
  }
  else if (this.filters.is_combo)
  {
    this.displayName = this.displayName.replace(/ (- )?lti/i, '')
                                        .replace(/ (- )?warbond edition/i, '')
                                        .replace(/ (- )?warbond/i, '')
                                        .replace(/ (- )?war bond/i, '')
                                        .replace(/ promo wb/i, '')
                                        .replace(/ - .*/, '');
    
    // TODO: _shipMatrix style lookup for packages

    if (this.filters.is_lti) this.displayName += ' - LTI';
  }

  HangarXPLOR._shipCount += $ship.length;
}
