(function () {
    'use strict';

    /**
     *
     * @param Base
     * @param {$rootScope.Scope} $scope
     * @param {ExplorerLinks} explorerLinks
     * @param {Earths} earths
     * @param {IPollCreate} createPoll
     * @return {TransactionInfoCtrl}
     */
    const controller = function (Base, $scope, explorerLinks, earths, createPoll) {

        class TransactionInfoCtrl extends Base {

            constructor({ transactionId }) {
                super($scope);

                this.timer = null;
                this.id = transactionId;
                this._getData();
            }

            $onDestroy() {
                super.$onDestroy();
                clearTimeout(this.timer);
            }

            _getData() {
                earths.node.transactions.getAlways(this.id)
                    .then((transaction) => {
                        if (!transaction.isUTX) {
                            return earths.node.height().then((height) => ({
                                confirmations: height - transaction.height,
                                transaction
                            }));
                        } else {
                            return {
                                confirmations: -1,
                                transaction
                            };
                        }
                    })
                    .then(({ transaction, confirmations }) => {

                        this.transaction = transaction;
                        this.signable = ds.signature.getSignatureApi().makeSignable({
                            type: transaction.type,
                            data: transaction
                        });
                        this.confirmations = confirmations;
                        this.confirmed = !transaction.isUTX;
                        this.explorerLink = explorerLinks.getTxLink(transaction.id);
                        createPoll(this, this._getHeight, this._setHeight, 1000);

                        $scope.$apply();
                    })
                    .catch(() => {
                        clearTimeout(this.timer);
                        this.timer = setTimeout(() => this._getData(), 2000);

                        $scope.$apply();
                    });
            }

            /**
             * @return {Promise<Array>}
             * @private
             */
            _getHeight() {
                const promiseList = [earths.node.height()];
                if (!this.confirmed) {
                    promiseList.push(earths.node.transactions.getAlways(this.id));
                }
                return Promise.all(promiseList);
            }

            /**
             * @param {number} height
             * @param tx
             * @private
             */
            _setHeight([height, tx]) {
                if (tx) {
                    Object.assign(this.transaction, tx);
                    this.confirmed = !tx.isUTX;
                    if (!this.confirmed) {
                        this.confirmations = 0;
                    } else {
                        this.confirmations = height - tx.height;
                    }
                } else {
                    this.confirmations = height - this.transaction.height;
                }
                $scope.$apply();
            }

        }

        return new TransactionInfoCtrl(this.locals);
    };

    controller.$inject = ['Base', '$scope', 'explorerLinks', 'earths', 'createPoll'];

    angular.module('app.utils').controller('TransactionInfoCtrl', controller);
})();
