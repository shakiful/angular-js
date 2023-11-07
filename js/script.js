let app = angular
  .module("reelDb", ["ngRoute"])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      // .when("/", {
      //   templateUrl: "../demo.html",
      // })
      .when("/demo", {
        templateUrl: "../index.html",
      })
      .when("/index", {
        templateUrl: "../index.html",
      })
      .when("/directory", {
        templateUrl: "../directory.html",
        controller: "MoviesController",
      })
      .otherwise({
        redirectTo: "/demo",
      });
    $locationProvider.html5Mode(true);
  })
  .controller("MoviesController", function ($scope, $http) {
    $scope.movies = [];
    $http.get("../movies.json").then(function (data) {
      $scope.movies = data.data;
    });
  });
