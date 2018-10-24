// Grabbing superfund site data.
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
          fillColor: getColorSFSites(data.hrs_score),
          fillOpacity: .7,
          stroke: true,
          color: "black",
          weight: .5
        }
        //,{ icon: L.BeautifyIcon.icon(options) }
      ).bindPopup(data.name.bold() + "<br>" + data.address + "<br>" + data.city + ", " + data.state + "<br>" + "HRS Score: " + data.hrs_score.toString().bold()));
  });

  var statePopDensChloro;
  var stateCancerChloro;

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

    statePopDensChloro = createStateChloro("population_density");
    stateCancerChloro = createStateChloro("cancer_death_rate");
    stateHRSChloro = createStateChloro("avg_hrsscore");
    stateHRSChloro = createStateChloro("avg_hrsscore");
    stateIncomeChloro = createStateChloro("median_household_income")

    createMap(superfundSites,statePopDensChloro,
      stateCancerChloro,stateHRSChloro,stateIncomeChloro);

  });


  

});

function createStateChloro(prop) {

  var chloro = new L.LayerGroup();

  // All features together
  function XonEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
    });
  }

  // Add style to assign state color based on population density
  function Xstyle(feature) {
    // console.log(feature.properties)
    var prop_max = prop+"_max";
    var prop_min = prop+"_min";
    console.log(feature.properties.state_stats);

    return {
      fillColor: colorScale(feature.properties.state_stats[prop],
        feature.properties.state_stats[prop_min],
        feature.properties.state_stats[prop_max]),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }

  geojson = L.geoJson(statesData, {
      style: Xstyle,
      onEachFeature: XonEachFeature
   }).addTo(chloro);

  return chloro;
}


function createMap(superfundSites,statePopDensChloro,
  stateCancerChloro,stateHRSChloro,stateIncomeChloro) {

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
  var emptyLayer = new L.LayerGroup()

  // Overlays that may be toggled on or off
  var overlayMaps = {
    "Superfund Sites": superfundLayer,
 //   "State Boundaries": stateBoundaries
  };

  var overlayMapsAsBase = {
    "Nothing": emptyLayer,
    "Cancer Death Rate": stateCancerChloro,
    "Population Density": statePopDensChloro,
    "Avg. HRS Score": stateHRSChloro,
    "Avg. Income": stateIncomeChloro
  };

  // Creating map object and set default layers
  var myMap = L.map("map", {
    center: [37.8283, -98.5795],
    zoom: 5,
    layers: [streetMap, superfundLayer, statePopDensChloro]
  });


  // Pass map layers into layer control
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var xcontrol = L.control.layers(overlayMapsAsBase,{},{
    collapsed: false
  });
  myMap.addControl(xcontrol);


  // Create legend
  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 10, 20, 30, 40, 50, 60, 70],
      labels = [];

    // Loop through intervals to generate labels and colored squares for superfund hazard rank legend
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColorSFSites(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };

  legend.addTo(myMap);

}