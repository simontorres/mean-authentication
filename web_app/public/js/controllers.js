var app = angular.module('booksApp');

app.controller('mainController', function ($scope, $http, $uibModal, $location, $window) {
    $scope.showSignin = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'views/signin.view.html',
            controller: 'signinController',
            scope: $scope,
            resolve: {
                loginForm: function () {
                    return $scope.loginForm;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            console.log(selectedItem);
        })
    };



    //  authStatus.setAuthStatus($window.localStorage.getItem('jwtToken') != null)
   //
   //  $scope.isSignedIn = authStatus.getAuthStatus();
   //
    $scope.signout = function () {
        console.log("signing out");
      $window.localStorage.removeItem('jwtToken');
   };


});

app.controller('indexController', function ($scope, $http, $location, $window) {
    console.log(' This is Index');
});

app.controller('signinController', function ($scope, $http, $location, $window, $uibModalInstance) {
    $scope.signinData = {
        username: '',
        password: ''
    };
    $scope.message = '';
    $scope.data = null;

    $scope.signin = function () {
        console.log('signining in');
        $http({
            method: 'POST',
            url: '/api/signin',
            data: $scope.signinData
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
            $scope.message = err.data.msg;
        });
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
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
            console.log(res);
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
        url: '/api/books',
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
        if (err.data === 'Unauthorized') {
            $scope.message = err.data;
            $location.path('/login');
        }

    });
});
