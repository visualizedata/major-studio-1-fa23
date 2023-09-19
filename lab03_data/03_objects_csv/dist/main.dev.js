"use strict";

var minObjects, maxObjects, minYear, maxYear;
var margin = 150; // JSON object to count occurances for each year

var counts = {};

function loadData() {
  d3.csv('data/1000_sample_objects.csv').then(function (data) {
    //format our data (make data a date, make price a number) 
    data.forEach(function (n, i) {
      // use regular expression to extract dates \b escape sequence, which matches any non-word character (word charaters are letters, digits and underscores)
      // https://www.regular-expressions.info/ https://www.regextester.com
      var re = /(?<!\.)\d+(?!\.)/g;
      var match = re.exec(n.displaydate);

      if (match > 0) {
        n.year = match[0];
        console.log(n.displaydate, n.year);
        counts[n.year] = counts[n.year] ? counts[n.year] + 1 : 1;
      }
    }); // console.log(counts);

    analyzeData(counts);
  });
}

loadData();

function analyzeData(counts) {
  console.log(counts); // Let's find out which year has the most items and which one has the least

  minObjects = 100000;
  maxObjects = 0;
  minYear = null;
  maxYear = null;

  for (var year in counts) {
    var value = counts[year];
    console.log(value);

    if (value > maxObjects) {
      maxObjects = value;
      maxYear = year;
    }

    if (value < minObjects) {
      minObjects = value;
      minYear = year;
    }
  }

  console.log("The Year " + maxYear + " has the most objects with " + counts[maxYear] + " items.");
  console.log("The Year " + minYear + " has the least objects with " + counts[minYear] + " items.");
}

function displayData() {
  // define dimensions and margins for the graphic
  var margin = {
    top: 100,
    right: 50,
    bottom: 100,
    left: 80
  };
  var width = window.innerWidth;
  var height = window.innerHeight; // let's define our scales.
  // yScale corresponds with amount of textiles per country

  var yScale = d3.scaleLinear().domain([0, maxObjects]).range([height - margin.bottom, margin.top]); // xScale corresponds with country names

  var xScale = d3.scaleBand().domain(allPlaces.map(function (d) {
    return d.name;
  })).range([margin.left, width - margin.right]);
  var sequentialScale = d3.scaleSequential().domain([0, d3.max(allPlaces, function (d) {
    return parseInt(d.count);
  })]).interpolator(d3.interpolateRdYlBu); // create an svg container from scratch

  var svg = d3.select('body').append('svg').attr('width', width).attr('height', height); // attach a graphic element, and append rectangles to it

  svg.append('g').selectAll('rect').data(allPlaces).join('rect').attr('x', function (d) {
    return xScale(d.name);
  }).attr('y', function (d) {
    return yScale(d.count);
  }).attr('height', function (d) {
    return yScale(0) - yScale(d.count);
  }).attr('width', function (d) {
    return xScale.bandwidth() - 2;
  }).style('fill', function (d) {
    return sequentialScale(d.count);
  }); // AXES
  // Y Axis

  var yAxis = d3.axisLeft(yScale).ticks(5);
  svg.append('g').attr('transform', "translate(".concat(margin.left, ",0)")).call(yAxis); // X Axis

  var xAxis = d3.axisBottom(xScale).tickSize(0);
  svg.append('g').attr('transform', "translate(0,".concat(height - margin.bottom, ")")).call(xAxis).selectAll('text').style('text-anchor', 'end').attr('dx', '-.6em').attr('dy', '-0.1em').attr('transform', function (d) {
    return 'rotate(-45)';
  }); // Labelling the graph

  svg.append('text').attr('font-family', 'sans-serif').attr('font-weight', 'bold').attr('font-size', 20).attr('y', margin.top - 20).attr('x', margin.left).attr('fill', 'black').attr('text-anchor', 'start').text('Proportion of population below international poverty line (%) by Country, Source: Poverty and Inequality Portal, World Bank');
}