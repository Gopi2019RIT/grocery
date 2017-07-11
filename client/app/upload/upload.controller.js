(function () {
    angular
        .module("DMS")
        .controller("UploadCtrl", UploadCtrl);

    UploadCtrl.$inject = ["Upload"];

    function UploadCtrl(Upload) {
        // Keep the bindable members of the controllers at the top
        var vm = this;
        vm.file = null;
        vm.comment = "";
        vm.status = {
            message: "",
            code: 0
        };
        vm.upload = upload;
        // -------------------------

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