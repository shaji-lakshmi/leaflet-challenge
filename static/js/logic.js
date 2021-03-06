var myMap = L.map("map", {
    center: [37.7749, -122.4194],
    zoom: 8
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// do all week json
var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(geoData).then(function (data) {
    console.log(data);

    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: .5,
            fillColor: getColor(feature.properties.mag),
            color: "black",
            radius: getRadius(feature.properties.mag),
            weight: 1.5
        };
    }

    function getColor(magnitude) {
           if( magnitude > 5){
            return "red";
           } else if(magnitude > 4){
            return "orange";
           }else if(magnitude > 3){
            return "yellow";
           }else if(magnitude > 2){
            return "lime";
           }else if(magnitude > 1){
            return "green";
           }else{
               return "grey";
           }
    }
    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }

        return magnitude * 4;
    }

    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInfo,
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
    }).addTo(myMap);

    var legend = L.control({
        position: "bottomright"
    });

    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");

        var magnitude = [0, 1, 2, 3, 4, 5];
        var colors = [
            "grey",
            "green",
            "lime",
            "yellow",
            "orange",
            "red"
        ];
        var labels = [];
            
            for (var i = 0; i < magnitude.length; i++) {
                labels.push("<li style=\"background-color: " + colors[i] + "\">" + magnitude[i] + "&ndash;" + magnitude[i + 1] + "</li>");
            }
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };

    legend.addTo(myMap);

});
