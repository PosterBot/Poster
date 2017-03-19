(function() {
  'use strict';

  angular
    .module('angularPoster')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('projects', {
				url: '/projects',
				templateUrl: 'app/projects/projects.html',
				controller: 'ProjectsController',
				controllerAs: 'vm', 
				title: 'Projects List'
			})
			.state('login', {
				url: '/login',
				templateUrl: 'app/login/login.html',
				controller: 'LoginController',
				controllerAs: 'vm',
				title: 'Login'
			});
    $urlRouterProvider.otherwise('/');
  }

})();
