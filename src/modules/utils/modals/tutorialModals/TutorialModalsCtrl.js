(function () {
    'use strict';

    const controller = function (Base, $scope) {

        class TutorialModalsCtrl extends Base {

            constructor() {
                super($scope);
                this.isDesktop = EarthsApp.isDesktop();
                this.isWeb = EarthsApp.isWeb();
            }

        }

        return new TutorialModalsCtrl();
    };

    controller.$inject = ['Base', '$scope'];

    angular.module('app.utils').controller('TutorialModalsCtrl', controller);
})();
