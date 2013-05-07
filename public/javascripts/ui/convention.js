// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>
'use strict';

define(
  [
    'popluarconvention/components/flight/lib/component'
  ],

  function(defineComponent) {
    return defineComponent(drawConvention);


    function drawConvention() {
      this.convTmpl = Handlebars.compile($('#conventionSection').html());
      this.spinerTmpl = Handlebars.compile($('#spiner').html());

      this.draw = function(e, lang) {
        lang = lang.lang;

        var self = this;

        this.trigger('uiProgressing');
        $.getJSON('/popluarconvention/score/' + lang, function(data) {
          data = data.results;
          for (var conv in data.scores) {
            if (data.scores[conv].column) {
              data.scores[conv].column.sort(function(a, b) {
                return data.scores[conv][b.key] - data.scores[conv][a.key]
              });
            }
          }
          data.raw.sort(function(a, b) {
            return b.file - a.file;
          });
          $(self.node).html(self.convTmpl(data));
          var colors = d3.scale.ordinal().range(['#F1C40F', '#E74C3C', '#E67E22', '#2ECC71', '#9B59B6']);
          self.$node.find('section').find('.graph .sidebar').each(function() {
            $(this).find('li').each(function(index) {
              if (!$(this).hasClass('commits')) {
                $(this).find('div.icons').css('color', colors(index));
              }
            });
          });
          self.trigger('uiDrawGraph', data);
        })
        .fail(function(jqxhr, textStatus, error) {
          $(self.node).html('');
        });
      };

      this.spinner = function(e) {
        $(this.node).html(this.spinerTmpl());
      };

      this.after('initialize', function() {
        this.on(document, 'uiDrawConvention', this.draw);
        this.on('uiProgressing', this.spinner);
      });
    }
  }
)
