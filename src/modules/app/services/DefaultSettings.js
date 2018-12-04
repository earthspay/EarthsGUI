(function () {
    'use strict';

    /**
     * @name app.defaultSetting
     */

    /**
     * @param {app.utils} utils
     * @return {app.defaultSetting}
     */
    const factory = function (utils) {

        class DefaultSettings {

            constructor(settings) {
                /**
                 * @private
                 */
                this.settings = settings;
                /**
                 * @type {Signal}
                 */
                this.change = new tsUtils.Signal();
                /**
                 * @private
                 */
                this.defaults = {
                    advancedMode: false,
                    network: EarthsApp.network,
                    lastOpenVersion: '',
                    whatsNewList: [],
                    withScam: false,
                    scamListUrl: EarthsApp.network.scamListUrl,
                    shareAnalytics: false,
                    logoutAfterMin: 5,
                    encryptionRounds: 5000,
                    savePassword: true,
                    hasBackup: true,
                    termsAccepted: true,
                    baseAssetId: EarthsApp.defaultAssets.USD,
                    events: Object.create(null),
                    lng: 'en',
                    send: {
                        defaultTab: 'singleSend'
                    },
                    pinnedAssetIdList: [
                        EarthsApp.defaultAssets.EARTHS,
                        EarthsApp.defaultAssets.BTC,
                        EarthsApp.defaultAssets.ETH,
                        EarthsApp.defaultAssets.USD,
                        EarthsApp.defaultAssets.EUR,
                        EarthsApp.defaultAssets.LTC,
                        EarthsApp.defaultAssets.ZEC,
                        EarthsApp.defaultAssets.BCH,
                        EarthsApp.defaultAssets.TRY,
                        EarthsApp.defaultAssets.DASH,
                        EarthsApp.defaultAssets.XMR
                    ],
                    wallet: {
                        activeState: 'assets',
                        assets: {
                            chartMode: 'month',
                            activeChartAssetId: EarthsApp.defaultAssets.EARTHS,
                            chartAssetIdList: [
                                EarthsApp.defaultAssets.EARTHS,
                                EarthsApp.defaultAssets.BTC,
                                EarthsApp.defaultAssets.ETH
                            ]
                        },
                        transactions: {
                            filter: 'all'
                        },
                        portfolio: {
                            spam: [],
                            filter: 'active'
                        }
                    },
                    dex: {
                        chartCropRate: 1.5,
                        assetIdPair: {
                            amount: EarthsApp.defaultAssets.EARTHS,
                            price: EarthsApp.defaultAssets.BTC
                        },
                        watchlist: {
                            showOnlyFavorite: false,
                            favourite: [
                                [EarthsApp.defaultAssets.EARTHS, EarthsApp.defaultAssets.BTC]
                            ],
                            activeTab: 'all',
                            list: Object.values(EarthsApp.defaultAssets)
                        },
                        layout: {
                            watchlist: {
                                collapsed: false
                            },
                            orderbook: {
                                collapsed: false
                            },
                            tradevolume: {
                                collapsed: true
                            }
                        }
                    }
                };
            }

            get(path) {
                const setting = tsUtils.get(this.settings, path);
                return tsUtils.isEmpty(setting) ? tsUtils.get(this.defaults, path) : setting;
            }

            set(path, value) {
                if (utils.isEqual(this.get(path), value)) {
                    return null;
                }
                if (utils.isEqual(tsUtils.get(this.defaults, path), value)) {
                    tsUtils.unset(this.settings, path);
                } else {
                    tsUtils.set(this.settings, path, value);
                }
                this.change.dispatch(path);
            }

            getSettings() {
                return this.settings;
            }

        }

        return {
            /**
             * @name app.defaultSettings#create
             * @param {object} settings
             * @return {DefaultSettings}
             */
            create(settings) {
                return new DefaultSettings(settings);
            }
        };
    };

    factory.$inject = ['utils'];

    angular.module('app')
        .factory('defaultSettings', factory);
})();
