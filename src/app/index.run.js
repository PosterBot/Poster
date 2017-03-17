(function() {
  'use strict';

  angular
    .module('angularPoster')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
