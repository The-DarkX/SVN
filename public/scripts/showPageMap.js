mapboxgl.accessToken = "pk.eyJ1IjoidGhlZGFya3giLCJhIjoiY2xndnU0bTltMnEzcDNycDM3ajV1aWhsMyJ9.ojoR99-t6eUNrUsgy-JVCA"
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v11', // stylesheet location
    center: location.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
})

map.addControl(new mapboxgl.NavigationControl())


new mapboxgl.Marker()
    .setLngLat(location.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${location.title}</h3><p>${location.address}</p>`
            )
    )
    .addTo(map)