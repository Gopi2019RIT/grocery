(function () {
    'use strict';
    angular
        .module("DMS")
        .controller("EditCtrl", EditCtrl);

    EditCtrl.$inject = ["$filter", "GrocService", "$stateParams", "Upload"];

    function EditCtrl($filter, GrocService, $stateParams, Upload) {
        var vm = this;

        vm.id = "";
        vm.name = "";
        vm.upc12 = "";
        vm.brand = "";

        vm.result = {};

        var vm = this;
        vm.file = null;
        vm.comment = "";
        vm.status = {
            message: "",
            code: 0
        };
        vm.upload = upload;

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

        // File upload function using ng-file-upload
        function upload() {
            // Upload configuration and invokation
            Upload.upload({
                url: '/upload',
                data: {
                    "img-file": vm.file,
                    "comment": vm.comment
                }
            }).then(function (response) {
                // Success response
                vm.fileurl = response.data;
                // Status message to be displayed on success and rounding of file size to be displayed in KB
                vm.status.message = "The image is saved successfully with size : " + Math.round(response.data.size / 1024) + 'Kilo Bites';
                // HTTP status code 202 for Accepted
                vm.status.code = 202;
            }).catch(function (err) {
                // Error handler - Print out the error
                console.log(err);
                // Status message to be displayed on failure
                vm.status.message = "Fail to save the image.";
                // HTTP status code 400 for bad request
                vm.status.code = 400
            });

        };
    }
})();