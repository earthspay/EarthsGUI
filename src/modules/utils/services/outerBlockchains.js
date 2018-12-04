(function () {
    'use strict';

    const REGEX = {
        [EarthsApp.defaultAssets.BTC]: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
        [EarthsApp.defaultAssets.ETH]: /^0x[0-9a-f]{40}$/i,
        [EarthsApp.defaultAssets.LTC]: /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/,
        [EarthsApp.defaultAssets.ZEC]: /^t[0-9a-z]{34}$/i,
        [EarthsApp.defaultAssets.BCH]: /^([13][a-km-zA-HJ-NP-Z1-9]{25,34}|[qp][a-zA-Z0-9]{41})$/,
        [EarthsApp.defaultAssets.DASH]: /^X[a-km-zA-HJ-NP-Z1-9]{25,34}$/,
        [EarthsApp.defaultAssets.XMR]: /^([a-km-zA-HJ-NP-Z1-9]{95}|[a-km-zA-HJ-NP-Z1-9]{106})$/
    };

    const factory = function () {
        return Object.keys(REGEX).reduce((result, key) => {
            result[key] = {
                isValidAddress(string) {
                    return REGEX[key].test(string);
                }
            };
            return result;
        }, Object.create(null));
    };

    angular.module('app.utils').factory('outerBlockchains', factory);
})();

/**
 * @typedef {function} IIsValidAddress
 * @param {string} address
 * @return {boolean}
 */

/**
 * @typedef {Object.<string, IIsValidAddress>} IOuterBlockchains
 */
