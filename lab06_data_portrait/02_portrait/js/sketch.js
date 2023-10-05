// select the big svg container
const svg = d3.select("#svg")

// order we will use to rearrange the data
const order = {
    clean: 1,
    playful: 2,
    behaved: 3,
    noisy: 4,
    poopy: 5,
    cute: 6,
    default: Number.MAX_VALUE
}

// which one is being selected?
let index = 0

// get the baby.json
d3.json('js/baby.json').then(function (babyData) {
    console.log(babyData)

    createButtons(babyData);
    activeButton("selected")
    displayNewData(babyData);
});

// create each button based on the data we have
function createButtons(data) {

    // only get all the Names!
    const names = data.map(d => d.Name)

    // make all these buttons
    const buttons = d3.select("#buttons")
        .selectAll("input")

        // the input data are names
        .data(names)
        .join("input")
        .attr("type", "button")

        // give them a className
        .attr("class", "nonSelected")

        // the value is the text on the data
        .attr("value", d => d)

        // what happens when you click on the button?
        .on("click", function (e, d) {

            // the active button turns into nonselected
            activeButton("nonSelected");

            // what's the index of the button that is being clicked?
            index = buttons.nodes()
                .indexOf(this);

            // turn the new active button into selected!
            activeButton("selected")

            // use d3.transition() to hide the former data portrait
            svg.transition()

                // the duration of the animation
                .duration(650)

                // an easing function for the animation
                // find more here: https://observablehq.com/@d3/easing-animations
                .ease(d3.easeCubicOut)

                // turn the big svg container into having opacity 0 === transparent
                .style('opacity', 0)

                // after this is done, display the new data
                .on("end", function () {
                    clearOldData()
                    displayNewData(data)
                });
        })
}

// a helper function for changing the state of our button
function activeButton(className) {
    d3.select(`input:nth-child(${index+1})`).attr("class", className);
}

function clearOldData() {
    // clear the old svg
    svg.html("")
}

// display data!
function displayNewData(data) {

    // we need to sort the attrs the way we want it to be
    // so when our svg overlays each other they won't block each other
    // Function found online to sort attributes
    let attrs = data[index].Attr.sort((a, b) =>
        (order[a] || order.default) - (order[b] || order.default) ||
        a > b || -(a < b)
    );


    // add in new data using forEach
    attrs.forEach(
        (d) => {
            svg.append("embed")
            // this is calling the svg that has the corressponding name w/ the attr
                .attr("src", "img/" + d + ".svg")
                .attr("class", "graphic")
        }
    )

    // select the label and change it into the attrs that the current person has
    d3.select("#label p").html("(" + attrs.map(d => " " + d) + " )")

    // face in our new data portrait using transition again!
    svg.transition()
        .delay(100)
        .duration(650)
        .ease(d3.easeCubicOut)
        .style('opacity', 1);
}