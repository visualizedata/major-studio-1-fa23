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
const container = d3.select(".container")

// get the baby.json
d3.json('js/baby.json').then(function (babyData) {
    displayNewData(babyData);
});

// display data!
function displayNewData(data) {

    // add in new data using forEach
    data.forEach(
        (d) => {

            let attrs = d.Attr.sort((a, b) =>
                (order[a] || order.default) - (order[b] || order.default) ||
                a > b || -(a < b)
            );

            const name = d.Name

            const p = container.append("div")
                .attr("class", "box")

            const svg = p.append("div")
                .attr("class", "svg")

            attrs.forEach(
                (d) => {
                    svg.append("embed")
                        // this is calling the svg that has the corressponding name w/ the attr
                        .attr("src", "img/" + d + ".svg")
                        .attr("class", "graphic")
                }
            )

            p.append("p")
                .text(name)

        }
    )

    // select the label and change it into the attrs that the current person has
    d3.select("#label p").html("(" + attrs.map(d => " " + d) + " )")
}