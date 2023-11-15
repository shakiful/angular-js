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
        redirectTo: "/index",
      });
    $locationProvider.html5Mode(true);
  })
  .controller("MoviesController", function ($scope, $http) {
    $scope.plotLimit = 90;
    $scope.showFullPlot = false;
    $scope.movies = [];
    $scope.watchlist = [];
    $scope.moviesPerPage = 6; // Number of movies to show initially
    $scope.moviesToLoad = 3; // Number of movies to load on each "Load More" click

    $scope.displayedMovies = []; // Array to store the displayed movies
    $http.get("../movies.json").then(function (data) {
      $scope.movies = data.data;
      $scope.displayedMovies = $scope.movies.slice(0, $scope.moviesPerPage); // Initially display the first set of movies
    });

    console.log($scope.movies);
    console.log($scope.displayedMovies);

    $scope.loadMore = function () {
      var currentLength = $scope.displayedMovies.length;
      var remainingMovies = $scope.movies.length - currentLength;

      // Load the remaining movies
      var toLoad =
        remainingMovies > $scope.moviesToLoad
          ? $scope.moviesToLoad
          : remainingMovies;

      // Add the next set of movies to the displayedMovies array
      $scope.displayedMovies = $scope.displayedMovies.concat(
        $scope.movies.slice(currentLength, currentLength + toLoad)
      );
    };

    $scope.togglePlot = function (movie) {
      $scope.showFullPlot = !$scope.showFullPlot;

      // Adjust the plot limit based on the toggle
      if ($scope.showFullPlot) {
        $scope.plotLimit = movie.Plot.length;
      } else {
        $scope.plotLimit = 90; // Set it to your initial limit
      }
    };

    $scope.addToWatchlist = function (movie) {
      // Check if the movie is already in the watchlist
      // if (!$scope.watchlist.some((item) => item.Title === movie.Title)) {
      $scope.watchlist.push({
        Images: movie.Images,
        Title: movie.Title,
        Released: movie.Released,
        // Add other properties as needed
      });
    };

    $scope.moviesPerRow = 3; // Default value

    $scope.updateColumns = function () {
      // Update the CSS class for card-columns based on the selected value
      switch ($scope.moviesPerRow) {
        case "2":
          $scope.columnClass = "col-md-12"; // Full width for 1 movie per row
          break;
        case "3":
          $scope.columnClass = "col-md-4 offset-md-4"; // Half width for 2 movies per row
          break;
        case "4":
          $scope.columnClass = "col-md-4"; // One-third width for 3 movies per row
          break;
        // Add more cases for other values if needed
        default:
          $scope.columnClass = "col-md-4 offset-md-4"; // Default to one-third width
          break;
      }
    };
    $scope.updateColumns(); // Call the function initially to set the default column class

    // Function to dynamically apply the column class to cards based on selection
    // $scope.getCardClass = function () {
    //   return $scope.columnClass // Add any additional margin if needed
    // };
    // };
  })
  .controller("HeaderController", function ($scope, $location) {
    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };
  });
