let app = angular
  .module("reelDb", ["ngRoute"])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      // .when("/", {
      //   templateUrl: "../demo.html",
      // })
      .when("/index", {
        templateUrl: "../demo.html",
      })
      .when("/demo", {
        templateUrl: "../index.html",
        controller: "HeaderController",
      })
      .when("/directory", {
        templateUrl: "../directory.html",
        controller: "MoviesController",
      })
      .when("/watchlist", {
        templateUrl: "../watchlist.html",
        controller: "MoviesController",
      })

      .otherwise({
        redirectTo: "/index"
      });
    $locationProvider.html5Mode(true);
  })
  .controller("MoviesController", function ($scope, $http) {
    $scope.plotLimit = 90;
    $scope.showFullPlot = false;
    $scope.movies = [];
    $http.get("../movies.json").then(function (data) {
      $scope.movies = data.data;
    });

    $scope.togglePlot = function(movie) {
      $scope.showFullPlot = !$scope.showFullPlot;
  
      // Adjust the plot limit based on the toggle
      if ($scope.showFullPlot) {
        $scope.plotLimit = movie.Plot.length;
      } else {
        $scope.plotLimit = 90; // Set it to your initial limit
      }
    };
  })
  .controller("HeaderController", function ($scope, $location) {
    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };
  });
