(function () {
    'use strict';

    const PATH = 'modules/ui/directives/transaction/types';
    const tsUtils = require('ts-utils');
    const { Money } = require('@earths/data-entities');

    /**
     * @param Base
     * @param $filter
     * @param {ModalManager} modalManager
     * @param {INotification} notification
     * @param {Earths} earths
     * @param {User} user
     * @param {BaseAssetService} baseAssetService
     * @param {DexService} dexService
     * @param {$rootScope.Scope} $scope
     * @return {Transaction}
     */
    const controller = function (Base, $filter, modalManager, notification,
                                 earths, user, baseAssetService, dexService, $scope) {

        const { SIGN_TYPE } = require('@earths/signature-adapter');

        class Transaction extends Base {

            $postLink() {

                this.templateUrl = `${PATH}/${this.transaction.templateType}.html`;
                this.time = $filter('date')(this.transaction.timestamp, this.datePattern || 'HH:mm');
                this.shownAddress = this.transaction.shownAddress;
                this.typeName = this.transaction.typeName;
                this.isScam = !!EarthsApp.scam[this.transaction.assetId];

                if (this.transaction.amount && this.transaction.amount instanceof ds.earthsDataEntities.Money) {
                    baseAssetService.convertToBaseAsset(this.transaction.amount)
                        .then((baseMoney) => {
                            this.mirrorBalance = baseMoney;
                            $scope.$digest();
                        });
                }

                const TYPES = earths.node.transactions.TYPES;

                switch (this.typeName) {
                    case TYPES.BURN:
                    case TYPES.ISSUE:
                    case TYPES.REISSUE:
                        this.tokens();
                        break;
                    case TYPES.EXCHANGE_BUY:
                    case TYPES.EXCHANGE_SELL:
                        this.exchange();
                        break;
                    case TYPES.SPONSORSHIP_START:
                    case TYPES.SPONSORSHIP_STOP:
                        this.sponsored();
                        break;
                    case TYPES.SPONSORSHIP_FEE:
                        this.sponsoredFee();
                        break;
                    default:
                }
            }

            sponsoredFee() {
            }

            sponsored() {
                this.sponsorshipFee = this.transaction.minSponsoredAssetFee;
                this.titleAssetName = this.getAssetName(
                    tsUtils.get(this.transaction, 'minSponsoredAssetFee.asset')
                );
            }

            exchange() {
                this.totalPrice = dexService.getTotalPrice(this.transaction.amount, this.transaction.price);
            }

            tokens() {
                this.titleAssetName = this.getAssetName(
                    tsUtils.get(this.transaction, 'amount.asset') ||
                    tsUtils.get(this.transaction, 'quantity.asset') ||
                    this.transaction
                );
                this.name = tsUtils.get(
                    this.transaction, 'amount.asset.name') ||
                    tsUtils.get(this.transaction, 'quantity.asset.name'
                    );

                const amount = tsUtils.get(this.transaction, 'amount') || tsUtils.get(this.transaction, 'quantity');
                if (amount instanceof Money) {
                    this.amount = amount.toFormat();
                } else {
                    this.amount = amount.div(Math.pow(10, this.transaction.precision));
                }
            }

            /**
             * @param {{id: string, name: string}} asset
             * @return {string}
             */
            getAssetName(asset) {
                try {
                    return !EarthsApp.scam[asset.id] ? asset.name : '';
                } catch (e) {
                    return '';
                }
            }

            cancelLeasing() {
                const lease = this.transaction;
                const leaseId = lease.id;
                return earths.node.getFee({ type: EarthsApp.TRANSACTION_TYPES.NODE.CANCEL_LEASING })
                    .then((fee) => {
                        const tx = earths.node.transactions.createTransaction({
                            fee,
                            type: SIGN_TYPE.CANCEL_LEASING,
                            lease,
                            leaseId
                        });
                        const signable = ds.signature.getSignatureApi().makeSignable({
                            type: tx.type,
                            data: tx
                        });
                        return modalManager.showConfirmTx(signable);
                    });
            }

            showTransaction() {
                modalManager.showTransactionInfo(this.transaction.id);
            }

            /**
             * return {string}
             */
            getCopyAllData() {
                const tx = this.transaction;

                const id = `Transaction ID: ${tx.id}`;
                const type = `Type: ${tx.type} (${this.typeName})`;

                const timestamp = $filter('date')(tx.timestamp, 'MM/dd/yyyy HH:mm');
                const datetime = `Date: ${timestamp}`;

                let sender = `Sender: ${tx.sender}`;
                if (tx.typeName === EarthsApp.TRANSACTION_TYPES.NODE.EXCHANGE) {
                    sender += ' (matcher address)';
                }

                let message = `${id}\n${type}\n${datetime}\n${sender}`;

                if (tx.typeName === EarthsApp.TRANSACTION_TYPES.EXTENDED.UNKNOWN) {
                    message += '\n\nRAW TX DATA BELOW\n\n';
                    message += JSON.stringify(tx, null, 2);
                    return message;
                }

                if (tx.recipient) {
                    const recipient = `Recipient: ${tx.recipient}`;
                    message += `\n${recipient}`;
                }

                if (tx.amount && tx.amount instanceof ds.earthsDataEntities.Money) {
                    const asset = tx.amount.asset;
                    const amount = `Amount: ${tx.amount.toFormat()} ${asset.name} (${asset.id})`;
                    message += `\n${amount}`;
                }

                if (this.typeName === EarthsApp.TRANSACTION_TYPES.EXTENDED.EXCHANGE_BUY ||
                    this.typeName === EarthsApp.TRANSACTION_TYPES.EXTENDED.EXCHANGE_SELL) {
                    const asset = tx.price.asset;
                    const price = `Price: ${tx.price.toFormat()} ${asset.name} (${asset.id})`;
                    const totalPrice = `Total price: ${this.totalPrice} ${asset.name}`;
                    message += `\n${price}\n${totalPrice}`;
                }

                if (this.typeName === EarthsApp.TRANSACTION_TYPES.EXTENDED.DATA) {
                    message += '\n\n\nDATA START';
                    message += `\n\n${tx.stringifiedData}`;
                    message += '\n\nDATA END\n\n';
                }

                const fee = `Fee: ${tx.fee.toFormat()} ${tx.fee.asset.name} (${tx.fee.asset.id})`;
                message += `\n${fee}`;

                return message;
            }

        }

        return new Transaction();
    };

    controller.$inject = [
        'Base',
        '$filter',
        'modalManager',
        'notification',
        'earths',
        'user',
        'baseAssetService',
        'dexService',
        '$scope'
    ];

    angular.module('app.ui')
        .component('wTransaction', {
            bindings: {
                datePattern: '@',
                transaction: '<'
            },
            require: {
                parent: '^wTransactionList'
            },
            templateUrl: 'modules/ui/directives/transaction/transaction.html',
            transclude: false,
            controller
        });
})();
