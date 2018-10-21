// Link to superfund data
var link = "/superfund_sites";

// Grabbing our data..
var superfundSites = [];

d3.json(link, function(data) {
  // var superfundSites = [];  
  data.forEach(function(sqlitedata) {
    data.hrs_score = +sqlitedata.hrs_score;
    data.latitude = +sqlitedata.latitude;
    data.longitude = +sqlitedata.longitude;
    superfundSites.push(
        L.marker([data.latitude, data.longitude], {
          // icon: L.BeautifyIcon.icon(options)
        }).bindPopup(["<h2>" + data.name + "</h2><br>" + data.city + ", " + data.state + "<br>" + "HRS Score: " + data.hrs_score]));
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
      center: [39.8283, -98.5795],
        zoom: 4.2,
        layers: [streetMap, superfundLayer]
    });

    // Pass map layers into layer control
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  }
