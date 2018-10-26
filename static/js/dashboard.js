function buildMetadata() {
  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  idname = d3.select("#selDataset").property("value");
  d3.json("/superfund_sites/"+idname).then(function(metaData) {

    function pad(n) {
      return (n < 1000000) ? ("0" + n) : n;
    };
    
    var site_id = pad(metaData.site_id);
    console.log(idname);


      // Use d3 to select the panel with id of `#sample-metadata` and id of `#gauge`
      var metaPanel = d3.select("#sample-metadata");

      // Use `.html("") to clear any existing metadata and gauge
      metaPanel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.  
      // Object.entries(metaData).metaPanel.insert(`<tr>Name: ${name}`);
      d3.select("#sample-metadata")
        .html(`<h3>${metaData.name}<h3>
               <h5>Address: ${metaData.address}<br>
               City: ${metaData.city}<br>
               State: ${metaData.state}<br>
               Zip: ${metaData.xzip}<br>
               Latitude: ${metaData.latitude}<br>
               Longitude: ${metaData.longitude}<br>
               Hazard Rank: ${metaData.hrs_score}<br>
               <a href="https://cumulis.epa.gov/supercpad/cursites/csitinfo.cfm?id=${site_id}">EPA Website: ${metaData.name}</a></h5>`
              );

      d3.select("#sitemap_title").html(`Sattelite View: ${metaData.name}`);
      d3.select("#tableTitle").html(`Superfund Site Detail`);
   
      //   Object.entries(metaData).forEach( ([key, value]) => {
      //  // var row = metaPanel.insert("tr");
      //   var cell = metaPanel.insert("h6");
      //   var kontent = key + ": " + value;
      //   cell.text(kontent);
            // });
    });
}

function buildMap() {
  idname = d3.select("#selDataset").property("value");
  d3.json("/superfund_sites/"+idname).then(function(metaData) {
    var latitude = metaData.latitude;
    var longitude = metaData.longitude;

    document.getElementById('sitemap').innerHTML = "<div id='maptwo' style ='width: 25%; height: 40%;'></div>";
    
    // Add satelite tile layer
    var satelliteMap = new L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.satellite",
      accessToken: API_KEY
    });

    // Create map object
    var siteMap = new L.map("maptwo", {
      center: [latitude, longitude],
      zoom: 13,
      layers: [satelliteMap]
    
    });

  });
}

// Build the Gauge Chart
function buildGauge() {
  idname = d3.select("#selDataset").property("value");
  d3.json("/superfund_sites/"+idname).then(function(metaData) {

  gaugeTitle = (`Superfund Hazard Ranking System<br>${metaData.name}`);
  d3.select("#gaugeTitle").html(gaugeTitle);
    
  var hazardScore = metaData.hrs_score;
  console.log(hazardScore);
  
  var level = hazardScore * 2

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
    marker: { size: 15, color: '000000' },
    showlegend: false,
    id: 'scrubs/week',
    text: hazardScore,
    hoverinfo: 'text+name'
  },
  {
    values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
    rotation: 90,
    text: ["80-90", "70-80", "60-70", "50-60", "40-50", "30-40", "20-30", "10-20", "0-10", ""],
    textinfo: 'text',
    textposition: 'inside',
    marker: {
      colors: ['rgba(255,0,0,0.6)',
               'rgba(255,28,28,0.6)',
               'rgba(255,56,56,0.6)',
               'rgba(255,84,84,0.6)',
               'rgba(255,112,112,0.6)',
               'rgba(255,140,140,0.6)',
               'rgba(255,168,168,0.6)',
               'rgba(255,197,197,0.6)',
               'rgba(255,225,225,0.6)',
               '#FFFFFF',
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
      fillcolor: '000000',
      line: {
        color: '000000'
      }
    }],
    title: `<b>Superfund Site Hazard Ranking</b>`,
    height: 350,
    width: 450,
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 60,
      pad: 5
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

  Plotly.newPlot('gauge', data, layout, {displayModeBar: false});

});
}

function init() {

  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  
  // Create list of sample id's and use it to populate the select options
  d3.json("/superfund_sites").then(function(superfundData) {
    superfundData.forEach(function(data) {
      data.id = +data.id;
      data.idname = data.idname;
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
  // var sampleId = superfundData.map(d => d.id);
  var sampleIdName = superfundData.map(d => d.idname);
   
    sampleIdName.forEach((idname) => {
      selector
        .append("option")
        .text(idname)
        .property("value", idname);
  });
 
    // Use the first sample from the list to build the initial plots
    const firstSample = sampleIdName[0];
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