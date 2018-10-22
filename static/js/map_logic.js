// Link to superfund data
var link = "/superfund_sites";

// Grabbing our data..
var superfundSites = [];

d3.json(link, function(data) {
  data.forEach(function(sqlitedata) {
    data.name = sqlitedata.name;
    data.address = sqlitedata.address;
    data.city = sqlitedata.city;
    data.state = sqlitedata.state;
    data.hrs_score = +sqlitedata.hrs_score;
    data.latitude = +sqlitedata.latitude;
    data.longitude = +sqlitedata.longitude;
    superfundSites.push(
        L.circleMarker([data.latitude, data.longitude],
            {radius: 10,
            fillColor: getColor(data.hrs_score),
            fillOpacity: .7,
            stroke: true,
            color: "black",
            weight: .5
            }
          //,{ icon: L.BeautifyIcon.icon(options) }
          ).bindPopup(data.name.bold() + "<br>" + data.address + "<br>" + data.city + ", " + data.state + "<br>" + "HRS Score: " + data.hrs_score.toString().bold() ));
  });

  createMap(superfundSites)

});

function createMap(superfundSites) {

    // Define tile layers
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

    var superfundLayer = L.layerGroup(superfundSites);

    // Overlays that may be toggled on or off
    var overlayMaps = {
      "Superfund Sites": superfundLayer
    };

    // Creating map object and set default layers
    var myMap = L.map("map", {
      center: [37.8283, -98.5795],
        zoom: 5,
        layers: [streetMap, superfundLayer]
    });

    // Pass map layers into layer control
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  

  // Create legend
  var legend = L.control( {position: 'bottomright'});

  legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
              grades = [0, 10, 20, 30, 40, 50],
              labels = [];

  // Loop through intervals to generate labels and colored squares for superfund hazard rank legend
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
    return d > 50 ? '#FF3300' :
    d > 40  ? '#FF6600' :
    d > 30 ? '#FF9900' :
    d > 20 ? '#FFCC00' :
    d > 10  ? '#99FF00' :
              '#00FF00';
  }