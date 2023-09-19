// helper function to parse date information
let parseDate = d3.timeParse("%m/%d/%Y");

// let's load our data
d3.csv('data/prices.csv').then((data) => {
    //format our data (make data a date, make price a number) 
    data.forEach(function(n){
        n.month = parseDate(n.month); // what does this do?
        n.price = Number(n.price.trim().slice(1)); // what does this do?
    })

    // select the html body and add a div with one price
    d3.select('body')                
        .append('div')
        .html("The first price is: " + data[0].price);    

    //write out the entire data set in html
    // d3.select('#data')
    //     .selectAll('p')
    //     .data(data)
    //     .join('p')
    //     .html(d => "$"+d.price+ " on " + d.month);
}); 