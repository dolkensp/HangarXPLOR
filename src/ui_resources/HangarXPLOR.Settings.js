
var noPledgeID    = document.getElementById('noPledgeID');
var noPrefix      = document.getElementById('noPrefix');
var noNickname    = document.getElementById('noNickname');
var summaryValue  = document.getElementById('summaryValue');

// Load current settings and reflect them in the toggles
chrome.storage.sync.get(null, function(settings) {
    noPledgeID.checked   = settings._setting_NoPledgeID  || false;
    noPrefix.checked     = settings._setting_NoPrefix    || false;
    noNickname.checked   = settings._setting_NoNickname  || false;
    summaryValue.checked = (settings._feature_Summary    || 'cash') === 'cash';
});

// Save a setting and reload the active tab so it takes effect
function saveSetting(key, value) {
    var update = {};
    update[key] = value;
    chrome.storage.sync.set(update, function() {
        chrome.tabs.reload();
    });
}

noPledgeID.addEventListener('change',   function() { saveSetting('_setting_NoPledgeID', this.checked); });
noPrefix.addEventListener('change',     function() { saveSetting('_setting_NoPrefix',   this.checked); });
noNickname.addEventListener('change',   function() { saveSetting('_setting_NoNickname', this.checked); });
// Summary toggle updates the page instantly via storage.onChanged — no reload needed
summaryValue.addEventListener('change', function() {
    chrome.storage.sync.set({ _feature_Summary: this.checked ? 'cash' : 'count' });
});

// Clear cache
document.getElementById('clearCache').addEventListener('click', function() {
    chrome.storage.sync.get(null, function(settings) {
        settings._cacheSalt = btoa(Math.random());
        chrome.storage.sync.set(settings, function() {
            chrome.tabs.reload();
            window.close();
        });
    });
});

// Add, list, and remove user-trusted origins. Each add triggers chrome.permissions.request.
var trustedInput  = document.getElementById('trustedInput');
var trustedAdd    = document.getElementById('trustedAdd');
var trustedList   = document.getElementById('trustedList');
var trustedStatus = document.getElementById('trustedStatus');

// Normalize whatever the user typed to an origin pattern that chrome.permissions.request accepts.
//
// NOTE: Chrome's match-pattern grammar doesn't include port numbers — the hostname is taken from `url.hostname` (which
// strips the port) and the path is always normalized to `/*` (permissions are origin-scoped, not path-scoped). HTTP is
// allowed only for `localhost`; all other hosts must use HTTPS.
function normalizeOrigin(raw) {
    var trimmed = (raw || '').trim();
    if (trimmed.length === 0) return null;

    var url;
    try {
        // URL with no scheme throws; scheme-less inputs get https:// prepended.
        url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : 'https://' + trimmed);
    } catch (e) {
        return null;
    }

    if (url.hostname.length === 0) return null;

    var isLocalhost = url.hostname === 'localhost';

    if (url.protocol === 'https:') {
        return 'https://' + url.hostname + '/*';
    }

    if (url.protocol === 'http:' && isLocalhost) {
        return 'http://localhost/*';
    }

    return null;
}

function setStatus(message, kind) {
    trustedStatus.textContent = message || '';
    trustedStatus.className = 'trusted-status' + (kind ? ' ' + kind : '');
}

function readTrustedSites(callback) {
    chrome.storage.sync.get({ _setting_TrustedSites: [] }, function(settings) {
        callback(settings._setting_TrustedSites || []);
    });
}

function writeTrustedSites(sites, callback) {
    chrome.storage.sync.set({ _setting_TrustedSites: sites }, callback || function() {});
}

// Leading slash forces resolution from extension root on both browsers. Firefox otherwise resolves this relative to
// the popup's URL (moz-extension://.../ui_resources/), producing a 404.
var RELAY_SCRIPT_FILE = '/content_scripts/trusted-site-relay.js';
var RELAY_ID_PREFIX   = 'trusted-site-relay:';
var RSI_EXCLUDE = [
    'https://robertsspaceindustries.com/*',
    'https://*.robertsspaceindustries.com/*'
];

function relayIdForPattern(pattern) {
    return RELAY_ID_PREFIX + pattern;
}

function registerRelayForOrigin(pattern) {
    chrome.scripting.registerContentScripts([{
        id: relayIdForPattern(pattern),
        matches: [pattern],
        excludeMatches: RSI_EXCLUDE,
        js: [RELAY_SCRIPT_FILE],
        runAt: 'document_start',
        persistAcrossSessions: true,
        world: 'ISOLATED'
    }], function() {
        if (chrome.runtime.lastError) {
            // Apparently the most common cause of error is that the script is already installed. We will then try to
            // update instead.
            chrome.scripting.updateContentScripts([{
                id: relayIdForPattern(pattern),
                matches: [pattern],
                excludeMatches: RSI_EXCLUDE,
                js: [RELAY_SCRIPT_FILE],
                runAt: 'document_start'
            }]);
        }
    });
}

function unregisterRelayForOrigin(pattern) {
    chrome.scripting.unregisterContentScripts({ ids: [relayIdForPattern(pattern)] });
}

// Walk the trusted-sites list and make sure every entry has a relay registered, and no orphan relays remain for 
// origins that are no longer trusted. Runs after reconcileAndRender writes the storage.
function syncRelayRegistrations(trustedPatterns) {
    chrome.scripting.getRegisteredContentScripts({}, function(registered) {
        if (chrome.runtime.lastError) return;

        var wantedSet = {};
        trustedPatterns.forEach(function(p) { wantedSet[relayIdForPattern(p)] = p });

        var haveSet = {};
        registered.forEach(function(s) {
            if (s.id && s.id.indexOf(RELAY_ID_PREFIX) === 0) haveSet[s.id] = true;
        });

        // Register any wanted-but-missing.
        Object.keys(wantedSet).forEach(function(id) {
            if (!haveSet[id]) registerRelayForOrigin(wantedSet[id]);
        });

        // Unregister any registered-but-unwanted.
        var toUnregister = Object.keys(haveSet).filter(function(id) { return !wantedSet[id] });
        if (toUnregister.length > 0) {
            chrome.scripting.unregisterContentScripts({ ids: toUnregister });
        }
    });
}

