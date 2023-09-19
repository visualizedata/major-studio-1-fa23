
// helper function to parse date information
let parseDate = d3.timeParse("%m/%d/%Y");

// let's load our data
d3.csv('data/prices.csv').then((data) => {

    //format our data (make data a date, make price a number) 
    data.forEach((n) => {
        n.month = parseDate(n.month);
        n.price = Number(n.price.trim().slice(1));
    })

    // defining our canvas
    let height = 300;
    let width = 500;

    // defining margins
    let margin = {left:50,right:50,top:40,bottom:0};

    // defining our max and mins
    let max = d3.max(data,(d) => { return d.price; });
    let minDate = d3.min(data,(d) => { return d.month; });
    let maxDate = d3.max(data,(d) => { return d.month; });

    // defining our scales
    let y = d3.scaleLinear()
                .domain([0, max])
                .range([height,0]);

    let x = d3.scaleTime()
                .domain([minDate, maxDate])
                .range([0, width]);

    // defining our axes
    let yAxis = d3.axisLeft(y);
    let xAxis = d3.axisBottom(x);

    // let's create an svg file and add it to the body
    let svg = d3.select("body").append("svg").attr("height","100%").attr("width","100%");


    // a graphic that sits within the svg and will hold our line chart
    let chartGroup = svg.append("g")
                .attr("transform","translate("+margin.left+","+margin.top+")");

    // defining our line function
    let line = d3.line().x((d) => { return x(d.month); }).y((d) => { return y(d.price); });

    // adding the line to the graphic                
    chartGroup
    .append("path")
    .attr("d",line(data));

    // adding the x axis to the graphic    
    chartGroup
    .append("g")
    .attr("class","x axis")
    .attr("transform","translate(0,"+height+")")
    .call(xAxis);

    // adding the y axis to the graphic
    chartGroup
    .append("g")
    .attr("class","y axis")
    .call(yAxis);
  });