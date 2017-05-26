(function() {
  'use strict';

  angular
    .module('angularPoster')
    .factory('firebaseService', ["settingsService", function(settingsService){
        var service = {};

        service.ref = null;

        service.initApp = function(){
            return settingsService.getLocalSettings().then(
                function(data){
                    console.log(data)
                    firebase.initializeApp(data.settings); 
                })
        }

        service.getBasereference = function(){
            return firebase.database().ref();
        }

        service.loginToFirebase = function(login, password){
            return firebase.auth().signInWithEmailAndPassword(login, password).then(function(result){
                console.log('login to Firebase success');
                return Promise.resolve(result);
            }, function(error){
                console.log('login to Firebase error: ', error.message);
                return Promise.reject(error);
            })
        }

        service.authChageCallback = function(callback){
            firebase.auth().onAuthStateChanged(callback)
        }

        service.logOut = function(){
            return firebase.auth().signOut();
        }

        service.getBasereference = function(){
            return firebase.database().ref();
        }


        return service;

    }]);


})();
