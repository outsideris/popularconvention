// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>
'use strict';

define(
  [
    'javascripts/ui/language',
    'javascripts/ui/convention'
  ],

  function(Language, Convention) {
    var initialize = function() {
      Language.attachTo('.languagebox .language');
      Convention.attachTo('#conventionWrap');
    };

    return {
      initialize: initialize
    };
  }
)