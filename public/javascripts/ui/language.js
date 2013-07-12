// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>
'use strict';

define(
  [
    'popularconvention/components/flight/lib/component'
  ],

  function(defineComponent) {
    return defineComponent(language);

    function language() {

      this.selectLanguage = function(e) {
        var lang = $(e.currentTarget).attr('data-lang');

        this.$node.addClass('active');
        this.$node.siblings().removeClass('active');

        if (lang) {
          location.href = "#" + $(e.currentTarget).attr('title').toLowerCase();
          this.trigger('uiDrawConvention', {lang: lang});
        }
      };

      this.after('initialize', function() {
        this.on('click', this.selectLanguage);
      });
    }
  }
)
