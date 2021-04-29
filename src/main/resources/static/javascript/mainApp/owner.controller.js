(function () {

    /**
     * This controller contains functions specific to the groupings page.
     * @param $scope - binding between controller and HTML page
     * @param $controller - service for instantiating controllers
     * @param groupingsService - service for creating requests to the groupings API
     * @param dataProvider
     */
    function OwnerJsController($scope, $controller, groupingsService, dataProvider) {

        angular.extend(this, $controller("GeneralJsController", { $scope: $scope }));

        /**
         * Initialize function that retrieves the groupings you own.
         */
        $scope.init = function () {
            $scope.loading = true;

            groupingsService.getGroupingsOwned(function (res) {
                $scope.groupingsList = _.sortBy(res, "name");

                //How to access current User's privileges, Admins can access these hidden paths.
                //Using filter alongside with getSyncDestList to find and update groupingsList with paths that are not hidden.
                $scope.groupingsList = _.filter($scope.groupingsList, function(item) {
                    groupingsService.getSyncDestList(item.path, function(res) {
                        if (!JSON.parse(res[0].description).hidden) {
                            return item;
                        }
                        }, function () {
                        $scope.loading = false;
                        $scope.createApiErrorModal();
                    });
                });

                $scope.pagedItemsGroupings = $scope.groupToPages($scope.groupingsList);
                $scope.loading = false;
            }, function (res) {
                dataProvider.handleException({ exceptionMessage: JSON.stringify(res, null, 4) }, "feedback/error", "feedback");
            });
        };

        /**
         * Copy the path of a grouping through the clipboard button
         * @param {Object} grouping - the current selected grouping
         */
        $scope.copyPath = function (grouping) {
            $("[data-content='copy']").popover("hide");

            $("[data-content='copied!']").popover();
            setTimeout(function () {
                $("[data-content='copied!']").popover("hide");
            }, 1000);

            let copyText = document.getElementById(grouping.path);
            copyText.select();
            document.execCommand("copy");
        };

        /**
         * Toggle 'copy' popover when clipboard is being hovered.
         */
        $scope.hoverCopy = function () {
            $("[data-content='copy']").popover();
        };
    }

    UHGroupingsApp.controller("OwnerJsController", OwnerJsController);
}());
