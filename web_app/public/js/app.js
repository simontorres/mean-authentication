var app = angular.module('booksApp', ['ngRoute', 'ngResource']);

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when("/", {
            templateUrl: '/views/index.view.html'
        })
        .when("/books", {
            templateUrl: '/views/books.view.html'
    });
    $locationProvider.html5Mode(true);
});
