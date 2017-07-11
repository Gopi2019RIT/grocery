(function () {
    angular
        .module("DMS")
        .service("EmpService", EmpService);

    EmpService.$inject = ['$http'];

    function EmpService($http) {

        var service = this;

        service.retrieveNonManagers = retrieveNonManagers;

        // retrieveNonManagers from RegCtrl, initialize employees/manager data
        function retrieveNonManagers() {
            return $http({
                method: 'GET'
                , url: 'api/employees'
            });
        }
    }
})();