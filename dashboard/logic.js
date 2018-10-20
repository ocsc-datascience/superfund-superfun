// Create a map object
var myMap = L.map("map", {
  center: [37.09, 0],
  zoom: 2
});

L.tileLayer(
  "https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoicGFyeml2YWw2MTEiLCJhIjoiY2pteHBpbHptMTV2dDNwcnVmZXVwOTd1MCJ9.Zb8ZhLIxPuFEtEuuwglfhg"
).addTo(myMap);

var link = "http://localhost:5000/superfund_sites"


// Define a markerSize function that will give each earthquake a different radius based on magnitude
function markerSize(hrs_score) {
  return hrs_score * 2;
};

function markerColor(hrs_score) { 
  if (hrs_score <30) {return "#c7ff44"}
  else if (hrs_score < 40 ) {return "#00c889"}
  else if (hrs_score < 50 ) {return "#008395"}
  else {return "#003f5c"}
};


// Grabbing our GeoJSON data..
d3.json(link, function(data) {
  // Creating a geoJSON layer with the retrieved data
  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, 
          {
            color: "white",
            weight: 1,
            fillColor: markerColor(feature.properties.hrs_score),
            fillOpacity: 0.5,
            radius: markerSize(feature.properties.hrs_score)
            
          }
        )},
      
    

    // Called on each feature
    onEachFeature: function(feature, layer) {
      // Giving each feature a pop-up with information about the earthquake
      layer.bindPopup("<h4>" + feature.properties.title + "</h4> <p>Alert: " + feature.properties.alert + "</p>");

    }
  }).addTo(myMap);
});

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (hrs_score) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 30, 40, 50],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + markerColor(grades[i]) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);
