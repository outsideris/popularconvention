// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>
'use strict';

requirejs.config({
  baseUrl: '/'
});

require(['javascripts/app', 'components/flight/tools/debug/debug'], function(App, debug) {
  debug.enable(true);
  App.initialize();
});

