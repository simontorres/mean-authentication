var app = angular.module('booksApp');

app.controller('indexController', function ($scope) {
    $scope.msg = "Index";
});

app.controller('loginController', function ($scope, $http, $location, $window) {
    $scope.loginData = {
        username: '',
        password: ''
    };
    $scope.message = '';
    $scope.data = null;

    $scope.login = function () {
        $http({
            method: 'POST',
            url: '/api/signin',
            data: $scope.loginData
        }).then(function (res) {
            // console.log(res.data);
            if (res.data.success) {
                $window.localStorage.setItem('jwtToken', res.data.token);
                $location.path('/books');
            } else {
                $scope.message = res.data.msg;
            }
        }, function (err) {
            console.log(err);
            $scope.message = err.error.msg;
        });
    }
});

app.controller('signupController', function ($scope, $http, $location) {
    $scope.signupData = {
        username: '',
        password: ''
    };
    $scope.message = '';

    $scope.signup = function () {
        $http({
            method: 'POST',
            url: '/api/signup',
            data: $scope.signupData
        }).then(function (res) {
            // console.log(res.data);
            if (res.data.success) {
                $location.path('/login');
            } else {
                $scope.message = res.data.msg;
            }
        }, function (err) {
            console.log(err);
            $scope.message = err.error.msg;
        });
    };
});

app.controller('booksController', function ($scope, $http, $location, $window) {
    $scope.message = '';
    $scope.books = null;
    $http({
        method: 'GET',
        url: '/api/book',
        headers: {
            'Authorization': $window.localStorage.getItem('jwtToken')
        }
    }).then(function (res) {
        console.log(res);
        if (res.data.success) {
            $scope.books = res.data;
        } else {
            $scope.message = res.data.msg;
        }
    }, function (err) {
        console.log(err);
        $scope.message = err.data.msg;
    });
});
