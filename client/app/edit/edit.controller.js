(function () {
    'use strict';
    angular
        .module("DMS")
        .controller("EditCtrl", EditCtrl);

    EditCtrl.$inject = ["$filter", "GrocService", "$stateParams"];

    function EditCtrl($filter, GrocService, $stateParams) {
        var vm = this;

        vm.id = "";
        vm.name = "";
        vm.upc12 = "";
        vm.brand = "";

        vm.result = {};

        vm.initDetails = initDetails;
        vm.search = search;
        vm.toggleEditor = toggleEditor;
        vm.updateGroc = updateGroc;

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
        if ($stateParams.grocNo) {
            console.log("passing info" + $stateParams.grocNo)
            vm.id = $stateParams.grocNo;
            vm.search();
        }

        // Click updateGroc() button
        function updateGroc() {
            console.log("-- show.controller.js > save()");
            GrocService
                .updateGroc(vm.id, vm.result.name, vm.result.brand, vm.result.upc12)
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
                .retrieveGrocByIDAZ(vm.id)
                .then(function (result) {
                    vm.showDetails = true;

                    console.log("-- show.controller.js > search() > results: \n" + JSON.stringify(result.data));

                    if (!result.data)
                        return;

                    vm.result.id = result.data.id;
                    vm.result.name = result.data.name;
                    vm.result.brand = result.data.brand;
                    vm.result.upc12 = result.data.upc12;
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