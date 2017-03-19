(function () {
	'use strict';

	angular
		.module('myApp')
		.config(routes);

	function routes($stateProvider, $urlRouterProvider) {

		$stateProvider
			.state('login', {
				url: '/login',
				templateUrl: 'app/pages/login/login.html',
				controller: 'loginController',
				controllerAs: 'vm',
				title: 'Login'
			})
			.state('projects', {
				url: '/',
				templateUrl: 'app/pages/projects/projects.html',
				controller: 'projectsController',
				controllerAs: 'vm',
				title: 'Projects'
			});

		$urlRouterProvider.otherwise('/projects');
	}
}());
