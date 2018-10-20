// Perform an API call to the USGS earthquake feed
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {       

  var earthquakes = L.geoJson(earthquakeData, {
    onEachFeature: function (feature, layer){
      layer.bindPopup("<h3>" + feature.properties.place + "<br> Magnitude: " + feature.properties.mag +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    },
    pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: feature.properties.mag * 35000,
          fillColor: getColor(feature.properties.mag),
          fillOpacity: .7,
          stroke: true,
          color: "black",
          weight: .5
      })
    }
  });

  // Sending earthquake layer to the createMap function
  createMap(earthquakes)
}

function createMap(earthquakes) {

  // Define map layers
  var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });
  var streetMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 18,
      id: "mapbox.streets",
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

  // Add a tectonic plate layer
  var tectonicPlates = new L.LayerGroup();

  // Create fault line layer
  var overlayMaps = {
    Earthquakes: earthquakes,
    "Tectonic Plates": tectonicPlates
  };

  // Create map, giving it the streetMap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [31.7, -7.09],
    zoom: 2.5,
    layers: [streetMap, earthquakes, tectonicPlates]
  });

   // Add Fault lines data
   d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json", function(plateData) {
     
    L.geoJson(plateData, {
       color: "orangered",
       weight: 2
     })
     .addTo(tectonicPlates);
   });

  // Create a layer control
  // Pass in baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Create legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
              grades = [0, 1, 2, 3, 4, 5],
              labels = [];

  // Loop through intervals to generate labels and colored squares for earthquake magnitude legend
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };

  legend.addTo(myMap);
}

function getColor(d) {
  return d > 5 ? '#FF3300' :
  d > 4  ? '#FF6600' :
  d > 3  ? '#FF9900' :
  d > 2  ? '#FFCC00' :
  d > 1   ? '#99FF00' :
            '#00FF00';
}

// function getRadius(value){
//   return value*35000;
// }

// map.on('zoomend', function() {
//   var currentZoom = map.getZoom();
//   earthquakes.setRadius(currentZoom);
// });