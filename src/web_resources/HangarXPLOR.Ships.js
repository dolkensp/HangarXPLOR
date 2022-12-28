
var HangarXPLOR = HangarXPLOR || {};

/* Overrides for the ship matrix */
/*******************************
 * key:         The name as expected from ship-matrix (if different)
 * name:        The name as expected from hangar
 * displayName: The name as displayed by HangarXPLOR
 * thumbnail:   The thumbnail displayed by HangarXPLOR
 * export:      Redirect export to another populated ship profile
 * 
 * url:         The url of the details page
 * focus:       The focus of the ship
 */
HangarXPLOR._ships = {
  'X1 Base': {
    name: 'X1'
  },
  'F7A Hornet': {
    thumbnail: ''
  },
  'F7C Hornet': {
    name: 'Hornet F7C',
    displayName: 'F7C Hornet',
    export: 'F7C Hornet'
  },
  'F8A Lightning': {
    focus: 'Heavy Fighter',
    export: 'F8C Lightning',
    url: 'https://robertsspaceindustries.com/galactapedia/article/bZwQ7r6nkE-f8a-lightning',
    // thumbnail: 'https://cig-galactapedia-prod.s3.amazonaws.com/upload/07841eb5-c02a-49b6-a422-2fc5449f8580'
  },
  'F8C Lightning Civilian': {
    displayName: 'F8C Lightning: Civilian',
    export: 'F8C Lightning'
    // thumbnail: '/media/6yu51ic3y27b6r/heap_infobox/F8C.png'
  },
  'F8C Lightning Executive Edition': {
    displayName: 'F8C Lightning: Executive Edition',
    export: 'F8C Lightning'
    // thumbnail: '/media/ldeqyuto9lb46r/heap_infobox/F8C-Executive.png'
  },
  'A1 Spirit': {
    name: 'A1 Spirit',
    export: 'Spirit A1'
  },
  'C1 Spirit': {
    name: 'C1 Spirit',
    export: 'Spirit C1'
  },
  'E1 Spirit': {
    name: 'E1 Spirit',
    export: 'Spirit E1'
  },
  'A2 Hercules': {
    name: 'Hercules Starlifter A2'
  },
  'C2 Hercules': {
    name: 'Hercules Starlifter C2'
  },
  'M2 Hercules': {
    name: 'Hercules Starlifter M2'
  },
  'Genesis': {
    name: 'Genesis Starliner',
    export: 'Genesis Starliner'
  },
  'Mercury': {
    name: 'Mercury Star Runner',
    export: 'Mercury Star Runner'
  },
  'Caterpillar Pirate Edition': {
    name: 'Caterpillar Pirate',
    displayName: 'Caterpillar Pirate Edition',
    export: 'Caterpillar Pirate'
  },
  'Pirate Gladius': {
    name: 'Pirate Gladius',
    displayName: 'Gladius Pirate Edition',
    export: 'Gladius Pirate'
  },
  '600i Explorer': {
    name: '600i Exploration Module',
    export: '600i'
  },
  '600i Touring': {
    name: '600i Touring Module',
    export: '600i Touring'
  },
  'Argo Mole Talus Edition': {
    name: 'Argo Mole - Talus Edition',
    displayName: 'Mole: Talus Edition',
    export: 'MOLE Talus'
  },
  'Argo Mole Carbon Edition': {
    name: 'Argo Mole - Carbon Edition',
    displayName: 'Mole: Carbon Edition',
    export: 'MOLE Carbon'
  },
  'Scythe': {
    name: 'Captured Vanduul Scythe',
    displayName: 'Scythe',
    export: 'Scythe'
  },
  'Valkyrie Liberator Edition': {
    name: 'Valkyrie Liberator Edition',
    displayName: 'Valkyrie: Liberator Edition',
    export: 'Valkyrie Liberator'
  },
  'Nautilus Solstice Edition': {
    export: 'Nautilus Solstice'
  },
};
