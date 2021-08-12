// set up chart 
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 50,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// create an svg wrapper, append svg group to hold chart
var svg = d3.select('#scatter')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

var chartGroup = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

// get data from csv using d3.csv and format
d3.csv('data.csv').then(function(stateData) {
    stateData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
  });

// scaling functions   
    var xLinearScale = d3.scaleLinear()
        .domain([9, d3.max(stateData, d => d.poverty) + 1])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([4, d3.max(stateData, d => d.healthcare) + 2])
        .range([height, 0]);


// axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);  

// add in axis
    chartGroup.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append('g')
        .call(leftAxis);

    var circlesGroup = chartGroup.selectAll('circle')
        .data(stateData)
        .enter()
        .append('circle')
        .attr('cx', d => xLinearScale(d.poverty))
        .attr('cy', d => yLinearScale(d.healthcare))
        .attr('r', 10)
        .attr('fill', 'lightblue')
        .attr('opacity', '.5')
        .attr('stroke', 'white');    

        chartGroup.append('text')
        .style('text-anchor', 'middle')
        .style('font-family', 'sans-serif')
        .style('font-size', '8px')
        .selectAll('tspan')
        .data(stateData)
        .enter()
        .append('tspan')
        .attr('x', function(data) {
            return xLinearScale(data.poverty);
        })
        .attr('y', function(data) {
            return yLinearScale(data.healthcare -.02);
        })
        .text(function(data) {
            return data.abbr
        });

    // create axes labels  
    chartGroup.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left - 5)
        .attr('x', 0 - (height / 1.30))
        .attr('dy', '1em')
        .attr('class', 'axisText')
        .text('Lacks Healthcare (%)');

    chartGroup.append('text')
        .attr('transform', `translate(${width / 2.5}, ${height + margin.top + 30})`)
        .attr('class', 'axisText')
        .text('In Poverty (%)');
    
});