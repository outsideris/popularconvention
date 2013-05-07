// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>
'use strict';

define(
  [
    'popluarconvention/javascripts/ui/language',
    'popluarconvention/javascripts/ui/convention',
    'popluarconvention/javascripts/ui/graph'
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