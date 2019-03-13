var app = angular.module('booksApp');

app.service('authStatus', function ($http, $window) {

   this.signout = function () {
      $window.localStorage.removeItem('jwtToken');
   };

   // return authentication status
   this.isSignedIn = function () {
      return $window.localStorage.getItem('jwtToken') != null;
   }
});
