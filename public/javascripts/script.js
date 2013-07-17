// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>
$(document).ready(function() {
  $('.languagebox .language').click(function() {
    var lang = $(this).attr('data-lang');

    $(this).addClass('active');
    $(this).siblings().removeClass('active');

    if (lang) {
      location.href = "#" + $(this).attr('title').toLowerCase();
      drawConvention(lang);
    }
  });

  // template
  Handlebars.registerHelper('getScore', function(context) {
    var percentage = context[this.key] / context.total * 100;
    return Math.round(percentage * 1000) / 1000;
  });

  Handlebars.registerHelper('getCommitCount', function(commits) {
    return (commits + "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  });

  var convTmpl = Handlebars.compile($('#conventionSection').html());
  var spinerTmpl = Handlebars.compile($('#spiner').html());
  var convDiv$ = $('#conventionWrap');
  var currentLanguage = '';

  // methods
  var drawConvention = function(lang) {
    currentLanguage = lang;
    runSpinner();

    $.getJSON('/popularconvention/score/' + lang, function(data) {
      data = data.results;

      if (currentLanguage === data.lang) {
        $.each(data.scores, function(conv) {
          if (data.scores[conv].column) {
            data.scores[conv].column.sort(function(a, b) {
              return data.scores[conv][b.key] - data.scores[conv][a.key];
            });
          }
        });
        data.raw.sort(function(a, b) {
          return b.file - a.file;
        });
        convDiv$.html(convTmpl(data));
        var colors = d3.scale.ordinal().range(['#F1C40F', '#E74C3C', '#E67E22', '#2ECC71', '#9B59B6']);
        convDiv$.find('section').find('.graph .sidebar').each(function() {
          $(this).find('li').each(function(index) {
            if (!$(this).hasClass('commits')) {
              $(this).find('div.icons').css('color', colors(index));
            }
          });
        });
        drawGraph(data);
      }
    })
    .fail(function() {
      convDiv$.html('');
    });
  };

  var runSpinner = function() {
    convDiv$.html(spinerTmpl());
  };

  var graphConfig = {
    width: 550,
    height: 400,
    color: d3.scale.ordinal().range(['#F1C40F', '#E74C3C', '#E67E22', '#2ECC71', '#9B59B6'])
  };
  graphConfig.radius = Math.min(graphConfig.width, graphConfig.height) / 2;
  // pie chart
  graphConfig.pie = d3.layout.pie().value(function(d) {return d.sum;})
                        .sort(function(a, b) {return b.sum - a.sum;});
  graphConfig.arc = d3.svg.arc().innerRadius(graphConfig.radius - 80)
                                .outerRadius(graphConfig.radius - 20);

  var drawGraph = function(dataset) {
    var svg = d3.selectAll(".graph .chart").append("svg")
                .attr("width", graphConfig.width)
                .attr("height", graphConfig.height)
                .append("g")
                .attr("transform", "translate(" + graphConfig.width / 2 + "," + graphConfig.height / 2 + ")");

    svg.each(function() {
      if (d3.select(this).length > 0) {
        var dataName = $(d3.select(this)[0]).parent().prev().val();
        var finalData = [];

        for (var index in dataset.raw) {
          var cur = dataset.raw[index];
          if (cur.convention[dataName]) {
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
        }
        var nest = d3.nest().key(function(d) {return d.name;}).entries(finalData);
        nest.forEach(function(s) {
          s.display = s.values[0].display;
          s.sum = d3.sum(s.values, function(d) {return d.score;});
        });
        nest.sort(function(a, b) {
          return b.sum - a.sum;
        });

        drawPie(this, nest);
      }
    });
  };

  var drawPie = function(context, nest) {
    d3.select(context).selectAll("path")
      .data(function() { return graphConfig.pie(nest);})
      .enter().append("path")
      .attr("fill", function(d, i) { return graphConfig.color(i); })
      .attr("d", graphConfig.arc);
  };

  // social buttons
  (function(d,s,id){
    var js,fjs=d.getElementsByTagName(s)[0];
    if(!d.getElementById(id)){
      js=d.createElement(s);
      js.id=id;
      js.src="https://platform.twitter.com/widgets.js";
      fjs.parentNode.insertBefore(js,fjs);
    }
  }(document,"script","twitter-wjs"));

  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/ko_KR/all.js#xfbml=1";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  (function() {
    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/plusone.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
  })();

  // check hash
  if (location.hash) {
    var lang = location.hash.substr(1);
    $('.language').each(function() {
      if (this.title.toLowerCase() === lang) {
        $(this).trigger('click');
      }
    });
  }
});
