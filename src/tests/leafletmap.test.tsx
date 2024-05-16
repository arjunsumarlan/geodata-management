import React from "react";
import { render, waitFor } from "@testing-library/react";
import { GeoJsonObject } from "geojson";
import LeafletMap from "@/components/LeafletMap";
import L from "leaflet";
import "jest-canvas-mock";

// Mocking the Leaflet library
jest.mock("leaflet", () => {
  return {
    marker: jest.fn(() => ({
      toGeoJSON: jest.fn(),
      getLatLng: jest.fn(),
      setLatLng: jest.fn(),
      setZIndexOffset: jest.fn(),
      getIcon: jest.fn(),
      setIcon: jest.fn(),
      setOpacity: jest.fn(),
      getElement: jest.fn(),
    })),
    map: jest.fn(() => ({
      addLayer: jest.fn(),
      removeLayer: jest.fn(),
      setView: jest.fn(),
      flyToBounds: jest.fn(),
      getBounds: jest.fn(() => ({
        isValid: jest.fn(() => true),
      })),
    })),
    geoJSON: jest.fn(() => ({
      addTo: jest.fn().mockReturnThis(),
      getBounds: jest.fn(() => ({
        isValid: jest.fn(() => true),
      })),
      remove: jest.fn(),
    })),
    icon: jest.fn(() => ({})),
  };
});

interface MapContainerProps {
  children: React.ReactNode;
}

jest.mock("react-leaflet", () => {
  return {
    MapContainer: ({ children } : MapContainerProps) => (
      <div className="leaflet-container">{children}</div>
    ),
    TileLayer: () => <div />,
    useMap: () => ({
      flyToBounds: jest.fn(),
      addLayer: jest.fn(),
      removeLayer: jest.fn(),
    }),
  };
});

describe("LeafletMap Component", () => {
  const geojsonData = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [102.0, 0.5],
        },
        properties: {
          name: "Test Point",
          description: "This is a test point.",
        },
      },
    ],
  };

  it("renders the LeafletMap component", async () => {
    const { container } = render(
      <LeafletMap geojsonData={geojsonData as GeoJsonObject} />
    );

    // Check if MapContainer is rendered
    const mapContainer = container.querySelector(".leaflet-container");
    expect(mapContainer).toBeInTheDocument();
  });

  it("adds GeoJSON data to the map", async () => {
    const { getByText } = render(
      <LeafletMap geojsonData={geojsonData as GeoJsonObject} />
    );

    await waitFor(() => {
      expect(L.geoJSON).toHaveBeenCalledWith(geojsonData, expect.any(Object));
    //   expect(L.geoJSON().addTo).toHaveBeenCalled();
    });
  });

  it('adds GeoJSON data to the map', async () => {
    render(<LeafletMap geojsonData={geojsonData as GeoJsonObject} />);

    await waitFor(() => {
      expect(L.geoJSON).toHaveBeenCalledWith(
        geojsonData,
        expect.objectContaining({
          pointToLayer: expect.any(Function),
          onEachFeature: expect.any(Function),
        })
      );

      const geoJsonLayer = (L.geoJSON as jest.Mock).mock.results[0].value;
      expect(geoJsonLayer.addTo).toHaveBeenCalled();
    });
  });

  it('sets up pointToLayer and onEachFeature handlers correctly', async () => {
    render(<LeafletMap geojsonData={geojsonData as GeoJsonObject} />);

    await waitFor(() => {
      const { pointToLayer, onEachFeature } = (L.geoJSON as jest.Mock).mock.calls[0][1];

      // Test pointToLayer handler
      const latlng = [102.0, 0.5];
      const marker = pointToLayer(null, latlng);
      expect(L.marker).toHaveBeenCalledWith(latlng, { icon: expect.any(Object) });

      // Test onEachFeature handler
      const layer = { bindPopup: jest.fn() };
      const feature = {
        properties: {
          name: "Test Point",
          description: "This is a test point."
        }
      };
      onEachFeature(feature, layer);
      expect(layer.bindPopup).toHaveBeenCalledWith(
        expect.stringContaining('Test Point')
      );
      expect(layer.bindPopup).toHaveBeenCalledWith(
        expect.stringContaining('This is a test point.')
      );
    });
  });
});
