
var geourl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var platedata = "static/data/PB2002_plates.json";
var faultlines = [];

d3.json(platedata).then(data => makeLayer(data))

function stylelines(feature) {
    return {
        fill: false,
        weight: 1,
        opacity: 1,
        color: 'yellow',

    };
}



  function makeLayer(jsondata) {
    faultlines = L.geoJson(jsondata, {style:stylelines});

  }




d3.json(geourl).then(function(data) {
    console.log(data.features)



    function markerColor(mag){
        switch (true) {
            case (mag>5):
                return "#bd0026";
            case (mag>4):
                return "#f03b20";          
            case (mag>3):
                return "#fd8d3c";
            case (mag>2):
                return "#feb24c";          
            case (mag>1):
                return "#fed976";
            default:
                return "#ffffb2";
        
    }}


    function circlemark(feature) {
        return {
            radius: feature.properties.mag*2,
            weight: 1,
            opacity: 1,
            color: 'black',
            fillOpacity: 0.7,
            fillColor: markerColor(feature.properties.mag)
        };
      };

      function onEachFeature(feature, layer) {
      
            layer.bindPopup(feature.properties.place  +"<br> Magnitude: " + feature.properties.mag);
        
      };



      
      var earthquakes = L.geoJSON(data.features, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) { return L.circleMarker(latlng, circlemark(feature));
      }
      });







    // grayscale map layer
    var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "light-v10",
        accessToken: API_KEY
      });

      // satellite map layer
      var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "satellite-v9",
        accessToken: API_KEY
      });


      // baseMaps layer group
      var baseMaps = {
        "Grayscale": grayscale,
        "Satellite": satellite,
      };

      // overlayMaps layer group
      var overlayMaps = {
        "Earthquakes": earthquakes,
        "Fault Lines": faultlines,
    };

      // set map area and intial layers
      var myMap = L.map("map", {
        center: [
          37.09, -95.71
        ],
        zoom: 5,
        layers: [grayscale,earthquakes,faultlines]
      });

      // add layer controls
      L.control.layers(baseMaps, overlayMaps, {
        collapsed: true
      }).addTo(myMap);

// add legend
var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1.5, 2.5, 3.5, 4.5, 5.5],
            labels = ["0-1","1-2","2-3","2-4","4-5","5+"];

        var listitems =[];

        for (var i = 0; i < grades.length; i++) {


            var item =
            "<li>" + '<i style="background:' + markerColor(grades[i]) + '"></i> ' +
               labels[i] +"</li>";

               listitems.push(item);
        }


        div.innerHTML += "<ul>" + listitems+ "</ul>"

        return div;
    };

    legend.addTo(myMap);


});