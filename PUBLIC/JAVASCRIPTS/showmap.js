mapboxgl.accessToken = maptoken;
const map = new mapboxgl.Map({
    container: "map", // CONTAINER ID
    style: "mapbox://styles/mapbox/streets-v11", // STYLE URL
    center: campground.geometry.coordinates, // STARTING POSITION [LONGITUDE, LATITUDE]
    zoom: 10, // STARTING ZOOM
});
new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        // SETS A POPUP ON THIS MARKER
        //SETHTML,SETTEXT
        new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h5>${campground.title}</h5><p>${campground.location}</p>`
        )
    )
    .addTo(map);

//ADD ZOOM AND ROTATION CONTROLS TO THE MAP
map.addControl(new mapboxgl.NavigationControl(), "top-right");