/* global malarkey:false, moment:false */
(function() {
  'use strict';

  angular
    .module('angularPoster')
    .constant('_', window._)
    .constant('malarkey', malarkey)
    .constant('moment', moment);

})();
