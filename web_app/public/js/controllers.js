var app = angular.module('booksApp');

app.controller('indexController', function ($scope) {
    $scope.msg = "Index";
});

app.controller('loginController', function ($scope) {
    $scope.msg = "Login please";
});

app.controller('signupController', function ($scope) {
    $scope.msg = "Signup please";
});

app.controller('booksController', function ($scope) {
    $scope.msg = "Hello books!";
});
