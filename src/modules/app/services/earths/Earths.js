(function () {
    'use strict';

    /**
     * @param {Node} node
     * @param {Matcher} matcher
     * @param {EarthsUtils} earthsUtils
     * @param {app.utils} utils
     * @return {Earths}
     */
    const factory = function (node, matcher, earthsUtils, utils) {

        class Earths {

            constructor() {
                /**
                 * @type {Node}
                 */
                this.node = node;
                /**
                 * @type {Matcher}
                 */
                this.matcher = matcher;
                /**
                 * @type {EarthsUtils}
                 */
                this.utils = earthsUtils;
            }

        }

        return utils.bind(new Earths());
    };

    factory.$inject = ['node', 'matcher', 'earthsUtils', 'utils'];

    angular.module('app').factory('earths', factory);
})();
