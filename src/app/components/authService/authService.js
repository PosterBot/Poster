(function(){
    angular
    .module('angularPoster')
    .factory('authService', ['firebaseService', function(firebaseService){
        var userIsAuth = false;

        var service = {};

        function setUserActive(login){
            if(login){
                userIsAuth = true;
                localStorage.setItem('ap-user', login);
            } else{
                localStorage.removeItem('ap-user');
                userIsAuth = false;
            }
        }

        service.authUser = function(login, password){
            return firebaseService.loginToFirebase(login, password).then(function(result){
                setUserActive(login)
                return userIsAuth;
            }, function(error){
                userIsAuth = false;
                return userIsAuth;
            })
        }

        service.isLoggedIn = function(){
            return userIsAuth;
        }

        service.logOutUser = function(){
            return firebaseService.logOut();
        }

        service.checkUserSession = function(){
            if(localStorage.getItem('ap-user')){
                userIsAuth = true;
            } else{
                userIsAuth = false;
            }
        }

        service.authChange = function(){
            firebaseService.authChageCallback(function(authData) {
                if (authData) {
                    console.log("User " + authData.email + " is logged in with " + authData.provider);
                    setUserActive(authData.email)
                } else {
                    setUserActive()
                    console.log("User is logged out");
                }
            });
        }

        return service
    }])
})()