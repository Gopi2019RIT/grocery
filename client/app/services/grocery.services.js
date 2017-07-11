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
        service.updateGroc = updateGroc;

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
        
        // edit updateGrocName
        function updateGroc(id, name, brand, upc12) {
            return $http({
                method: 'PUT' // via route parameters & HTTP header body
                , url: 'api/groceries/' + id // passed via URL params
                , data: {
                    id: id,
                    name: name,
                    brand: brand,
                    upc12: upc12
                    // passed via body
                }
            });
        }
    }
})();