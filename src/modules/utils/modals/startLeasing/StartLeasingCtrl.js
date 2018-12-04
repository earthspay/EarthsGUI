(function () {
    'use strict';

    /**
     * @param Base
     * @param $scope
     * @param {User} user
     * @param {app.utils} utils
     * @param {Earths} earths
     * @param {app.i18n} i18n
     * @return {StartLeasingCtrl}
     */
    const controller = function (Base, $scope, user, utils, earths, i18n) {

        const { SIGN_TYPE } = require('@earths/signature-adapter');
        const ds = require('data-service');

        class StartLeasingCtrl extends Base {

            constructor() {
                super($scope);
                this.step = 0;
                /**
                 * @type {string}
                 */
                this.title = i18n.translate('modal.startLease.title', 'app.utils');
                this.assetId = EarthsApp.defaultAssets.EARTHS;
                this.recipient = '';
                this.amount = null;

                /**
                 * @type {string}
                 */
                this.nodeListLink = EarthsApp.network.nodeList;

                earths.node.getFee({ type: EarthsApp.TRANSACTION_TYPES.NODE.LEASE })
                    .then((money) => {
                        this.fee = money;
                    });

                earths.node.assets.balance(this.assetId)
                    .then((balance) => {
                        this.balance = balance.available;
                    });
            }

            back() {
                this.step--;
            }

            sign() {
                const tx = earths.node.transactions.createTransaction({
                    recipient: this.recipient,
                    fee: this.fee,
                    amount: this.amount,
                    type: SIGN_TYPE.LEASE
                });

                return ds.signature.getSignatureApi().makeSignable({
                    type: tx.type,
                    data: tx
                });
            }

            next(signable) {
                this.signable = signable;
                this.step++;
            }

        }

        return new StartLeasingCtrl();
    };

    controller.$inject = ['Base', '$scope', 'user', 'utils', 'earths', 'i18n', 'modalManager', '$mdDialog'];

    angular.module('app.ui')
        .controller('StartLeasingCtrl', controller);
})();
