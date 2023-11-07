// ----------------------------------------------------------------------
// Variables
// -----------------------------------------------------------------------


// using constants makes it easy to update when values change
// many editors also autocomplete variable names
// by convention, constants in JS have UPPERCASE names

const CLASS = "class";
const SORT_BY = "petallength";
const TOOLTIP_WIDTH =  150;
const TOOLTIP_HEIGHT =  20;


// this will contain our data set
let data = [];

let dimensions = [window.innerWidth, window.innerHeight];

// we will have checkbox buttons for each of these
let checkboxValues = ['Iris-setosa', 'Iris-versicolor', 'Iris-virginica'];

// the state object will contain items that change in runtime and that we want to keep track
let state = {
  filters: {
    menu: checkboxValues,
    checked: checkboxValues,
  },
  tooltip: {
    value: "",
    visible: false,
    coordinates: [0, 0]
  }

};

// initializing these globally will be useful later
let xScale, yScale, colorScale;

// -----------------------------------------------------------------------
// Loading data
// -----------------------------------------------------------------------

// this function loads the data and then initiates everything
async function dataLoad() {
  
  // initialize the layout: We can do this before data has been loaded
  initializeLayout();

  // load external data file
  let source = await d3.json("./iris_json.json");

  // we're adding an additional attribute to each object
  source.forEach(
    (d, i) => {
       d.id = d[CLASS] + "_" + i; // need a unique ID here
    }
  )
  
  // and copy the data array into our global data variable
  data = Array.from(source);
  
  // drawing can only happen after data is here
  draw();

}

// -----------------------------------------------------------------------
// Events
// -----------------------------------------------------------------------

// when a checkbox has changed
function onCheckboxChange(d) {
  console.log(d.target.name)
  // first, was the clicked box already checked or not?
  // we do this by checking what index it has within the array
  const index = state.filters.checked.indexOf(d.target.name);
  
  // this array will hold the new checked values, whether something has been checked or unchecked
  let nextCheckedValues = Array.from(state.filters.checked);

  // if box is checked, uncheck it
  if (index > -1) {
    // take it out of the array of checked values
    nextCheckedValues.splice(index, 1)    

    // otherwise, add it to the checked values
  } else {
    nextCheckedValues.push(d.target.name);
  }

  // update the checked values in the state
  state.filters.checked = Array.from(nextCheckedValues);
  
  // and update the visualization
  draw();
}

// when a mouse moves over a bar
function onMouseEvent(d) {
  console.log(d.target.__data__);
  // when the cursor rolls over the bar, make the tooltip visible
  if (d.type === "mouseenter") {
    console.log("mouseenter")
    state.tooltip.value = d.target.__data__;
    state.tooltip.visible = true;
    state.tooltip.coordinates = [
      +d3.select(d.target).attr("width") + TOOLTIP_WIDTH / 2 + 10,
      +d3.select(d.target).attr("y") - TOOLTIP_HEIGHT / 2,
    ];
  // when the cursor moves off the bar, make the tooltip invisible
  } else if (d.type === "mouseleave") {
    console.log("mouseleave")
    state.tooltip.value = "";
    state.tooltip.visible = false;

  }
  // update the visualization
  draw();
}

// -----------------------------------------------------------------------
// Layout
// -----------------------------------------------------------------------


// this function sets up everything we can before data loads
function initializeLayout() {
  const svgWidth = 0.6 * dimensions[0];
  const svgHeight = dimensions[1];
  const margin = 120;

  const parent = d3.select(".interactive");
  const svg = parent
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // remember, we initialized these variables at the top
  xScale = d3.scaleLinear().range([margin, svgWidth - margin]);
  yScale = d3
    .scaleBand()
    .paddingInner(0.1)
    .range([margin, svgHeight - margin]);
  colorScale = d3.scaleOrdinal(d3.schemeDark2);

  // add x axis
  svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${svgHeight - margin})`);

  // add y axis
  svg
    .append("g")
    .attr("class", "axis y-axis")
    .attr("transform", `translate(${margin}, 0)`);

  // add the bars
  svg.append("g").attr("class", "bars");

  // add the tooltip
  const tooltip = svg.append("g").attr("class", "tooltip");
  tooltip
    .append("rect")
    .attr("height", TOOLTIP_HEIGHT)
    .attr("width", TOOLTIP_WIDTH)
    .attr("fill", "#aeaeae");
  tooltip
    .append("text")
    .attr("x", 5)
    .attr("y", 14)
    .attr("font-size", 12);

  // add left menu
  const leftMenu = parent.append("div").attr("class", "left-menu");
  leftMenu.append("div").attr("class", "title").html(`
      <h1>Fisher's Iris Dataset</h1>
      <h4>Which properties of a flower best distinguish it from other species?</h4>
    `);
  leftMenu.append("div").attr("class", "filters");

  // add checkboxes based on state.filters
  const checkRow = d3
    .select(".filters")
    .selectAll(".check-row")
    .data(state.filters.menu)
    .join("div")
    .attr("class", "check-row")
    .html(
      d => `
      <input name="${d}" type="checkbox" checked ></input>
      <label>${d}</label>
    `
    );
  // add the checkbox event  
  checkRow.select("input").on("change", onCheckboxChange);
}


// -----------------------------------------------------------------------
// Drawing
// -----------------------------------------------------------------------


// everything in this function depends on data, so the function is called after data loads and whenever state changes
function draw() {
  
  // filter data based on state.filters.checked
  let filteredData = data.filter(d => state.filters.checked.indexOf(d[CLASS]) > -1)
  
  // sort data descending
  filteredData.sort((a, b) => d3.descending(a[SORT_BY], b[SORT_BY]));

  // update our scales based on filteredData
  xScale.domain([0, d3.max(filteredData, d => d[SORT_BY] )]);
  yScale.domain(filteredData.map(d => d.id));
  colorScale.domain(state.filters.menu);
  const barHeight = yScale.bandwidth();

  // update our axes based on the updated scales
  d3.select(".x-axis").call(d3.axisBottom(xScale));
  d3.select(".y-axis").call(d3.axisLeft(yScale).tickValues([]));

  // where do we start drawing?
  const barX = xScale.range()[0];


  // update bars based on filteredData
  let bars = d3.select(".bars")
    .selectAll("rect")
    .data(filteredData)
    .join("rect")
    .attr("x", barX)
    .attr("width", d => xScale(d[SORT_BY]) - barX)
    .attr("height", barHeight)
    .attr("y", d => yScale(d.id))
    .attr("fill", (d, i) => colorScale(d[CLASS]))

  // mouse event
  bars.on("mouseenter", onMouseEvent)
   .on("mouseleave", onMouseEvent)
   .classed("highlight", d => d.id === state.tooltip.value.id);


    // update tooltip based on state.tooltip
    const tooltip = d3.select(".tooltip");    
    tooltip
      .attr(
        "transform",
        `translate(${state.tooltip.coordinates[0]}, ${
          state.tooltip.coordinates[1]
        })`
      )
      .classed("visible", state.tooltip.visible);
    tooltip.select("text").text(() => {
      const d = state.tooltip.value;
      return `${SORT_BY}: ${d[SORT_BY]}`;
    });


  }

// this function is only called once
dataLoad();
