function buildMetadata() {
  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  id = d3.select("#selDataset").property("value");
  d3.json("/superfund_sites/"+id).then(function(metaData) {
    
      // Use d3 to select the panel with id of `#sample-metadata` and id of `#gauge`
      var metaPanel = d3.select("#sample-metadata");

      // Use `.html("") to clear any existing metadata and gauge
      metaPanel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.  
    
        Object.entries(metaData).forEach( ([key, value]) => {
       // var row = metaPanel.insert("tr");
        var cell = metaPanel.insert("p");
        var kontent = key + ": " + value;
        cell.text(kontent);
            });
    });
}

function buildMap() {
  id = d3.select("#selDataset").property("value");
  d3.json("/superfund_sites/"+id).then(function(metaData) {
    var latitude = +metaData.latitude;
    var longitude = +metaData.longitude;
    
    // var mapPanel = d3.select("#map2");

    // Use `.html("") to clear any existing metadata and gauge
    // mapPanel.html("");

    // Add satelite tile layer
    var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
      maxZoom: 14,
      id: "mapbox.satellite",
      accessToken: API_KEY
    });

    // Create map object
    var siteMap = L.map("maptwo", {
      center: [latitude, longitude],
      zoom: 14,
      layers: [satelliteMap]
    });

  });
}

