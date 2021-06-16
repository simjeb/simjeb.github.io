// global var that defines the current bracket being
// shown in the 3D viewer
import { loadMeshFile } from "./3dwindow.js";

// the default model and axes
var selectedModel = 148
var xAxisColumn = 'mass'
var yAxisColumn = 'max_ver_magdisp'

var colNames = {
  'surface_area': 'Surface Area (mm^2)',
  'max_ver_magdisp': 'Max Displacement (mm)',
  'max_ver_stress': 'Max Stress (MPa)',
  'mass': 'Mass (kg)',
}

// set the dimensions and margins of the graph
var margin = {top: 120, right: 200, bottom: 60, left: 60},
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);
// var symbol = d3.scaleOrdinal(d3.symbols);
var color = d3.scaleOrdinal()
    .domain(['block', 'beam', 'flat', 'butterfly', 'arch', 'other'])
    .range([d3.interpolateViridis(0.0), 
      d3.interpolateViridis(0.2) , 
      d3.interpolateViridis(0.4), 
      d3.interpolateViridis(0.6), 
      d3.interpolateViridis(0.8) , 
      d3.interpolateViridis(1.0)]);


// append the svg obgect to the body of the page
var svg = d3.select('#scatterplot')
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


// helper function to convert strings to numbers in CSV
function convertNumbers(row) {
  var r = {};
  for (var k in row) {
    r[k] = +row[k];
    if (isNaN(r[k])) {
      r[k] = row[k];
    }
  }
  return r;
}

