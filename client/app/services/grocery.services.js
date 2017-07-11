(function () {
    angular
        .module("DMS")
        .service("GrocService", GrocService);

    GrocService.$inject = ['$http'];

    // GrocService from EditCtrl
    function GrocService($http) {

        var service = this;

        service.retrieveGrocDB = retrieveGrocDB; // searchDB
        service.retrieveGrocByID = retrieveGrocByID; // edit
        service.updateGroc = updateGroc; // edit

        // REST API groceries

        // read groceries
        function retrieveGrocDB(searchString) {
            return $http({
                method: 'GET'
                , url: 'api/groceries'
                , params: {
                    'searchString': searchString
                    // passed via non-URL params
                }
            });
        }

        // read a grocery via param
        function retrieveGrocByID(id) {
            return $http({
                method: 'GET'
                , url: "api/groceries/" + id // passed via URL params
            });
        }
        
        // edit grocery
        function updateGroc(id, name) {
            return $http({
                method: 'PUT' // via route parameters & HTTP header body
                , url: 'api/groceries/' + id // passed via URL params
                , data: {
                    id: id,
                    name: name
                    // passed via body
                }
            });
        }
    }
})();