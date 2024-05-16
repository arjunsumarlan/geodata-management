import React from "react";
import dynamic from "next/dynamic";

const MapWithNoSSR = dynamic(() => import("./LeafletMap"), {
  ssr: false, // This line is crucial to prevent server-side rendering
});

const MapDisplay: React.FC<MapDisplayProps> = ({ geojsonData }) => {
  return <MapWithNoSSR geojsonData={geojsonData} />;
};

export default MapDisplay;
