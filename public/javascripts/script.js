// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>

$(document).ready(function() {
  var dataset = {
    comma: [1034, 348]
  };

  var width = 600,
    height = 400,
    radius = Math.min(width, height) / 2;

  var color = d3.scale.ordinal()
    .range(['#E74C3C', '#F1C40F', '#9B59B6', '#2ECC71']);

  var pie = d3.layout.pie().sort(null);

  var arc = d3.svg.arc()
              .innerRadius(radius - 80)
              .outerRadius(radius - 20);

  var svg = d3.select(".graph .chart").append("svg")
              .attr("width", width)
              .attr("height", height)
              .append("g")
              .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var path = svg.selectAll("path")
                .data(pie(dataset.comma))
                .enter().append("path")
                .attr("fill", function(d, i) { return color(i); })
                .attr("d", arc);
  path.append("text")

});
