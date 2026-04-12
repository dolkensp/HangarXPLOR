#!/usr/bin/env node
/**
 * Refreshes src/web_resources/ship-codes.json from the RSI ship matrix API.
 *
 * New entries are derived from the live API. Legacy entries (codes that no
 * longer exist in the API, e.g. pre-rename Aurora variants) are preserved at
 * the end of the file for backwards compatibility with existing hangar items.
 *
 * Manufacturer names are taken from the existing file where available, so
 * any local formatting preferences are not overwritten by the API values.
 *
 * Usage:
 *   node scripts/refresh-ship-codes.js
 */

const fs   = require('fs');
const path = require('path');
const https = require('https');

const OUTPUT_PATH = path.join(__dirname, '../src/web_resources/ship-codes.json');
const API_URL     = 'https://robertsspaceindustries.com/ship-matrix/index';

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { Accept: 'application/json' } }, (res) => {
      let raw = '';
      res.on('data', (chunk) => { raw += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(raw)); }
        catch (e) { reject(new Error(`JSON parse failed: ${e.message}`)); }
      });
    }).on('error', reject);
  });
}

async function main() {
  // Load existing data
  const existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8'));
  const existingByCode = Object.fromEntries(existing.map(e => [e.ship_code, e]));

  // Build manufacturer name map from existing file so local formatting is preserved
  const existingMfrs = {};
  for (const entry of existing) {
    existingMfrs[entry.manufacturer_code] = entry.manufacturer_name;
  }

  // Fetch live data
  console.log(`Fetching ${API_URL} ...`);
  const apiData = await fetchJSON(API_URL);
  const apiShips = apiData.data || [];
  console.log(`  ${apiShips.length} ships returned by API`);

  // Build new entries
  const newEntries = [];
  const newCodes   = new Set();

  for (const ship of apiShips) {
    const urlSlug   = ship.url.split('/').pop();
    const mfrCode   = ship.manufacturer.code;
    const shipCode  = `${mfrCode}_${urlSlug.replace(/-/g, '_')}`;
    const mfrName   = existingMfrs[mfrCode] ?? ship.manufacturer.name;

    newEntries.push({
      ship_code:         shipCode,
      ship_name:         ship.name,
      manufacturer_code: mfrCode,
      manufacturer_name: mfrName,
    });
    newCodes.add(shipCode);
  }

  // Append legacy entries whose codes no longer appear in the API
  const legacyEntries = existing.filter(e => !newCodes.has(e.ship_code));
  console.log(`  ${legacyEntries.length} legacy entries preserved`);

  const merged = [...newEntries, ...legacyEntries];
  console.log(`  ${merged.length} total entries`);

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(merged, null, 2) + '\n', 'utf8');
  console.log(`Written to ${OUTPUT_PATH}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
