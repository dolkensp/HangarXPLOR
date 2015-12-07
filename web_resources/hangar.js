
!function() {
  var items = [];
  var $list;
  
  // List of thumbnails
  var ships = [
    { 'name': '300i', 'thumbnail': '/media/ep375pda2jer7r/heap_infobox/300i_storefront_visual.jpg' },
    { 'name': '315p', 'thumbnail': '/media/o34z1cyxt1um8r/heap_infobox/315p_storefront_visual.jpg' },
    { 'name': '325a', 'thumbnail': '/media/gdol1g9fswvjcr/heap_infobox/325a_storefront_visual.jpg' },
    { 'name': '350r', 'thumbnail': '/media/52nrmwl43g1cor/heap_infobox/350r_storefront_visual.jpg' },
    { 'name': '890 JUMP', 'thumbnail': '/media/aokcb6ay0i0jpr/heap_infobox/890_beautyShot-Concept_V01High_NF_140709.jpg' },
    { 'name': 'Aurora CL', 'thumbnail': '/media/fh1gtu93mndsur/heap_infobox/Rsi_aurora_cl_storefront_visual.jpg' },
    { 'name': 'Aurora ES', 'thumbnail': '/media/9u8061zhf29fir/heap_infobox/Rsi_aurora_es_storefront_visual.jpg' },
    { 'name': 'Aurora LN', 'thumbnail': '/media/ljgowkr9tdwetr/heap_infobox/Rsi_aurora_ln_storefront_visual.jpg' },
    { 'name': 'Aurora LX', 'thumbnail': '/media/xfq27owiysn6ar/heap_infobox/Aurora-LX_Ortho.jpg' },
    { 'name': 'Aurora MR', 'thumbnail': '/media/ohbfgn1ebcsnar/heap_infobox/Rsi_aurora_mr_storefront_visual.jpg' },
    { 'name': 'Avenger Stalker', 'thumbnail': '/media/3dx8jqsd79dmpr/heap_infobox/Avenger_storefront_visualjpg.jpg' },
    { 'name': 'Avenger Titan', 'thumbnail': '/media/cg2gcecohj7s6r/heap_infobox/Avenger_cargo_right.jpg' },
    { 'name': 'Avenger Warlock', 'thumbnail': '/media/qcv2n7ms9qwj8r/heap_infobox/Avenger_EMP_02.jpg' },
    { 'name': 'Carrack', 'thumbnail': '/media/u248nf7opb5bhr/heap_infobox/Carrack_Landed_Final_Gurmukh.png' },
    { 'name': 'Caterpillar', 'thumbnail': '/media/wde7ozthdqjnxr/heap_infobox/Cat-Model-Render4.jpg' },
    { 'name': 'Constellation Andromeda', 'thumbnail': '/media/vzyhde6cjgsn7r/heap_infobox/Andromeda_Storefront.jpg' },
    { 'name': 'Constellation Aquila', 'thumbnail': '/media/u0pbc9k058nuhr/heap_infobox/Aquila_Storefront.jpg' },
    { 'name': 'Constellation Phoenix', 'thumbnail': '/media/0o9gi8gbsm178r/heap_infobox/Phoenix_Storefront.jpg' },
    { 'name': 'Constellation Taurus', 'thumbnail': '/media/3vj4o4l5uggk7r/heap_infobox/Taurus-Storefront.jpg' },
    { 'name': 'Crucible', 'thumbnail': '/media/vxj1ppzl3xmhdr/heap_infobox/AnvilcrucibleREARMAINTENANCE.jpg' },
    { 'name': 'Cutlass Black', 'thumbnail': '/media/7tcxllnna6a9hr/heap_infobox/Drake_cutlass_storefront_visual.jpg' },
    { 'name': 'Cutlass Blue', 'thumbnail': '/media/8d5ywktt23231r/heap_infobox/Blue-WR-Orth_000000.jpg' },
    { 'name': 'Cutlass Red', 'thumbnail': '/media/anznazc3gf5oar/heap_infobox/Slide_Cut-Red.jpg' },
    { 'name': 'Endeavor', 'thumbnail': '/media/vh2jbjaom7ys4r/heap_infobox/CO_Beauty_BioDomes.jpg' },
    { 'name': 'F7C-M Super Hornet', 'thumbnail': '/media/4otqgybm0y38ur/heap_infobox/F7c-M_super-Hornet_storefront_visual.jpg' },
    { 'name': 'F7C-R Hornet Tracker', 'thumbnail': '/media/5f5hxp2dp3b69r/heap_infobox/F7c-R_hornet-Tracker_storefront_visual.jpg' },
    { 'name': 'F7C-S Hornet Ghost', 'thumbnail': '/media/d7l12zt956s62r/heap_infobox/F7cs_hornet_ghost_storefront_visual.jpg' },
    { 'name': 'F7C Hornet', 'thumbnail': '/media/m6e374a9zb7dlr/heap_infobox/F7c_hornet_storefront_visual.jpg' },
    { 'name': 'Freelancer', 'thumbnail': '/media/ts39qbhy6x38pr/heap_infobox/Freelancer_storefront_visual.jpg' },
    { 'name': 'Freelancer DUR', 'thumbnail': '/media/gui7c4ac9u4v3r/heap_infobox/Freelancer_dur_storefront_visual.jpg' },
    { 'name': 'Freelancer MAX', 'thumbnail': '/media/pd2zoaytunmrkr/heap_infobox/Freelancer_max_storefront_visual.jpg' },
    { 'name': 'Freelancer MIS', 'thumbnail': '/media/yie4k1qvzqqr0r/heap_infobox/Freelancer_mis_storefront_visual.jpg' },
    { 'name': 'Genesis', 'thumbnail': '/media/iqk7vt4xay0zfr/heap_infobox/Starliner_action1_runwaycompFlat.jpg' },
    { 'name': 'Gladiator', 'thumbnail': '/media/ye6hvyo93oc2ar/heap_infobox/Gladiator-WB_FrontLeft.jpg' },
    { 'name': 'Gladius', 'thumbnail': '/media/b623f9bkn0c3ur/heap_infobox/Gladius_Front_Perspective.jpg' },
    { 'name': 'Glaive', 'thumbnail': '/media/ygnjk175atmcer/heap_infobox/Vanduul_glaive_viz3.jpg' },
    { 'name': 'Herald', 'thumbnail': '/media/rq2gv7b4b3id0r/heap_infobox/Herald-1.jpg' },
    { 'name': 'Hull A', 'thumbnail': '/media/tpw5r365mowmar/heap_infobox/Hull_A_Final.jpg' },
    { 'name': 'Hull B', 'thumbnail': '/media/xg8d8kyo0bjsmr/heap_infobox/HullB_landedcompv3b.jpg' },
    { 'name': 'Hull C', 'thumbnail': '/media/w54u21vkhci5vr/heap_infobox/Hull_C_Final.jpg' },
    { 'name': 'Hull D', 'thumbnail': '/media/wox7k753a2pn6r/heap_infobox/Hull_D_Blueprint.jpg' },
    { 'name': 'Hull E', 'thumbnail': '/media/xyt1qu08sjmy3r/heap_infobox/Hull_E_3_compflat.jpg' },
    { 'name': 'Idris-M', 'thumbnail': '/media/rfjjekm57en5jr/heap_infobox/IDRISdownfrontquarter_copy.jpg' },
    { 'name': 'Idris-P', 'thumbnail': '/media/rfjjekm57en5jr/heap_infobox/IDRISdownfrontquarter_copy.jpg' },
    { 'name': 'Javelin', 'thumbnail': '/media/nzqi87nkarvupr/heap_infobox/Javelin-Sale.jpg' },
    { 'name': 'Khartu-Al', 'thumbnail': '/media/zzycyqkpn9vu8r/heap_infobox/Image_landed.jpg' },
    { 'name': 'M50', 'thumbnail': '/media/xfs6elgejzxz9r/heap_infobox/M50_new_comp47.jpg' },
    { 'name': 'Merchantman', 'thumbnail': '/media/63lxivb7mi3vzr/heap_infobox/Banu_merchantman_side_Version_A.jpg' },
    { 'name': 'Mustang Alpha', 'thumbnail': '/media/ssh2spko70pz6r/heap_infobox/Alpha-Front.jpg' },
    { 'name': 'Mustang Beta', 'thumbnail': '/media/ltw03c5rli6uwr/heap_infobox/Beta-Front.jpg' },
    { 'name': 'Mustang Delta', 'thumbnail': '/media/dtqy8jpl0f9cbr/heap_infobox/Delta-Front.jpg' },
    { 'name': 'Mustang Gamma', 'thumbnail': '/media/yu4cuzh90oz54r/heap_infobox/Gamma-Front.jpg' },
    { 'name': 'Mustang Omega', 'thumbnail': '/media/gmru9y7ynd1bbr/heap_infobox/Omega-Front.jpg' },
    { 'name': 'Orion', 'thumbnail': '/media/hfpnkupg7gr6er/heap_infobox/RSI_Orion_Situ1b_150219_GH.jpg' },
    { 'name': 'P-52 Merlin', 'thumbnail': '/media/a9231ysz5cnvor/heap_infobox/Top.jpg' },
    { 'name': 'P-72 Archimedes', 'thumbnail': '/media/xqgbgw3x6o54ir/heap_infobox/Archimedes_Front_01.jpg' },
    { 'name': 'Reclaimer', 'thumbnail': '/media/627hob4lwqt3xr/heap_infobox/Image002-1.jpg' },
    { 'name': 'Redeemer', 'thumbnail': '/media/t0opqw0tauo45r/heap_infobox/Red1.jpg' },
    { 'name': 'Reliant', 'thumbnail': '/media/jjs1n85qx4u7br/heap_infobox/Reliant_LandingInsitu_Final_Hobbins.png' },
    { 'name': 'Retaliator Base', 'thumbnail': '/media/bp86xpkhi47etr/heap_infobox/Retaliator_engine_shot_a.jpg' },
    { 'name': 'Retaliator Bomber', 'thumbnail': '/media/kz6mu0tt0u06er/heap_infobox/Retaliator-Ortho_v2.jpg' },
    { 'name': 'Sabre', 'thumbnail': '/media/wnqvrpoomrpp6r/heap_infobox/Concept_citcon2015_5.jpg' },
    { 'name': 'Scythe', 'thumbnail': '/media/wdtdkzl0x31ver/heap_infobox/Vanduul-Scythe_storefront_visual.jpg' },
    { 'name': 'Starfarer', 'thumbnail': '/media/k4f44vqnex0m1r/heap_infobox/SF-Chris-O-2.jpg' },
    { 'name': 'Starfarer Gemini', 'thumbnail': '/media/4pgpl7n71hijzr/heap_infobox/Gemini2338.jpg' },
    { 'name': 'Vanguard Harbinger', 'thumbnail': '/media/c5vioobscp9vkr/heap_infobox/02.jpg' },
    { 'name': 'Vanguard Sentinel', 'thumbnail': '/media/qqmzhgb7ra29xr/heap_infobox/03.jpg' },
    { 'name': 'Vanguard Warden', 'thumbnail': '/media/4bnuwyj849f3hr/heap_infobox/Vanguard_34_final_Bachiller_02.png' },
];
  
  /*********************************************
   * Loads all pages of your hangar, to enable *
   * custom filtering and sorting of inventory *
   *********************************************/
  function getPages(pageNo) {
    $.ajax({
      url: '/account/pledges?page=' + pageNo + '&pagesize=100', 
      method: 'GET', 
      success: function(html) {
        var $page = $(html);
        
        var $lists = $('.list-items', $page);
        
        if ($lists.length == 2)
        {
          var $items = $('li', $lists[1]);
          
          $items.each(insertItem);
          
          if ($items.length < 100)
            initialize();
          else
            getPages(pageNo + 1)
        } else {
          initialize();
        }
      }
    });
  }
  
  function createFilter(options, width) {
    
    width = width || "150px";
    
    var $ul = $('<ul class="body" style="display: none" />');
    var $style = $('<div class="js-selectlist selectlist" />');
    var $label = $('<span>' + options[0].Text + '</span>');
    var $value = $('<input type="hidden" class="js-custom-filter" value="' + options[0].Value + '" />');
    var $filter = $('<div style="width: ' + width + '">');
    
    for (var i = 0, j = options.length; i < j; i++)
      $ul.append('<li class="js-option option ' + (options[i].Class || '') + '" rel="' + options[i].Value + '">' + options[i].Text + '</li>');
    var $options = $('li', $ul);
    
    $filter.append($style);
    $style.append('<div class="arrow" />');
    $style.append($label);
    $style.append($ul);
    $style.append($value);
    
    $filter.bind('click', function() { $ul.toggle(); });
    $options.bind('mouseover', function() { $(this).addClass('hover'); });
    $options.bind('mouseout', function() { $(this).removeClass('hover'); });
    $options.bind('click', function() {
      var $this = $(this);
        
      var nextFilter = $this.attr('rel');
      
      $options.removeClass('selected');
      $options.removeClass('hover');
      $this.addClass('selected');
      
      if ($value.val() != nextFilter) {
        $value.val(nextFilter);
        $label.text($this.text());
        render('.js-custom-filter');
      }
      
      $('ul.body').hide();
      
      return false;
    });
    
    return $filter;
  }
  
  function initialize() {
    var $controls = $('.controls');
    $controls.empty();
    
    $('.js-pager').remove();
    
    var $typeFilter = createFilter([
      { Value: 'All', Text: 'All Types', Class: 'selected first' },
      { Value: 'HasShip', Text: 'Ships + Packages' },
      { Value: 'IsShip', Text: 'Ships' },
      { Value: 'IsPackage', Text: 'Packages' },
      { Value: 'IsExtra', Text: 'All Extras', Class: 'split' },
      { Value: 'IsUpgrade', Text: 'Upgrades' },
      { Value: 'IsAddOn', Text: 'Add Ons' },
      { Value: 'IsComponent', Text: 'Components' },
      { Value: 'IsFlair', Text: 'All Flair', Class: 'split' },
      { Value: 'IsDecoration', Text: 'Decorations' },
      { Value: 'IsPoster', Text: 'Posters' },
      { Value: 'IsModel', Text: 'Models' },
      { Value: 'IsReward', Text: 'Rewards' },
    ], "160px");
    
    var $featureFilter = createFilter([
      { Value: 'All', Text: 'All Features', Class: 'selected first' },
      { Value: 'HasLTI', Text: 'LTI' },
      { Value: 'IsGiftable', Text: 'Giftable' },
      { Value: 'HasValue', Text: 'Valuable' },
      { Value: 'IsUpgraded', Text: 'Upgraded' },
    ], "140px");
    
    $controls.append($typeFilter, $featureFilter);
    
    render('.js-custom-filter');
    
    $(document.body).append('<style>.js-inventory h3 { margin-top: -5px !important } .first { border-bottom: 3px double #162a3f } .split { border-top: 1px solid #162a3f; }</style>');
  }
  
  /*********************************************
   * Modified DOM of loaded item and stores it *
   * for use in filtering and sorting later    *
   *********************************************/
  function insertItem() {
    var $ship = $('.kind:contains(Ship)', this);
    var $wrapper = $('.wrapper-col', this);
    
    var h3Text = $('h3', this).contents().filter(function() { return this.nodeType == 3 && this.nodeValue.trim().length > 0 })[0];
    
    var pledgeName = $('.js-pledge-name', this).val();
    var pledgeId = $('.js-pledge-id', this).val();
    
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
      for (var i = 0, j = ships.length; i < j; i++) {
        if (this.shipName.toLowerCase().indexOf(ships[i].name.toLowerCase()) > -1) {
          $('.basic-infos .image', this).css({ 'background-image': 'url("' + ships[i].thumbnail + '")'});
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

    items.push(this);
  }
  
  function filter(items, filter) {
    
    console.log('Filtering on', filter);
    
    switch (filter) {
      case "HasLTI":
        items = $.grep(items, function(item) { return item.hasLTI; });
        break;
      case "IsGiftable":
        items = $.grep(items, function(item) { return item.isGiftable; });
        break;
      case "IsShip":
        items = $.grep(items, function(item) { return item.isShip; });
        break;
      case "HasShip":
        items = $.grep(items, function(item) { return item.hasShip; });
        break;
      case "IsPackage":
        items = $.grep(items, function(item) { return item.isPackage; });
        break;
      case "IsUpgrade":
        items = $.grep(items, function(item) { return item.isUpgrade; });
        break;
      case "IsUpgraded":
        items = $.grep(items, function(item) { return item.isUpgraded; });
        break;
      case "IsAddOn":
        items = $.grep(items, function(item) { return item.isAddOn; });
        break;
      case "IsExtra":
        items = $.grep(items, function(item) { return item.isAddOn || item.isUpgrade; });
        break;
      case "IsFlair":
        items = $.grep(items, function(item) { return item.isFlair; });
        break;
      case "HasValue":
        items = $.grep(items, function(item) { return item.hasValue; });
        break;
      case "IsModel":
        items = $.grep(items, function(item) { return item.isModel; });
        break;
      case "IsPoster":
        items = $.grep(items, function(item) { return item.isPoster; });
        break;
      case "IsDecoration":
        items = $.grep(items, function(item) { return item.isDecoration; });
        break;
      case "IsComponent":
        items = $.grep(items, function(item) { return item.isComponent; });
        break;
      case "IsReward":
        items = $.grep(items, function(item) { return item.isReward; });
        break;
    }
    
    return items;
  }
  
  /*********************************************
   * Renders the list of inventory, according  *
   * to the currently selected filters         *
   *********************************************/
  function render(filterSelector) {
    
    console.log('Rendering', filterSelector);
    
    var filtered = items;
    
    
    $(filterSelector).each(function() { filtered = filter(filtered, $(this).val()); });
    
    if (filtered.length == 0)
      filtered.push($('<h4 class="empy-list">Your hangar is empty.</h4>'));
      
    $list.empty();
    $list.append(filtered);
  }
  
  var $lists = $('.list-items');
  
  if ($lists.length == 2) {
    $list = $($lists[1]);
    $list.addClass('js-inventory');
    delete $lists;
    getPages(1);
  }
}();
