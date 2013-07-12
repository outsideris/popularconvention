// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>
'use strict';

requirejs.config({
  baseUrl: '/'
});

require(['popularconvention/javascripts/app', 'popularconvention/components/flight/tools/debug/debug'], function(App, debug) {
  debug.enable(true);
  App.initialize();

  if (location.hash) {
    var lang = location.hash.substr(1);
    $('.language').each(function() {
      if (this.title.toLowerCase() === lang) {
        $(this).trigger('click');
      }
    });
  }
});

