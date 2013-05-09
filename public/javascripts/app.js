// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>
'use strict';

define(
  [
    'popularconvention/javascripts/ui/language',
    'popularconvention/javascripts/ui/convention',
    'popularconvention/javascripts/ui/graph'
  ],

  function(Language, Convention, Graph) {
    var initialize = function() {
      Language.attachTo('.languagebox .language');
      Convention.attachTo('#conventionWrap');
      Graph.attachTo('#conventionWrap');
    };

    return {
      initialize: initialize
    };
  }
)