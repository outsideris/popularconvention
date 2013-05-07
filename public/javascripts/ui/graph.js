// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>
'use strict';

define(
  [
    'popluarconvention/components/flight/lib/component'
  ],

  function(defineComponent) {
    return defineComponent(drawGraph);


    function drawGraph() {
      this.width = 600,
      this.height = 400,
      this.radius = Math.min(this.width, this.height) / 2,
      this.color = d3.scale.ordinal().range(['#F1C40F', '#E74C3C', '#E67E22', '#2ECC71', '#9B59B6']),
      // pie chart
      this.pie = d3.layout.pie().value(function(d) {return d.sum})
                                .sort(function(a, b) {return b.sum - a.sum}),
      this.arc = d3.svg.arc().innerRadius(this.radius - 80).outerRadius(this.radius - 20);

      this.draw = function(e, dataset) {
        var self = this;
        var svg = d3.selectAll(".graph .chart").append("svg")
                    .attr("width", this.width)
                    .attr("height", this.height)
                    .append("g")
                    .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");

        var path = svg.each(function(d) {
          if (d3.select(this).length > 0) {
            var dataName = $(d3.select(this)[0]).parent().prev().val();
            var finalData = [];
            for (var index in dataset.raw) {
              var cur = dataset.raw[index];
              for (var j in cur.convention[dataName].column) {
                var obj = {
                  date: cur.file,
                  name: cur.convention[dataName].column[j].key,
                  score: cur.convention[dataName][cur.convention[dataName].column[j].key],
                  display: cur.convention[dataName].column[j].display
                };
                finalData.push(obj);
              }
            }
            var nest = d3.nest().key(function(d) {return d.name;}).entries(finalData);
            nest.forEach(function(s) {
              s.display = s.values[0].display;
              s.sum = d3.sum(s.values, function(d) {return d.score})
            });
            nest.sort(function(a, b) {
              return b.sum - a.sum;
            });

            var drawPie = function(context) {
              d3.select(context).selectAll("path")
                .data(function() { return self.pie(nest)})
                .enter().append("path")
                .attr("fill", function(d, i) { return self.color(i); })
                .attr("d", self.arc);
            }

            drawPie(this);
          }
        });
      };

      this.after('initialize', function() {
        this.on(document, 'uiDrawGraph', this.draw);
      });
    }
  }
)
