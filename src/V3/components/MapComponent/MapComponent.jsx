import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

import './MapComponent.scss';

function MapComponent() {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [selectedDataType, setSelectedDataType] = useState(null);

  useEffect(() => {
    mapboxgl.accessToken =
      'pk.eyJ1Ijoidm9pY3IiLCJhIjoiY2xud3lmb3l2MGV3bDJqbWM5azVnNDhzcCJ9.vMxi2CcEEbqvVgz2mVCetw';

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [70.008, 30.6871],
      zoom: 5,
      pitchWithRotate: false,
    });

    map.on('load', () => {
      map.loadImage(
        'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
        (error, image) => {
          if (error) throw error;
          map.addImage('custom-marker', image);

          // Add points for provinces
          const provincesData = [
            {
              type: 'Feature',
              properties: { name: 'ICT' },
              geometry: {
                type: 'Point',
                coordinates: [73.0551, 33.6844],
              },
            },
            {
              type: 'Feature',
              properties: { name: 'Northern Areas' },
              geometry: {
                type: 'Point',
                coordinates: [75.1983, 35.738],
              },
            },
            {
              type: 'Feature',
              properties: { name: 'Sindh' },
              geometry: {
                type: 'Point',
                coordinates: [68.7455, 25.1688],
              },
            },
            {
              type: 'Feature',
              properties: { name: 'KPK' },
              geometry: {
                type: 'Point',
                coordinates: [72.8038, 35.3191],
              },
            },
            {
              type: 'Feature',
              properties: { name: 'Balochistan' },
              geometry: {
                type: 'Point',
                coordinates: [65.9137, 28.4772],
              },
            },
            {
              type: 'Feature',
              properties: { name: 'Fata' },
              geometry: {
                type: 'Point',
                coordinates: [70.3639, 33.6844],
              },
            },
            {
              type: 'Feature',
              properties: { name: 'Punjab' },
              geometry: {
                type: 'Point',
                coordinates: [72.8558, 31.5497],
              },
            },
            {
              type: 'Feature',
              properties: { name: 'Kashmir' },
              geometry: {
                type: 'Point',
                coordinates: [73.7299, 34.2189],
              },
            },
          ];

          map.addSource('provinces-points', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: provincesData,
            },
          });

          map.addLayer({
            id: 'provinces-labels',
            type: 'symbol',
            source: 'provinces-points',
            layout: {
              'text-field': ['get', 'name'], // Display the province name
              'text-font': ['Open Sans Regular'],
              'text-size': 12,
              'text-anchor': 'top',
            },
            paint: {
              'text-color': '#000',
            },
          });
        }
      );
      // Add Pakistan Layer
      map.addSource('pakistan', {
        type: 'geojson',
        data: '/pakistan.geojson',
      });

      map.addLayer({
        id: 'pakistan-layer',
        type: 'fill',
        source: 'pakistan',
        layout: {},
        paint: {
          'fill-color': '#088',
          'fill-opacity': 0.8,
        },
      });

      // Add Province Layer
      map.addSource('provinces', {
        type: 'geojson',
        data: '/province.geojson', // Path to your provinces GeoJSON file
      });

      map.addLayer({
        id: 'provinces-layer',
        type: 'fill',
        source: 'provinces',
        layout: {},
        paint: {
          'fill-color': [
            'match',
            ['get', 'NAME_1'], // Replace with the actual property name
            'Punjab',
            '#cbf542', // Color for Punjab
            'Sind',
            '#33FF57', // Color for Sindh
            'N.W.F.P.',
            '#5733FF', // Color for KPK
            'Northern Areas',
            '#EDD435',
            'Baluchistan',
            '#FFD433', // Color for Balochistan
            'F.A.T.A.',
            '#35EDB0',
            'F.C.T.',
            '#97ED35',
            'Azad Kashmir',
            '#ED35DF',
            '#088', // Default color for other provinces
          ],
          'fill-opacity': 0.8,
        },
      });
      map.on('click', 'provinces-layer', e => {
        const provinceFeature = e.features[0];
        const provinceName = provinceFeature.properties.NAME_1;

        // Change the paint properties of provinces-layer
        map.setPaintProperty('provinces-layer', 'fill-color', [
          'match',
          ['get', 'NAME_1'],
          provinceName,
          '#FF5733',
          '#FFFFFF', // Set to white for other provinces
        ]);
      });
    });

    setMap(map);
    return () => map.remove();
  }, []);
  return (
    <div className="MapComponent">
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

export default MapComponent;
