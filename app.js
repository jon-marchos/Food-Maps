console.log('mapboxgl:', mapboxgl); // Should log an object

// Access token
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9ud2FzaGVyZSIsImEiOiJjbTVhazNobDk0dmdyMmxxN2l0Yng3Yzg3In0.tOz-_LCUuf2v8DGDKlJVWA';

// Initialize the map
const map = new mapboxgl.Map({
    container: 'map', // ID of the div
    style: 'mapbox://styles/jonwashere/clz533n5602ze01qofnpm3gw3', // Custom style
    center: [-74.006, 40.7128], // Default center (New York City)
    zoom: 12 // Default zoom level
});

// Add map controls
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.FullscreenControl());
map.addControl(new mapboxgl.ScaleControl());

// Load the GeoJSON data
map.on('load', () => {
    // Add GeoJSON source
    map.addSource('food_ratings', {
        type: 'geojson',
        data: './food_ratings.geojson' // Ensure this path is correct
    });

    // Add a layer for the food points
    map.addLayer({
        id: 'food-points',
        type: 'circle',
        source: 'food_ratings',
        paint: {
            'circle-radius': [
                'interpolate',
                ['linear'],
                ['get', 'rating'],
                1, 4,  // Rating 1 -> circle size 4
                5, 10  // Rating 5 -> circle size 10
            ],
            'circle-color': [
                'interpolate',
                ['linear'],
                ['get', 'rating'],
                1, '#FFEDA0', // Light yellow for low rating
                5, '#F03B20' // Dark red for high rating
            ],
            'circle-opacity': 0.8
        }
    });

    // Add popup on click
    map.on('click', 'food-points', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const rating = e.features[0].properties.rating;
        const name = e.features[0].properties.name;

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(`<strong>${name}</strong><br>Rating: ${rating}`)
            .addTo(map);
    });

    // Change cursor to pointer on hover
    map.on('mouseenter', 'food-points', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'food-points', () => {
        map.getCanvas().style.cursor = '';
    });
});
