// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>
'use strict';

define(
  [
    'components/flight/lib/component'
  ],

  function(defineComponent) {
    return defineComponent(language);

    function language() {
      this.selectLanguage = function(e) {
        var lang = $(e.currentTarget).attr('data-lang');

        if (lang) {
          var mock = {conventions: [{}, {}]}
          this.trigger('uiDrawConvention', mock)
        }

      };

      this.after('initialize', function() {
        this.on('click', this.selectLanguage);
      });
    }
  }
)
