(function () {
    angular
        .module("DMS")
        .controller("SearchDBCtrl", SearchDBCtrl);

    SearchDBCtrl.$inject = ['GrocService', '$state'];

    function SearchDBCtrl(GrocService, $state) {
        var vm = this;

        vm.searchString = '';
        vm.result = null;

        vm.search = search;
        vm.goEdit = goEdit;

        // Initialize data
        init();
        function init() {
            GrocService
                .retrieveGrocDB('')
                .then(function (results) {
                    vm.groceries = results.data;
                })
                .catch(function (err) {
                    console.log("error " + err);
                });
        }

        // Click goEdit() params link
        function goEdit(clickedGrocNo) {
            console.log("editing");
            $state.go("editWithParam", { grocNo: clickedGrocNo });
        };

        // Click search() button
        function search() {
            GrocService
                // we pass contents of vm.searchString to service so that we can search the DB for this string
                .retrieveGrocDB(vm.searchString)
                .then(function (results) {
                    // The result returned by the DB contains a data object, which in turn contains the records read
                    // from the database
                    vm.groceries = results.data;
                })
                .catch(function (err) {
                    // We console.log the error. For a more graceful way of handling the error, see
                    // register.controller.js
                    console.log("error " + err);
                });
        }
    }
})();