// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>
'use strict';

define(
  [
    'components/flight/lib/component'
  ],

  function(defineComponent) {
    return defineComponent(drawGraph);


    function drawGraph() {
      this.width = 600,
      this.height = 400,
      this.radius = Math.min(this.width, this.height) / 2,
      this.color = d3.scale.ordinal().range(['#E74C3C', '#F1C40F', '#9B59B6', '#2ECC71']),
      this.pie = d3.layout.pie().sort(null),
      this.arc = d3.svg.arc().innerRadius(this.radius - 80).outerRadius(this.radius - 20)

      this.draw = function(e) {
        var self = this;
        var svg = d3.selectAll(".graph .chart").append("svg")
                    .attr("width", this.width)
                    .attr("height", this.height)
                    .append("g")
                    .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");

        var path = svg.each(function(d) {
          console.log(d3.select(this))
          window.temp = d3.select(this)
          if (d3.select(this).length > 0) {
            var dataset = eval( '[' + $(d3.select(this)[0]).parent().prev().val() + ']');
            d3.select(this).selectAll("path")
              .data(self.pie(dataset))
              .enter().append("path")
              .attr("fill", function(d, i) { return self.color(i); })
              .attr("d", self.arc);
          }
        });
      };

      this.after('initialize', function() {
        this.on(document, 'uiDrawGraph', this.draw);
      });
    }
  }
)
