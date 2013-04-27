// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>
'use strict';

define(
  [
    'components/flight/lib/component'
  ],

  function(defineComponent) {
    return defineComponent(drawConvention);


    function drawConvention() {
      this.tmpl = Handlebars.compile($('#conventionSection').html());

      this.draw = function(e, data) {
        $(this.node).html(this.tmpl(data));
      };

      this.after('initialize', function() {
        this.on(document, 'uiDrawConvention', this.draw);
      });
    }
  }
)
