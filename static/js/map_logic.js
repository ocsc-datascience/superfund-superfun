// Grabbing superfund site data..
var superfundSites = [];
var stateStats = [];

d3.json("/superfund_sites", function (data) {
  data.forEach(function (sqlitedata) {
    data.name = sqlitedata.name;
    data.address = sqlitedata.address;
    data.city = sqlitedata.city;
    data.state = sqlitedata.state;
    data.hrs_score = +sqlitedata.hrs_score;
    data.latitude = +sqlitedata.latitude;
    data.longitude = +sqlitedata.longitude;
    superfundSites.push(
      L.circleMarker([data.latitude, data.longitude],
        {
          radius: 10,
          fillColor: getColor(data.hrs_score),
          fillOpacity: .7,
          stroke: true,
          color: "black",
          weight: .5
        }
        //,{ icon: L.BeautifyIcon.icon(options) }
      ).bindPopup(data.name.bold() + "<br>" + data.address + "<br>" + data.city + ", " + data.state + "<br>" + "HRS Score: " + data.hrs_score.toString().bold()));
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

  // Add superfund and stateBoundary layers
  var superfundLayer = L.layerGroup(superfundSites);
  var stateBoundaries = new L.LayerGroup()

  // Overlays that may be toggled on or off
  var overlayMaps = {
    "Superfund Sites": superfundLayer,
    "State Boundaries": stateBoundaries
  };

  // Creating map object and set default layers
  var myMap = L.map("map", {
    center: [37.8283, -98.5795],
    zoom: 5,
    layers: [streetMap, superfundLayer, stateBoundaries]
  });


  // Pass map layers into layer control
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var geojson;

  // Add color to states
  function getStateColor(d) {
    return d > 1000 ? '#800026' :
      d > 500 ? '#BD0026' :
        d > 200 ? '#E31A1C' :
          d > 100 ? '#FC4E2A' :
            d > 50 ? '#FD8D3C' :
              d > 20 ? '#FEB24C' :
                d > 10 ? '#FED976' :
                  '#FFEDA0';
  }

  // Add style to assign state color based on population density
  function style(feature) {
    console.log(feature.properties)
    return {
//      fillColor: getStateColor(feature.properties.density),
      fillColor: getStateColor(feature.properties.state_stats.sf_site_count),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }

  // Highlight state on mouse over
  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  }

  // Reset on mouseout
  function resetHighlight(e) {
    geojson.resetStyle(e.target);
  }

  // Zoom to state on click
  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
  }

  // All features together
  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
    });
  }


  d3.json("/state_stats/get_data", function (data) {

    data.forEach(function (xdata) {
      var xstate = xdata.state;
      objIndex = statesData.features.findIndex((obj => obj.properties.name == xstate));
      statesData.features[objIndex].properties.state_stats = xdata;
    });

    // remove Puerto Rico
    statesData.features = statesData.features.filter(function (item) {
      return item.properties.name !== "Puerto Rico"
    });

    geojson = L.geoJson(statesData, {
      style: style,
      onEachFeature: onEachFeature
    }).addTo(stateBoundaries);

  });


  // Create legend
  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 10, 20, 30, 40, 50, 60, 70],
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
  return d > 70 ? '#b30000' :
    d > 60 ? '#e60000' :
      d > 50 ? '#FF3300' :
        d > 40 ? '#FF6600' :
          d > 30 ? '#FF9900' :
            d > 20 ? '#FFCC00' :
              d > 10 ? '#99FF00' :
                '#00FF00';
}
