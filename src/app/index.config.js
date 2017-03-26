(function() {
  'use strict';

  angular
    .module('angularPoster')
    .config(config);

  /** @ngInject */
  function config($logProvider) {
    // Enable log
    $logProvider.debugEnabled(true);
  }

})();
