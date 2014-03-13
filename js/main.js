var geoTemplate, compassTemplate, waypointsTemplate; // caches for Handlebars.js templates
var waypoints = amplify.store("waypoints") || []; // try to get from local storage

// used to show words for headings
var cardinals= ["North", "East", "East", "South", "South", "West", "West", "North"];

document.addEventListener("deviceready", function(){
    // init the templates
    geoTemplate      = Handlebars.compile($("#geo-template").html());
    compassTemplate  = Handlebars.compile($("#compass-template").html());
    waypointsTemplate = Handlebars.compile($("#waypoints-template").html());

    // get the location and heading data
    navigator.geolocation.getCurrentPosition(onCurrentPosition, onError);
    navigator.compass.watchHeading(onCurrentHeading, onError, { frequency: 250 });
    
    // populate the waypoints template
    $("#waypoints-template").replaceWith(waypointsTemplate(waypoints));
});

function onCurrentPosition(position) {
    // populate the geo template and set a timer for another poll of GPS
    $("#geo-template").replaceWith(geoTemplate(position));
    setTimeout(navigator.geolocation.getCurrentPosition, 1e3, onCurrentPosition, onError);
}

function onCurrentHeading(heading) {
    // tweak the headings data for presentation
    heading.magneticCardinal = cardinals[Math.round(heading.magneticHeading / 45)];
    heading.magneticHeading = parseFloat(heading.magneticHeading).toFixed(2);
    
    // populate the template
    $("#compass-template").replaceWith(compassTemplate(heading));
}

function onError(err) {
    // oops!
}

/* Add a way point to the array */
function addWaypoint(latitude, longitude) {
    waypoints.push({
        latitude: latitude,
        longitude: longitude
    });
    updateWaypoints();
}

/* Remove a way point from the array */
function removeWaypoint(i) {
    waypoints.splice(i, 1);
    updateWaypoints();
}

/* Update the way points template and store the data in local storage  */
function updateWaypoints() {
    $("#waypoints-template").replaceWith(waypointsTemplate(waypoints));
    amplify.store("waypoints", waypoints);
}