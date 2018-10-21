// Read in data from the app.py
d3.json("/superfund_sites", function(superfundData) {
  var superfundSites = [];  
  superfundData.forEach(function(data) {
     data.hrs_score = +data.hrs_score;
     data.latitude = +data.latitude;
     data.longitude = +data.longitude;

     superfundSites.push(L.marker([data.latitude, data.longitude])
                   .bindPopup(data.name + "<br>" +
                             data.address + "<br>" +
                             data.city + ", " + data.state + "  " + data.xzip + "<br>" +
                             "HRS Score: " + data.hrs_score + "<br>" +
                             "NLP Status: " + data.nlp_status)
                  )
  
  });
  // Sending superfund layer to the createMap function  
  // createMap(superfundSites);
  console.log(superfundSites);
});

function createMap(superfundSites) {

  // Define map layers
  var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.satellite",
      accessToken: API_KEY
  });
  var streetMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: API_KEY
  });
  var lightMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
  });
  

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satellite Map": satelliteMap,
    "Street Map": streetMap,
    "Light Map": lightMap
  };

  // Add a income layer
  // var income = new L.LayerGroup();
  
  // Create income layer
  var overlayMaps = {
    Superfunds: superfundSites
    // ,"Median Household Income": income
  };

// Create map, giving it the streetMap and superfund and income layers to display on load
var myMap = L.map("mapid").setView([39.8283, -98.5795], 4.2)
//   layers: [streetMap, overlayMaps]
// });

  //  Add Fault lines data
  //  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json", function(incomeData) {
     
  //   L.geoJson(incomeData, {
  //      color: "orangered",
  //      weight: 2
  //    })
  //    .addTo(income);
  //  });

  // Create a layer control
  // Pass in baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
  // Create legend
  // var legend = L.control({position: 'bottomright'});

  // legend.onAdd = function (myMap) {

  //   var div = L.DomUtil.create('div', 'info legend'),
  //             grades = [0, 1, 2, 3, 4, 5],
  //             labels = [];

//   // Loop through intervals to generate labels and colored squares for income legend
//     for (var i = 0; i < grades.length; i++) {
//         div.innerHTML +=
//             '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
//             grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
//     }
//     return div;
//   };

//   legend.addTo(myMap);
// }

// function getColor(d) {
//   return d > 5 ? '#FF3300' :
//   d > 4  ? '#FF6600' :
//   d > 3  ? '#FF9900' :
//   d > 2  ? '#FFCC00' :
//   d > 1   ? '#99FF00' :
//             '#00FF00';
// }

// $(window).on("resize", function () { $("#map").height($(window).height()); map.invalidateSize(); }).trigger("resize");

// function getRadius(value){
//   return value*35000;
// }

// map.on('zoomend', function() {
//   var currentZoom = map.getZoom();
//   earthquakes.setRadius(currentZoom);
// });