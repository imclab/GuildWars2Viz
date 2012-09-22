var _this = this;

GW2VIZ.visualizations.donutViz = function(params) {
  var createChart, data, donutGroup, filterSupport, height, svg, width;
  data = GW2VIZ.data;
  svg = d3.select('#svg-el-donut');
  donutGroup = svg.append('svg:g').attr({
    id: 'donutGroup',
    transform: "translate(" + [0, 20] + ") scale(0.94)"
  });
  width = svg.attr('width');
  height = svg.attr('height');
  filterSupport = Modernizr.svgfilters;
  createChart = function(options) {
    var allLabels, allTextGroups, arc, arcs, bgLabelModifier, callback, chartGroup, chartType, edgeSlice, iconGroup, imageSize, innerRadius, labelSize, pie, pieFill, radius, startingIconOpacity, startingTextOpacity, textGroup, thisTextGroup, usePiePattern;
    labelSize = options.labelSize;
    radius = options.radius;
    innerRadius = options.innerRadius || false;
    chartType = options.chartType;
    usePiePattern = options.usePiePattern;
    pieFill = options.pieFill;
    callback = options.callback;
    bgLabelModifier = 5;
    startingTextOpacity = 0;
    startingIconOpacity = 0.6;
    d3.selectAll('.patternRace').attr({
      width: radius,
      height: radius
    });
    chartGroup = donutGroup.append('svg:g').attr({
      id: chartType + "-donut",
      'class': 'chartGroup',
      transform: "translate(" + [width / 2, height / 2] + ")"
    }).data([data[chartType]]);
    arc = d3.svg.arc().outerRadius(radius);
    if (innerRadius) arc.innerRadius(innerRadius);
    pie = d3.layout.pie().value(function(d) {
      return d.value;
    });
    arcs = chartGroup.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", function(d, i) {
      return "slice slice" + i;
    });
    arcs.append("svg:path").attr("d", arc).style({
      fill: "#ffffff",
      stroke: "#505050",
      filter: "url(#waterColor2)",
      "stroke-width": 4
    });
    edgeSlice = arcs.append("svg:path").attr({
      d: arc,
      'class': function(d, i) {
        return 'edgeSlice' + i;
      }
    }).style({
      fill: "#ffffff",
      stroke: "#707070",
      "stroke-opacity": 0.6,
      filter: "url(#jaggedEdge)",
      "stroke-width": 1
    });
    arcs.append("svg:path").attr({
      d: arc,
      'class': function(d, i) {
        return 'slice' + i;
      }
    }).style({
      fill: function(d, i) {
        if (usePiePattern === true) {
          return "url(#" + chartType + d.data.label + "Gradient)";
        } else {
          return pieFill[i];
        }
      },
      stroke: "#343434",
      filter: "url(#waterColor1)",
      "stroke-width": 2,
      "stroke-opacity": 1
    });
    iconGroup = arcs.append('svg:g').attr({
      'class': function(d, i) {
        return 'iconGroup iconGroup' + i;
      }
    }).style({
      opacity: startingIconOpacity
    });
    imageSize = {
      height: 54,
      width: 54
    };
    iconGroup.append("svg:image").attr({
      "xlink:href": function(d, i) {
        return "/static/img/viz/" + data[chartType][i].label + ".png";
      },
      x: 0,
      y: 0,
      width: imageSize.width + 'px',
      height: imageSize.height + 'px',
      transform: function(d) {
        d.innerRadius = 0;
        d.outerRadius = radius;
        return "translate(" + [arc.centroid(d)[0] - (imageSize.width / 2), arc.centroid(d)[1] - (imageSize.height / 2)] + ")";
      }
    });
    textGroup = arcs.append('svg:g').attr({
      'class': function(d, i) {
        return 'textGroup textGroup' + i;
      }
    }).style({
      opacity: startingTextOpacity
    });
    textGroup.append("svg:text").attr({
      "transform": function(d, i) {
        var x, y;
        d.innerRadius = 0;
        d.outerRadius = radius;
        x = arc.centroid(d)[0];
        y = arc.centroid(d)[1];
        if (data[chartType][i].label.length === 'Necromancer') x += 8;
        return "translate(" + [x, y] + ")";
      },
      "class": "bgLabel",
      "text-anchor": "middle"
    }).style({
      fill: "#ababab",
      filter: "url(#waterColor2)",
      "font-size": labelSize + bgLabelModifier + "px",
      opacity: 0.7,
      "text-shadow": "0 0 1px #000000"
    }).text(function(d, i) {
      return data[chartType][i].label;
    });
    textGroup.append("svg:text").attr({
      "transform": function(d, i) {
        var x, y;
        d.innerRadius = 0;
        d.outerRadius = radius;
        x = arc.centroid(d)[0];
        y = arc.centroid(d)[1];
        if (data[chartType][i].label === 'Necromancer') x += 14;
        return "translate(" + [x, y] + ")";
      },
      "class": "label",
      "text-anchor": "middle"
    }).style({
      fill: "#ffffff",
      "font-weight": "bold",
      "font-size": labelSize + 'px',
      "text-shadow": "0 0 3px #000000, 0 0 18px #000000"
    }).text(function(d, i) {
      return data[chartType][i].label;
    });
    textGroup.append("svg:text").attr({
      "transform": function(d) {
        d.innerRadius = 0;
        d.outerRadius = radius;
        return "translate(" + [arc.centroid(d)[0], arc.centroid(d)[1] + labelSize] + ")";
      },
      "text-anchor": "middle"
    }).style({
      fill: "#ffffff",
      "font-size": "1.1em",
      "text-shadow": "0 0 3px #000000"
    }).text(function(d, i) {
      return Math.round(data[chartType][i].value) + '%';
    });
    allTextGroups = d3.selectAll('.textGroup');
    thisTextGroup = chartGroup.selectAll('.textGroup');
    allLabels = chartGroup.selectAll('.textGroup .label');
    arcs.on('mouseover', function(d, i) {
      var curGroup;
      chartGroup.select('.edgeSlice' + i).transition().duration(300).style({
        'stroke-width': 9,
        'stroke': '#000000',
        'stroke-opacity': 0.8
      });
      allTextGroups.style({
        opacity: startingTextOpacity
      });
      thisTextGroup.style({
        opacity: 0.9
      });
      curGroup = chartGroup.selectAll('.textGroup' + i);
      curGroup.style({
        opacity: 1
      });
      curGroup.selectAll('.label').style({
        'font-size': labelSize + 6
      });
      curGroup.selectAll('.bgLabel').style({
        'font-size': labelSize + bgLabelModifier + 6
      }).attr({
        transform: function(d, i) {
          return "translate(" + arc.centroid(d) + ") rotate(" + (18 + (i * 3)) + ")";
        }
      });
      iconGroup.style({
        opacity: 0.3
      });
      d3.selectAll('.bar').style({
        opacity: 0.1
      });
      return d3.select('#bar-' + chartType + '-' + d.data.label).style({
        opacity: 1
      }).classed('activeBar', true);
    }).on('mouseout', function(d, i) {
      chartGroup.select('.edgeSlice' + i).transition().duration(300).style({
        'stroke-width': 1,
        'stroke': '#707070',
        'stroke-opacity': 0.6
      });
      allLabels.style({
        'font-size': labelSize
      });
      chartGroup.selectAll('.textGroup' + i + ' .bgLabel').attr({
        transform: function(d, i) {
          return "translate(" + arc.centroid(d) + ") rotate(0)";
        }
      }).style({
        'font-size': labelSize + bgLabelModifier
      });
      thisTextGroup.style({
        opacity: startingTextOpacity
      });
      iconGroup.style({
        opacity: startingIconOpacity
      });
      return d3.select('#bar-' + chartType + '-' + d.data.label).classed('activeBar', false);
    });
    if (callback) return callback();
  };
  createChart({
    labelSize: 14,
    radius: 68,
    chartType: 'gender',
    usePiePattern: true
  });
  createChart({
    labelSize: 17,
    radius: 160,
    innerRadius: 70,
    chartType: 'race',
    usePiePattern: true
  });
  createChart({
    labelSize: 16,
    radius: 270,
    innerRadius: 162,
    chartType: 'profession',
    usePiePattern: true
  });
  return createChart({
    labelSize: 17,
    radius: 350,
    innerRadius: 272,
    chartType: 'tradeskill',
    usePiePattern: true,
    callback: function() {
      return $('#loading').css({
        opacity: 0,
        display: 'none'
      });
    }
  });
};