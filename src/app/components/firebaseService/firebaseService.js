(function() {
  'use strict';

  angular
    .module('angularPoster')
    .service('firebaseService', ["settingsService", function(settingsService){
        var service = this;

        service.init = function(){
            return settingsService.getLocalSettings().then(
                function(data){
                    console.log(data)
                    firebase.initializeApp(data.settings);
                    firebase.auth().signInWithEmailAndPassword(data.auth.email, data.auth.password).catch(function(error) {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        console.log('error',  errorCode + ": " + errorMessage);
                    })
                    var ref = firebase.database().ref();
                    return ref
                })
        }

    }]);


})();
