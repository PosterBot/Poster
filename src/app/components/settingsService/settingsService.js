(function() {
  'use strict';

  angular
    .module('angularPoster')
    .service('settingsService', ["$http", "$q", function($http, $q){
        var service = this;

        service.getLocalSettings = function(){
            var deffered = $q.defer();
            $http.get('app/settings/firebase.json').success(function(data){
                deffered.resolve(data);
            })

            return deffered.promise;
        }

    }]);


})();
