(function () {
    'use strict';

    const SEPA_GATEWAYS = {
        [EarthsApp.defaultAssets.USD]: 'USD',
        [EarthsApp.defaultAssets.EUR]: 'EUR',
        [EarthsApp.defaultAssets.TRY]: 'TRY'
    };

    const KNOWLEDGE_BASE = `${EarthsApp.network.support}/forums/2-knowledge-base/topics`;
    const SEPA_COUNTRIES_URL = `${KNOWLEDGE_BASE}/1304-list-of-accepted-countries-and-documents-for-verification`;

    const ID_NOW_SITE_URL = 'https://idnow.eu';
    const ID_NOW_PATH = 'https://go.idnow.de/coinomat/userdata';

    // That is used to access values from `**/locales/*.json` files
    const KEY_NAME_PREFIX = 'coinomatSepa';

    /**
     * @returns {CoinomatSepaService}
     */
    const factory = function () {

        class CoinomatSepaService {

            getAll() {
                return SEPA_GATEWAYS;
            }

            /**
             * @param {Asset} asset
             * @param {string} earthsAddress
             * @return {Promise}
             */
            getSepaDetails(asset, earthsAddress) {
                CoinomatSepaService._assertAsset(asset.id);
                return Promise.resolve({
                    listOfEligibleCountries: SEPA_COUNTRIES_URL,
                    idNowSiteUrl: ID_NOW_SITE_URL,
                    idNowUserLink: `${ID_NOW_PATH}/${earthsAddress}`
                });
            }

            /**
             * @param {Asset} asset
             * @return {IGatewaySupportMap}
             */
            getSupportMap(asset) {
                if (SEPA_GATEWAYS[asset.id]) {
                    return { sepa: true };
                }
            }

            getAssetKeyName(asset) {
                return `${KEY_NAME_PREFIX}${SEPA_GATEWAYS[asset.id]}`;
            }

            static _assertAsset(assetId) {
                if (!SEPA_GATEWAYS[assetId]) {
                    throw new Error('Asset is not supported by Coinomat SEPA');
                }
            }

        }

        return new CoinomatSepaService();
    };

    angular.module('app.utils').factory('coinomatSepaService', factory);
})();
