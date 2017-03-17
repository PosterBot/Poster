(function () {
	'use strict';

	angular
		.module('myApp')
		.config(routes);

	function routes($stateProvider, $urlRouterProvider) {

		$stateProvider
			.state('login', {
				url: '/projects',
				templateUrl: 'app/pages/projects/projects.html',
				controller: 'projectsCtrl',
				controllerAs: 'vm',
				title: 'Projects List'
			})
			.state('projects', {
				url: '/newProject',
				templateUrl: 'app/pages/newProject/newProject.html',
				controller: 'newProjectCtrl',
				controllerAs: 'vm',
				title: 'New Project'
			});

		$urlRouterProvider.otherwise('/projects');
	}
}());