// Build the Gauge Chart
function buildGauge() {
  id = d3.select("#selDataset").property("value");
  d3.json("/superfund_sites/"+id).then(function(metaData) {
  
  var hazardScore = metaData.hrs_score;
  console.log(hazardScore);
  
  var level = hazardScore * 2.25

  var degrees = 180 - level,
    radius = .5;
  var radians = degrees * Math.PI / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Path: may have to change to create a better triangle
  var mainPath = 'M -.0 -0.01 L .0 0.01 L ',
    pathX = String(x),
    space = ' ',
    pathY = String(y),
    pathEnd = ' Z';
  var path = mainPath.concat(pathX, space, pathY, pathEnd);

  var data = [{
    type: 'scatter',
    x: [0], y: [0],
    marker: { size: 15, color: '850000' },
    showlegend: false,
    id: 'scrubs/week',
    text: hazardScore,
    hoverinfo: 'text+name'
  },
  {
    values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
    rotation: 90,
    text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
    textinfo: 'text',
    textposition: 'inside',
    marker: {
      colors: ['rgba(0, 65, 0, .5)',
               'rgba(15, 95, 10, .5)',
               'rgba(40, 120, 20, .5)',
               'rgba(110, 160, 50, .5)',
               'rgba(160, 177, 95, .5)',
               'rgba(195, 195, 115, .5)',
               'rgba(225, 210, 130, .5)',
               'rgba(235, 220, 155, .5)',
               'rgba(245, 230, 200, .5)',
               'rgba(255, 255, 255, 0)'
              ]
    },
    labels: ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0'],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
  }];

  var layout = {
    shapes: [{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
    title: '<b>Superfund Site Hazard Ranking System</b>',
    height: 450,
    width: 400,
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 100,
      pad: 0
    },
    xaxis: {
      zeroline: false, showticklabels: false,
      showgrid: false, range: [-1, 1]
    },
    yaxis: {
      zeroline: false, showticklabels: false,
      showgrid: false, range: [-1, 1]
    }
  };

  Plotly.newPlot('gauge', data, layout);

});
}

// function buildCharts() {
//   // @TODO: Use `d3.json` to fetch the sample data for the plots
//   id = d3.select("#selDataset").property("value");
//   d3.json("/samples/"+id).then(function(sampleResponse) {
      
//       var sampleData = sampleResponse;
//       //var sampleData = sampleResponse.sort(function(a, b) {return a.sample_values - b.sample_values});
//       var sample_values = sampleData.sample_values;
//       var otu_ids = sampleData.otu_ids;
//       var otu_labels = sampleData.otu_labels;

//       //1) combine arrays:
//       var sort_values = [];
//       for ( var j=0; j < sample_values.length; j++)
//         sort_values.push({'sample_values': sample_values[j], 'otu_ids': otu_ids[j], 'otu_labels': otu_labels[j]});
//         sort_values[sample_values[j]] = otu_labels[j];
      
//       //2) sort:
//       sort_values.sort(function(a, b) {
//         return ((a.sample_values > b.sample_values) ? -1 : ((a.sample_values == b.sample_values) ? 0 : 1));
//       });

//       //3) separate them back out
//       for (var k = 0; k < sort_values.length; k++) {
//         sample_values[k] = sort_values[k].sample_values;
//         otu_ids[k] = sort_values[k].otu_ids;
//         otu_labels[k] = sort_values[k].otu_labels;
//       }

      
//       // Build a Bubble Chart using sample data
//       var trace1 = {
//         x: otu_ids,
//         y: sample_values,
//         mode: 'markers',
//         hoverinfo: 'text',
//         colorscale: 'earth',
//         marker:
//          {size: sample_values,
//           color: otu_ids,
//           colorscale: [
//             ['0.0', 'rgb(0, 0, 100)'],
//             ['0.111111111111', 'rgb(25, 100, 200)'],
//             ['0.222222222222', 'rgb(50, 150, 175)'],
//             ['0.333333333333', 'rgb(75, 200, 150)'],
//             ['0.444444444444', 'rgb(75, 250, 100)'],
//             ['0.555555555556', 'rgb(125, 250, 100)'],
//             ['0.666666666667', 'rgb(150, 200, 75)'],
//             ['0.777777777778', 'rgb(175, 150, 50)'],
//             ['0.888888888889', 'rgb(200, 100, 25)'],
//             ['1.0', 'rgb(225, 50, 0)']
//           ],
//           cmin: 0,
//           cmax: 3500,
//           },
//         text: otu_labels,
//       };

//       var data = [trace1];

//       var layout = {
//         showlegend: false,
//         height: 400,
//         width: 1200,
//         margin: {
//           b: 20,
//           t: 0,
//           pad: 0
//         }
//       };

//       Plotly.react("bubble", data, layout);

//       // Build a Pie Chart using sample data
//       var data = [{
//         values: sample_values.slice(0, 10),
//         labels: otu_ids.slice(0, 10),
//         hovertext: otu_labels.slice(0, 10),
//         type: "pie"
//       }];

//       var layout = {
//         height: 350,
//         width: 350,
//         margin: {
//           b: 0,
//           t: 0,
//           l: 0,
//           r: 0,
//           pad: 0,
//         }
//       };

//       Plotly.react("pie", data, layout);
    
//   });
// }

function init() {

  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  
  // Create list of sample id's and use it to populate the select options
  d3.json("/superfund_sites").then(function(superfundData) {
    superfundData.forEach(function(data) {
      data.id = +data.id;
      data.epa_id = data.epa_id;
      data.site_id = +data.site_id;
      data.name = data.name;
      data.address = data.address;
      data.city = data.city;
      data.state = data.state;
      data.xzip = data.xzip;
      data.latitude = +data.latitude;
      data.longitude = +data.longitude;
      data.hrs_score = +data.hrs_score;
  });
  var sampleId = superfundData.map(d => d.id);
   
    sampleId.forEach((id) => {
      selector
        .append("option")
        .text(id)
        .property("value", id);
  });
 
    // Use the first sample from the list to build the initial plots
    const firstSample = sampleId[0];
    // buildCharts(firstSample);
    buildMetadata(firstSample);
    buildGauge(firstSample);
    buildMap(firstSample);
    console.log(firstSample);
  });  
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  // buildCharts(newSample);
  buildMetadata(newSample);
  buildGauge(newSample);
  buildMap(newSample);
  console.log(newSample);
}
// Initialize the dashboard
init();