// read metadata
d3.csv("data/all_bracket_metadata.csv", convertNumbers).then(function(data) {

  // get x and y domains
  x.domain([0, d3.max(data, function(d) { return d[xAxisColumn]; })]);
  y.domain([0, d3.max(data, function(d) { return d[yAxisColumn]; })]);

  // build scatter plot
  var dataPoints = svg.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("r", 5)
      .attr("cx", function(d) { return x(d[xAxisColumn]); })
      .attr("cy", function(d) { return y(d[yAxisColumn]); })
      .style("fill", function(d) { return color(d.category);})

    // marker tool tips
   .on("mouseover", function(d) {
      svg.append('image')
      .attr('href', 'data/renderings/iso/'+d.id+'.png')
      .attr('class', 'imgTooltip')
      .attr("x", x(d[xAxisColumn])-75)
      .attr("y", y(d[yAxisColumn])-125)
    })
   .on("mouseout", function(d) {
    svg.selectAll('.imgTooltip')
    .remove()
    })
   .on("click", function(d) {
      // clicking a dot changes its class and loads the appropriate 3D model
      selectedModel = d.id
      selectModel(selectedModel)
   });

   // called when an model is selected
  function selectModel(modelId){
    console.log(modelId)
    // load the 3D model
    loadMeshFile(modelId)
    // reset the appearance of all dots
    d3.selectAll(".dot-selected")
    .attr("class", "dot")
    // update the appearance of the selected dot
    d3.selectAll('.dot')
      .data(data)
      .filter(function(d) { return d.id == modelId})
      .attr("class", "dot-selected")
  } 
  // select the initial model
  selectModel(selectedModel)

  // add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "axisColor")
      .attr('id', 'xAxis')
      .call(d3.axisBottom(x))
    // .append("text")
    //   .attr("class", "axisTitle")
    //   .attr("x", width/2)
    //   .attr("y", 40)
    //   .style("text-anchor", "middle")
    //   .text('Mass (kg)');

  // create a dropdown filter and add options dynamically
  d3.select('#scatterplot')
    .append('select')
    .attr("id", 'xAxisFilter')
    .attr('class', 'dropDownFilter')
    .style("bottom", "15px")
    .style("left", (width/2).toString()+"px")
    .selectAll('myOptions')
    .data(data.columns)
    .enter()
    .filter(function(d) { return colNames[d] !== undefined})
    .append('option')
    .text(function (d) { return colNames[d]; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button

  d3.select('#xAxisFilter')
    .property('value', xAxisColumn)
    .on("change", function(d) {
        // get the option that has been chosen
        xAxisColumn = d3.select(this).property("value")
        // run the updateChart function with this selected option
        console.log(xAxisColumn)
        updatePlot()
    })

  // add the Y Axis
  svg.append("g")
      .attr("class", "axisColor")
      .call(d3.axisLeft(y))
    // .append("text")
    //   .attr("class", "axisTitle")
    //   .attr("transform", "rotate(-90)")
    //   .attr("y", -30)
    //   .attr("x", -height/2)
    //   .style("text-anchor", "middle")
    //   .text("Max Displacement (mm)");

  d3.select('#scatterplot')
    .append('select')
    .attr("id", 'yAxisFilter')
    .attr('class', 'dropDownFilter')
    .style("bottom", (margin.bottom+height).toString()+"px")
    .style("left", "70px")
    .selectAll('myOptions')
    .data(data.columns)
    .enter()
    .filter(function(d) { return colNames[d] !== undefined})
    .append('option')
    .text(function (d) { return colNames[d]; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button

  d3.select('#yAxisFilter')
    .property('value', yAxisColumn)
    .on("change", function(d) {
        // get the option that has been chosen
        yAxisColumn = d3.select(this).property("value")
        // run the updateChart function with this selected option
        updatePlot()
    })


  // update the plot
  function updatePlot() {
    x.domain([0, d3.max(data, function(d) { return d[xAxisColumn]; })]);
    y.domain([0, d3.max(data, function(d) { return d[yAxisColumn]; })]);

    svg.select('#xAxis')
      .call(d3.axisBottom(x))
    svg.select('#yAxis')
      .call(d3.axisBottom(y))

    svg.selectAll(".dot,.dot-selected")
      .data(data)
      .transition()
        .duration(1000)
        .ease(d3.easeCubic)
        .attr("cx", function(d) { return x(d[xAxisColumn]); })
        .attr("cy", function(d) { return y(d[yAxisColumn]); })
  }
  
  //Clickable Legend
  const selmodel = SelectionModel();
  var LEGEND_HEIGHT = 450
  var legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter()
    .append("g")
        .on('click', (d, i) => selmodel.toggle(d))
        .on('dblclick', () => selmodel.clear())
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })


  const symbols = legend.append("circle")
    .attr("class", "dot")
    .attr("r", 5)
    .attr("fill", function(d) { return color(d);}) //cannot set a style here and an attribute on legend. ()
    .attr("transform", function(d, i) { 
        return "translate(" + (width -10) + "," + (LEGEND_HEIGHT+25) + ")";
    })
    

    // legend title
    svg.append('text')
    .attr('class', 'legendTitle')
    .attr("x", width)
    .attr("y", LEGEND_HEIGHT)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text('Design Category')

    // legend labels
    const labels = legend.append("text")
    .attr('class', 'legendLabel')
    .attr("x", width - 24)
    .attr("y", LEGEND_HEIGHT+25)
    .attr("dy", ".35em")
    .style('fill', 'white')
    .style("text-anchor", "end")
    .text(function(d) { return d; });

    legend.style('cursor', 'pointer');

    selmodel.on('change.legend', () => {
      symbols.attr('fill', d => selmodel.has(d) ? color(d) : 'rgba(205,205,205,.3)');
      labels.style('fill', d => selmodel.has(d) ? 'white' : '#fff') 
        
    });

    selmodel.on("change.chart", () => {
         dataPoints.style("fill", d => selmodel.has(d.category) ? color(d.category) : 'rgba(205,205,205,.3)')
                   
    });

    function SelectionModel(values) {
      const dispatch = d3.dispatch('change');
      const state = new Set(values);
      
      const api = {
        on:     (type, fn) => (dispatch.on(type, fn), api),
        clear:  () => (clear(), api),
        has:    value => !state.size || state.has(value),
        set:    value => (update(value, true), api),
        toggle: value => (update(value, !state.has(value)), api)
      };
      
      function clear() {
        if (state.size) {
          state.clear();
          dispatch.call('change', api, api);
        }
      }
      
      function update(value, add) {
        if (add && !state.has(value)) {
          state.add(value);
          dispatch.call('change', api, api);
        } else if (!add && state.has(value)) {
          state.delete(value);
          dispatch.call('change', api, api);
        }
      }
    
      return api;
    }

});