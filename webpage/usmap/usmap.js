function mag_to_color(mag) {
    return mag > 30 ? "#980043" :
        mag > 25 ? "#dd1c77" :
            mag > 20 ? "#df65b0" :
                mag > 15 ? "#c994c7" :
                    mag > 10 ? "#d4b9da" :
                        mag > 5 ? "#dadaeb" :
                            '#FFEDA0';

};

var cityMarkers = [];
// Loop through locations and create city and state markers
for (var i = 0; i < data.length; i++) {
    lat = data[i]['Geolocation'].split(',')[0].replace("(", "")
    long = data[i]['Geolocation'].split(',')[1].replace(")", "")
    percent_on_snap = data[i]['Percent_on_SNAP']
    var circle = L.circle([lat, long], {
        stroke: false,
        fillOpacity: 0.75,
        color: "#c994c7",
        fillColor: mag_to_color(data[i]['TEETHLOST_AdjPrev']),
        radius: percent_on_snap * 1200
    });
    cityMarkers.push(circle)
}

var lightmap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoibWR1cnN0MTIiLCJhIjoiY2pjc2FrOGFtMGI1MTJ3cXFvdXhzaHBkciJ9.5t4SPDU14v4XuvOilZLo5w"
);
var satmap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoibWR1cnN0MTIiLCJhIjoiY2pjc2FrOGFtMGI1MTJ3cXFvdXhzaHBkciJ9.5t4SPDU14v4XuvOilZLo5w"
);
var darkmap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoibWR1cnN0MTIiLCJhIjoiY2pjc2FrOGFtMGI1MTJ3cXFvdXhzaHBkciJ9.5t4SPDU14v4XuvOilZLo5w"
);

var cities = L.layerGroup(cityMarkers);
var myStyle = {
    "color": "#f768a1",
    "weight": 2,
    "opacity": 0.45,
    "fillOpacity": 0
};


// Create a baseMaps object
var baseMaps = {
    "Light Map": lightmap,
    "Dark Map": darkmap,
    "Satellite": satmap
};

// Define a map object
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [lightmap, cities]
});

var overlayMaps = {
    "Tooth Loss": cities
};


// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);


var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0.0, 5, 10, 15, 20, 25, 30],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + mag_to_color(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);
//};