// Registered via chrome.scripting.registerContentScripts for each origin the user has added to their Trusted Sites 
// list. Runs at document_start on those pages. Its entire job:
// 1. Listen for window.postMessage events of shape { type: 'HangarXPLOR:request', requestId }
// 2. Read the most recent hangar snapshot from chrome.storage.local.
// 3. Reply via window.postMessage with { type: 'HangarXPLOR:response', requestId, status, data }

(function() {
    'use strict';

    var TRUSTED_SITES_KEY = '_setting_TrustedSites';
    var SNAPSHOT_KEY      = 'cache:parsed_export';
    var MSG_REQUEST       = 'HangarXPLOR:request';
    var MSG_RESPONSE      = 'HangarXPLOR:response';

    function currentOriginPattern() {
        var hostname = window.location.hostname;
        var protocol = window.location.protocol;
        if (hostname.length === 0) return null;
        if (protocol === 'https:') return 'https://' + hostname + '/*';
        if (protocol === 'http:' && hostname === 'localhost') return 'http://localhost/*';
        return null;
    }

    function isCurrentOriginTrusted(callback) {
        var pattern = currentOriginPattern();
        if (pattern === null) { callback(false); return; }
        var query = {};
        query[TRUSTED_SITES_KEY] = [];
        chrome.storage.sync.get(query, function(settings) {
            var sites = settings[TRUSTED_SITES_KEY] || [];
            callback(sites.indexOf(pattern) !== -1);
        });
    }

    function readSnapshot(callback) {
        chrome.storage.local.get(SNAPSHOT_KEY, function(items) {
            callback(items[SNAPSHOT_KEY] || null);
        });
    }

    function respond(requestId, status, payload) {
        var message = { type: MSG_RESPONSE, requestId: requestId, status: status };
        if (status === 'ok') {
            message.data = payload;
        } else {
            message.error = payload;
        }
        window.postMessage(message, window.location.origin);
    }

    window.addEventListener('message', function(event) {
        if (event.source !== window) return;

        var data = event.data;
        if (!data || typeof data !== 'object') return;
        if (data.type !== MSG_REQUEST) return;
        if (typeof data.requestId !== 'string' || data.requestId.length === 0) return;

        var requestId = data.requestId;

        isCurrentOriginTrusted(function(trusted) {
            if (!trusted) {
                respond(requestId, 'error', 'not_trusted');
                return;
            }

            readSnapshot(function(snapshot) {
                if (!snapshot) {
                    respond(requestId, 'error', 'no_data');
                    return;
                }
                respond(requestId, 'ok', snapshot);
            });
        });
    });
})();
