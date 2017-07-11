(function () {
    'use strict';
    angular
        .module("DMS")
        .controller("EditCtrl", EditCtrl);

    EditCtrl.$inject = ["$filter", "GrocService", "$stateParams"];

    function EditCtrl($filter, GrocService, $stateParams) {
        var vm = this;

        vm.id = "";
        vm.result = {};

        vm.initDetails = initDetails;
        vm.search = search;
        vm.toggleEditor = toggleEditor;
        vm.updateGrocName = updateGrocName;

        // Initialize grocery data view
        initDetails();
        function initDetails() {
            console.log("-- show.controller.js > initDetails()");
            vm.result.id = "";
            vm.result.name = "";
            vm.result.upc12 = "";
            vm.result.brand = "";
            vm.showDetails = false;
            vm.isEditorOn = false;
        }

        // Pass groceries params
        if ($stateParams.id) {
            console.log("passing info" + $stateParams.grocNo)
            vm.id = $stateParams.grocNo;
            vm.search();
        }

        // Click updateGrocName() button
        function updateGrocName() {
            console.log("-- show.controller.js > save()");
            GrocService
                .updateGroc(vm.id, vm.result.name)
                .then(function (result) {
                    console.log("-- show.controller.js > save() > results: \n" + JSON.stringify(result.data));
                })
                .catch(function (err) {
                    console.log("--  show.controller.js > save() > error: \n" + JSON.stringify(err));
                });
            vm.toggleEditor();
        }

        // Click search() button
        function search() {
            console.log("-- show.controller.js > search()");
            initDetails();
            vm.showDetails = true;

            GrocService
                .retrieveGrocByID(vm.id)
                .then(function (result) {
                    vm.showDetails = true;

                    console.log("-- show.controller.js > search() > results: \n" + JSON.stringify(result.data));

                    if (!result.data)
                        return;

                    vm.result.id = result.data.id;
                    vm.result.name = result.data.name;
                })
                .catch(function (err) {
                    console.log("--  show.controller.js > search() > error: \n" + JSON.stringify(err));
                });
        }

        // Click toggleEditor() button
        function toggleEditor() {
            vm.isEditorOn = !(vm.isEditorOn);
        }
    }
})();