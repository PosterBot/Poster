(function(){
    'use strict';
    angular
        .module('angularPoster')
        .controller('LoginController', ['$scope', '$state', 'authService', function($scope, $state, authService){
        var vm = this;

        vm.userCreds = {
            login: '',
            password: ''
        }

        vm.loginUser = function(isValid){
            authService.authUser(vm.userCreds.login, vm.userCreds.password)
            .then(function(result){
                if(result){
                    $state.go('projects')
                }
            })
        }

        function init(){
            if(authService.isLoggedIn()){
                $state.go('projects')
            }
        }
        
        init();
    }])
})()