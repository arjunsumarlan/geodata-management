import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { GeoJsonObject } from "geojson";
import L from "leaflet";

const myIcon = L.icon({
  iconUrl: "../assets/map-marker.webp",
  iconSize: [38, 55],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
});

const MapContent: React.FC<MapContentProps> = ({ geojsonData }) => {
  const map = useMap();

  useEffect(() => {
    const geoJsonLayer = L.geoJSON(geojsonData as any, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: myIcon });
      },
      onEachFeature: function (feature, layer) {
        if (feature.properties) {
          let popupContent = `<div>${feature.properties.name}</div>`;
          if (feature.properties.description) {
            popupContent += `<p>${feature.properties.description}</p>`;
          }
          layer.bindPopup(popupContent);
        }
      },
    }).addTo(map);

    const bounds = geoJsonLayer.getBounds();
    if (bounds.isValid()) {
      map.flyToBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      geoJsonLayer.remove();
    };
  }, [geojsonData, map]);

  return null;
};

interface LeafletMapProps {
  geojsonData: GeoJsonObject;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ geojsonData }) => {
  return (
    <MapContainer center={[0, 0]} zoom={0} className="h-60 mt-5">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapContent geojsonData={geojsonData} />
    </MapContainer>
  );
};

export default LeafletMap;