// Reconcile our stored trusted-sites list with Chrome's actual granted origins. Runs on every popup open and catches 
// drift against Chrome's list of trusted sites for the extension (i.e. chrome://extensions/?id=<hangarXPLOR_id> sites)
function reconcileAndRender() {
    chrome.permissions.getAll(function(perms) {
        var chromeOrigins = (perms.origins || []).filter(function(o) {
            return o.indexOf('robertsspaceindustries.com') === -1;
        });

        readTrustedSites(function(storedSites) {
            // Chrome is source of truth
            var storedSet = {};
            storedSites.forEach(function(o) { storedSet[o] = true });
            var chromeSet = {};
            chromeOrigins.forEach(function(o) { chromeSet[o] = true });

            var needsWrite = false;
            if (chromeOrigins.length !== storedSites.length) {
                needsWrite = true;
            } else {
                for (var i = 0; i < chromeOrigins.length; i++) {
                    if (!storedSet[chromeOrigins[i]]) { needsWrite = true; break }
                }
            }

            var renderFromStorage = function() {
                trustedList.innerHTML = '';

                if (chromeOrigins.length === 0) {
                    var empty = document.createElement('li');
                    empty.className = 'trusted-empty';
                    empty.textContent = 'No trusted sites yet.';
                    trustedList.appendChild(empty);
                    return;
                }

                chromeOrigins.forEach(function(origin) {
                    var li = document.createElement('li');
                    li.className = 'trusted-row';

                    var label = document.createElement('span');
                    label.className = 'trusted-origin';
                    label.textContent = origin;
                    label.title = origin;

                    var remove = document.createElement('button');
                    remove.className = 'trusted-remove';
                    remove.textContent = 'Remove';
                    remove.addEventListener('click', function() { removeTrusted(origin); });

                    li.appendChild(label);
                    li.appendChild(remove);
                    trustedList.appendChild(li);
                });
            };

            if (needsWrite) {
                writeTrustedSites(chromeOrigins, renderFromStorage);
            } else {
                renderFromStorage();
            }

            // Keep relay registrations in sync with the reconciled list.
            syncRelayRegistrations(chromeOrigins);
        });
    });
}

// Backward-compat alias for existing call sites.
var renderTrustedList = reconcileAndRender;

function addTrusted() {
    var pattern = normalizeOrigin(trustedInput.value);

    if (pattern === null) {
        setStatus('Enter an https origin (e.g. https://example.com) — or http://localhost for development.', 'error');
        return;
    }

    setStatus('Requesting ' + pattern + ' ...');

    chrome.permissions.request({ origins: [pattern] }, function(granted) {
        if (chrome.runtime.lastError) {
            setStatus(chrome.runtime.lastError.message || 'Permission request failed.', 'error');
            return;
        }

        if (!granted) {
            setStatus('Permission declined.', 'error');
        }

    });
}

function removeTrusted(pattern) {
    // Revoke the permission; onRemoved listener handles storage + render
    chrome.permissions.remove({ origins: [pattern] }, function(removed) {
        if (chrome.runtime.lastError) {
            setStatus(chrome.runtime.lastError.message || 'Permission remove failed.', 'error');
            return;
        }

        if (!removed) {
            // Permission wasn't held (user revoked it externally). Fall through to storage cleanup — onRemoved won't
            // fire because there was nothing to remove from Chrome's perspective.
            readTrustedSites(function(sites) {
                writeTrustedSites(sites.filter(function(o) { return o !== pattern }), function() {
                    setStatus('Removed from list (permission was already revoked)', 'success');
                    renderTrustedList();
                });
            });
        }
        // removed === true: onRemoved listener will clean storage + render.
    });
}

// Extension-scope permission events — fire regardless of which context initiated the request, and critically, survive
// the popup being torn down by Chrome's native permission dialog
chrome.permissions.onAdded.addListener(function(permissions) {
    if (!permissions.origins || permissions.origins.length === 0) return;

    readTrustedSites(function(sites) {
        var added = [];
        permissions.origins.forEach(function(origin) {
            if (sites.indexOf(origin) === -1) {
                sites.push(origin);
                added.push(origin);
            }
        });
        if (added.length === 0) return;
        writeTrustedSites(sites, function() {
            trustedInput.value = '';
            setStatus('Added ' + added.join(', '), 'success');
            renderTrustedList();
            // Register the relay for each newly-added origin.
            added.forEach(registerRelayForOrigin);
        });
    });
});

chrome.permissions.onRemoved.addListener(function(permissions) {
    if (!permissions.origins || permissions.origins.length === 0) return;

    readTrustedSites(function(sites) {
        var removedSet = {};
        permissions.origins.forEach(function(origin) { removedSet[origin] = true });
        var filtered = sites.filter(function(o) { return !removedSet[o] });
        if (filtered.length === sites.length) return;
        writeTrustedSites(filtered, function() {
            setStatus('Removed ' + permissions.origins.join(', '), 'success');
            renderTrustedList();
            // Unregister relays for origins that lost their grant.
            permissions.origins.forEach(unregisterRelayForOrigin);
        });
    });
});

trustedAdd.addEventListener('click', addTrusted);
trustedInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') addTrusted();
});

renderTrustedList();
