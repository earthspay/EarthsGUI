(function () {
    'use strict';

    var MODULES_MAP = {
        'ts-utils': 'tsUtils',
        'bignumber.js': 'BigNumber',
        'ts-api-validator': 'tsApiValidator',
        'parse-json-bignumber': 'parseJsonBignumber',
        'papaparse': 'Papa',
        'earths-api': 'EarthsAPI',
        'identity-img': 'identityImg',
        '@earths/data-entities': 'dataEntities',
        '@earths/signature-generator': 'earthsSignatureGenerator',
        '@ledgerhq/hw-transport-u2f': 'TransportU2F',
        '@ledgerhq/hw-transport-node-hid': 'TransportU2F',
        '@earths/ledger': 'EarthsLedgerJs',
        '@earths/signature-adapter': 'earthsSignatureAdapter',
        'ramda': 'R',
        'data-service': 'ds',
        'handlebars': 'Handlebars',
        '@earths/earths-browser-bus': 'bus',
        'worker-wrapper': 'workerWrapper',
        '@earths/assets-pairs-order': 'OrderPairs'
    };

    function getModule(require) {
        return function (name) {
            if (name in MODULES_MAP && MODULES_MAP.hasOwnProperty(name)) {
                return tsUtils.get(window, MODULES_MAP[name]);
            } else if (require) {
                return require(name);
            } else {
                throw new Error('Not loaded module with name "' + name);
            }
        };
    }

    window.require = getModule(window.require);
})();
