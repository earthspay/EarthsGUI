(function () {
    'use strict';

    const CARD_GATEWAYS = {
        [EarthsApp.defaultAssets.EARTHS]: 'EARTHS'
    };

    const PATH = `${EarthsApp.network.coinomat}/api/v2/indacoin`;

    // That is used to access values from `**/locales/*.json` files
    const KEY_NAME_PREFIX = 'coinomat';

    /**
     * @returns {CoinomatCardService}
     */
    const factory = function () {

        class CoinomatCardService {

            getAll() {
                return CARD_GATEWAYS;
            }

            /**
             * @param {Asset} crypto
             * @param {string} earthsAddress
             * @param {Array} fiatList
             * @return {*}
             */
            getFiatWithLimits(crypto, earthsAddress, fiatList) {
                CoinomatCardService._assertAsset(crypto);
                const to = CARD_GATEWAYS[crypto.id];
                return Promise.all(fiatList.map((fiat) => {
                    return this._loadBuyLimits(to, fiat.fiatCode, earthsAddress).then((limits) => {
                        return { ...fiat, ...limits };
                    });
                }));
            }

            /**
             * @param {Asset} crypto
             * @param {string} fiat
             * @param {string} earthsAddress
             * @param {number} fiatAmount
             * @return {Promise<number>}
             */
            getApproximateCryptoAmount(crypto, fiat, earthsAddress, fiatAmount) {
                CoinomatCardService._assertAsset(crypto);
                return $.get(`${PATH}/rate.php`, {
                    crypto: CARD_GATEWAYS[crypto.id],
                    fiat: fiat,
                    address: earthsAddress,
                    amount: fiatAmount
                });
            }

            /**
             * @param {Asset} crypto
             * @param {string} fiat
             * @param {string} earthsAddress
             * @param {number} fiatAmount
             * @return {string}
             */
            getCardBuyLink(crypto, fiat, earthsAddress, fiatAmount) {
                CoinomatCardService._assertAsset(crypto);
                const to = CARD_GATEWAYS[crypto.id];
                return `${PATH}/buy.php?crypto=${to}&fiat=${fiat}&address=${earthsAddress}&amount=${fiatAmount}`;
            }

            /**
             * @param {Asset} asset
             * @return {IGatewaySupportMap}
             */
            getSupportMap(asset) {
                if (CARD_GATEWAYS[asset.id]) {
                    return { card: true };
                }
            }

            getAssetKeyName(asset) {
                return `${KEY_NAME_PREFIX}${CARD_GATEWAYS[asset.id].gateway}`;
            }

            /**
             * @param {string} to
             * @param {string} from
             * @param {string} recipientAddress
             * @return {Promise<object>}
             * @private
             */
            _loadBuyLimits(to, from, recipientAddress) {
                return $.get(`${PATH}/limits.php`, { // TODO Refactor ro ds.fetch
                    crypto: to,
                    fiat: from,
                    address: recipientAddress
                }).then((res) => {
                    try {
                        return JSON.parse(res);
                    } catch (e) {
                        return {};
                    }
                });
            }

            static _assertAsset(assetId) {
                if (!CARD_GATEWAYS[assetId]) {
                    throw new Error('Asset is not supported by Coinomat');
                }
            }

        }

        return new CoinomatCardService();
    };

    angular.module('app.utils').factory('coinomatCardService', factory);
})();
