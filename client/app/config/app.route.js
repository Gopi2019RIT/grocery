(function () {
    angular
        .module("DMS")
        .config(uiRouteConfig)

    uiRouteConfig.$inject = ["$stateProvider", "$urlRouterProvider"];

    function uiRouteConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
        // .state("register", {
        //     url: "/register",
        //     templateUrl: "app/registration/register.html",
        // })
        // .state("search", {
        //     url: "/search",
        //     templateUrl: "app/search/search.html",
        // })
        .state("searchDB", {
            url: "/searchDB",
            templateUrl: "app/search/searchDB.html",
        })
        .state("edit", {
            url: "/edit",
            templateUrl: "app/edit/edit.html",
            // controller: EditCtrl,
            // controllerAs: "ctrl"
        })
        .state("editWithParam", {
            url: "/edit/:id",
            templateUrl: "app/edit/edit.html",
            // controller: EditCtrl
        });
    }
})();