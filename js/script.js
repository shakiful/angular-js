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
      // .when("/demo", {
      //   templateUrl: "../index.html",
      //   controller: "HeaderController",
      // })
      .when("/directory", {
        templateUrl: "../directory.html",
        controller: "MoviesController",
      })
      .when("/watchlist", {
        templateUrl: "../watchlist.html",
        controller: "WatchlistController",
      })

      .otherwise({
        redirectTo: "/index",
      });
    $locationProvider.html5Mode(true);
  })

  .service("WatchlistService", function () {
    let watchlist = [];

    return {
      getWatchlist: function () {
        return watchlist;
      },
      addToWatchlist: function (movie) {
        let existingMovie = watchlist.find(function (item) {
          return item.Title === movie.Title;
        });

        if (!existingMovie) {
          watchlist.push({
            Images: movie.Images,
            Title: movie.Title,
            Released: movie.Released,
            // Add other properties as needed
          });
          return true; // Movie added successfully
        }
        return false; // Movie already exists
      },
      // You can add more functions to manage the watchlist data as needed
    };
  })

  .controller("MoviesController", function ($scope, $http, WatchlistService) {
    $scope.plotLimit = 79;
    $scope.movies = [];
    $scope.moviesPerPage = 6; // Number of movies to show initially
    $scope.moviesToLoad = 3; // Number of movies to load on each "Load More" click

    $scope.displayedMovies = []; // Array to store the displayed movies
    $http.get("../movies.json").then(function (data) {
      $scope.movies = data.data;

      $scope.movies.forEach(function (movie) {
        movie.plotLength = $scope.plotLimit;
      });

      $scope.displayedMovies = $scope.movies.slice(0, $scope.moviesPerPage); // Initially display the first set of movies
    });

    console.log($scope.movies);
    console.log($scope.displayedMovies);

    $scope.loadMore = function () {
      let currentLength = $scope.displayedMovies.length;
      let remainingMovies = $scope.movies.length - currentLength;

      // Load the remaining movies
      let toLoad =
        remainingMovies > $scope.moviesToLoad
          ? $scope.moviesToLoad
          : remainingMovies;

      // Add the next set of movies to the displayedMovies array
      $scope.displayedMovies = $scope.displayedMovies.concat(
        $scope.movies.slice(currentLength, currentLength + toLoad)
      );
    };

    $scope.togglePlot = function (movie) {
      console.log(movie.togglePlot);

      movie.togglePlot = !movie.togglePlot;

      console.log(movie.togglePlot);

      // Adjust the plot limit based on the toggle
      if (movie.togglePlot) {
        movie.plotLength = movie.Plot.length;
        console.log(movie.plotLength);
      } else {
        movie.plotLength = 79; // Set it to your initial limit
      }
    };

    $scope.addToWatchlist = function (movie) {
      let added = WatchlistService.addToWatchlist(movie);
      if (added) {
        console.log("Movie added to watchlist:", movie.Title);
        console.log(WatchlistService.getWatchlist()); // check watchlist content
      } else {
        console.log("Movie already exists in the watchlist!");
      }
    };

    $scope.moviesPerRow = 3; // Default value

    $scope.updateColumns = function () {
      // Update the CSS class for card-columns based on the selected value
      switch ($scope.moviesPerRow) {
        case "2":
          $scope.columnStyle = {
            "column-count": $scope.moviesPerRow,
          };
          break;
        case "3":
          $scope.columnStyle = {
            "column-count": $scope.moviesPerRow,
          };
          break;
        case "4":
          $scope.columnStyle = {
            "column-count": $scope.moviesPerRow,
            h4: {
              "font-size": "1.3rem",
            },
          };
          break;
        default:
          $scope.columnStyle = {
            "column-count": 3,
          };
          break;
      }
    };
    $scope.updateColumns(); // Call the function initially to set the default column class

    // Function to dynamically apply the column class to cards based on selection
    $scope.getCardClass = function () {
      return $scope.columnClass; // Add any additional margin if needed
    };
    // };
  })

  .controller("WatchlistController", function ($scope, WatchlistService) {
    $scope.watchlist = WatchlistService.getWatchlist();
    $scope.watchedMovie = function (movie) {
      movie.watched = true;

      console.log(movie.watched);
    };

    $scope.removeMovie = function (movieToRemove) {
      const index = $scope.watchlist.indexOf(movieToRemove);
      if (index > -1) {
        $scope.watchlist.splice(index, 1);
      } else {
        console.log("Movie not found in the list");
      }
    };
  })

  .controller("HeaderController", function ($scope, $location) {
    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };
  });
