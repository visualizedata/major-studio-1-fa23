let minObjects, maxObjects, minYear, maxYear;
let margin = 150;

// JSON object to count occurances for each year
let counts = {};
let years = [];

function loadData() { 
  d3.csv('data/1000_sample_objects.csv').then(function(data) {
    //format our data (make data a date, make price a number) 
    data.forEach(function(n, i) {
      // https://www.regular-expressions.info/ https://www.regextester.com
      // \d is a digit (a character in the range [0-9]), and + means one or more times. Thus, \d+ means match one or more digits
      const re = /\d+/;
      const hasDate = re.exec(n.displaydate);
      if (hasDate > 0) {
        n.year = hasDate[0];
        // log input and output
        // console.log(n.displaydate, n.year);
        counts[n.year] = counts[n.year] ? counts[n.year] + 1 : 1;
      }
    })
    // console.log(counts);
    analyzeData(counts);
  });
}

loadData();

function analyzeData(counts){
  console.log(counts);
  // Let's find out which year has the most items and which one has the least
  minObjects = 100000;
  maxObjects = 0;
  minYear = null;
  maxYear = null;

  for (var year in counts){
    let value = counts[year];
    if(value > maxObjects){
      maxObjects = value;
      maxYear = year;
    }
    if(value < minObjects){
      minObjects = value;
      minYear = year;
    }
    years.push({
      name: year,
      count: value
    });
  }
  console.log("The Year " + maxYear + " has the most objects with " + counts[maxYear] + " items.");
  console.log("The Year " + minYear + " has the least objects with " + counts[minYear] + " items.");
  displayData(counts);
}


function displayData(counts){

  // define dimensions and margins for the graphic
  const margin = ({top: 100, right: 50, bottom: 100, left: 80})
  const width = window.innerWidth*3;
  const height = window.innerHeight;

  // let's define our scales.
  // yScale corresponds with amount of textiles per country
  const yScale = d3.scaleLinear()
                   .domain([0, maxObjects])
                   .range([height - margin.bottom, margin.top]);

  // xScale corresponds with country names
  const xScale = d3.scaleBand()
                 .domain(years.map(d => d.name))
                .range([margin.left, width - margin.right])

  const sequentialScale = d3.scaleSequential()
                            .domain([0, maxObjects])
                            .interpolator(d3.interpolateRdYlBu);

  // create an svg container from scratch
  const svg = d3.select('body')
                .append('svg')
                .attr('width', width)
                .attr('height', height)

  // attach a graphic element, and append rectangles to it
  svg.append('g')
     .selectAll('rect')
     .data(years)
     .join('rect')
     .attr('x', function(d){return xScale(d.name) })
     .attr('y', function(d){return yScale(d.count) })
     .attr('height', function(d){return yScale(0)-yScale(d.count) })
     .attr('width', function(d){return xScale.bandwidth() - 2 })
     .style('fill', function(d) {return sequentialScale(d.count);});


  // AXES

  // Y Axis
  const yAxis =  d3.axisLeft(yScale).ticks(5)

  svg.append('g')
  .attr('transform', `translate(${margin.left},0)`)
  .call(yAxis);

  // X Axis
  const xAxis =  d3.axisBottom(xScale).tickSize(0);
  svg.append('g')
  .attr('transform', `translate(0,${height - margin.bottom})`)
  .call(xAxis)
  .selectAll('text')
  .style('text-anchor', 'end')
  .attr('dx', '-.6em')
  .attr('dy', '-0.1em')
  .attr('transform', function(d) {return 'rotate(-45)' });

  // Labelling the graph
  svg.append('text')
  .attr('font-family', 'sans-serif')
  .attr('font-weight', 'bold')
  .attr('font-size', 20)
  .attr('y', margin.top-20)
  .attr('x', margin.left)
  .attr('fill', 'black')
  .attr('text-anchor', 'start')
  .text('Number of collection object per year in NGA sample data (1000 objects)');
}