(function() {
  'use strict';

  angular
    .module('angularPoster')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope, $location, $state, authService, firebaseService) {

    // enumerate routes that don't need authentication
  var routesThatDontRequireAuth = ['/login'];
  firebaseService.initApp().then(function(result){
     authService.checkUserSession();
     authService.authChange();
  });

  // check if current location matches route  
  var routeClean = function (route) {
    return _.find(routesThatDontRequireAuth,
      function (noAuthRoute) {
        return _.startsWith(route, noAuthRoute);
      });
  };
  
function checkUserPermission(){
  if (!routeClean($location.url()) && !authService.isLoggedIn()) {
      // redirect back to login
      $location.path('login')
      $state.go('login');
    }
}

  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    // if route requires auth and user is not logged in
    checkUserPermission()
  });

  $rootScope.$on('$stateChangeStart', function (event, next, current) {
    // if route requires auth and user is not logged in
    checkUserPermission()
  });
  }

})();
