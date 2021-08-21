mapboxgl.accessToken = maptoken;
var map = new mapboxgl.Map({
    container: 'cluster-map',
    style: 'mapbox://styles/mapbox/dark-v10',
    //INDIA LONGITUDE AND LATITUDE
    center: [78.9629, 20.5937],
    zoom: 4
});

//ADD ZOOM AND ROTATION CONTROLS TO THE MAP
map.addControl(new mapboxgl.NavigationControl(), "top-right");

map.on('load', function () {
    // ADD A NEW SOURCE FROM OUR GEOJSON DATA AND
    // SET THE 'CLUSTER' OPTION TO TRUE. GL-JS WILL
    // ADD THE POINT_COUNT PROPERTY TO YOUR SOURCE DATA.
    map.addSource('CAMPGROUNDS', {
        type: 'geojson',
        data: campgrounds,
        cluster: true,
        clusterMaxZoom: 14,  // MAX ZOOM TO CLUSTER POINTS ON
        clusterRadius: 50 // RADIUS OF EACH CLUSTER WHEN CLUSTERING POINTS (DEFAULTS TO 50)

    });

    //LAYER OF CIRCLE
    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'CAMPGROUNDS',
        filter: ['has', 'point_count'],
        paint: {
            // USE STEP EXPRESSIONS (HTTPS://DOCS.MAPBOX.COM/MAPBOX-GL-JS/STYLE-SPEC/#EXPRESSIONS-STEP)
            // WITH THREE STEPS TO IMPLEMENT THREE TYPES OF CIRCLES:
            //   * BLUE, 20PX CIRCLES WHEN POINT COUNT IS LESS THAN 100
            //   * YELLOW, 30PX CIRCLES WHEN POINT COUNT IS BETWEEN 100 AND 750
            //   * PINK, 40PX CIRCLES WHEN POINT COUNT IS GREATER THAN OR EQUAL TO 750
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#51bbd6',
                10,
                '#f1f075',
                50,
                '#f28cb1'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,
                10,
                28,
                50,
                38
            ]
        }
    });

    //LAYER OF COUNT TEXT ON CIRCLE
    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'CAMPGROUNDS',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    });

    //LAYER OF UNCLUSTERED POINT HOW IT SHOULD LOOK LIKE
    map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'CAMPGROUNDS',
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': 'red',
            'circle-radius': 5,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
        }
    });

    // INSPECT A CLUSTERS ON CLICK
    map.on('click', 'clusters', function (e) {
        var features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
        });
        var clusterId = features[0].properties.cluster_id;
        map.getSource('CAMPGROUNDS').getClusterExpansionZoom(
            clusterId,
            function (err, zoom) {
                if (err) return;

                map.easeTo({
                    center: features[0].geometry.coordinates,
                    zoom: zoom
                });
            }
        );
    });

    // WHEN A CLICK EVENT OCCURS ON A FEATURE IN
    // THE UNCLUSTERED-POINT LAYER, OPEN A POPUP AT
    // THE LOCATION OF THE FEATURE, WITH
    // DESCRIPTION HTML FROM ITS PROPERTIES.
    map.on('click', 'unclustered-point', function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        const { popupmarkup } = e.features[0].properties;

        // ENSURE THAT IF THE MAP IS ZOOMED OUT SUCH THAT
        // MULTIPLE COPIES OF THE FEATURE ARE VISIBLE, THE
        // POPUP APPEARS OVER THE COPY BEING POINTED TO.

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(popupmarkup)
            .addTo(map);
    });

    map.on('mouseenter', 'clusters', function () {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', function () {
        map.getCanvas().style.cursor = '';
    });
});