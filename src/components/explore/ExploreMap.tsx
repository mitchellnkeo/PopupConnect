import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import type { ExploreResult } from "../../data/exploreResults";
import "leaflet/dist/leaflet.css";

type ExploreMapProps = {
  results: ExploreResult[];
  activeId: string | null;
  onMarkerHover: (id: string) => void;
};

const HONOLULU_CENTER: [number, number] = [21.3069, -157.8583];

function MapBounds({ results }: { results: ExploreResult[] }) {
  const map = useMap();

  useEffect(() => {
    if (results.length === 0) {
      map.setView(HONOLULU_CENTER, 13);
      return;
    }

    if (results.length === 1) {
      map.setView([results[0].lat, results[0].lng], 14);
      return;
    }

    const lats = results.map((r) => r.lat);
    const lngs = results.map((r) => r.lng);
    const southWest: [number, number] = [Math.min(...lats) - 0.01, Math.min(...lngs) - 0.01];
    const northEast: [number, number] = [Math.max(...lats) + 0.01, Math.max(...lngs) + 0.01];
    map.fitBounds([southWest, northEast], { padding: [32, 32], maxZoom: 14 });
  }, [map, results]);

  return null;
}

function ActiveMarkerFocus({ result }: { result: ExploreResult | undefined }) {
  const map = useMap();

  useEffect(() => {
    if (!result) return;
    map.panTo([result.lat, result.lng]);
  }, [map, result]);

  return null;
}

export function ExploreMap({ results, activeId, onMarkerHover }: ExploreMapProps) {
  const activeResult = results.find((r) => r.id === activeId);

  return (
    <div className="relative h-full min-h-[320px] overflow-hidden rounded-2xl border border-neutral-200 shadow-sm lg:min-h-[calc(100vh-12rem)]">
      <MapContainer
        center={HONOLULU_CENTER}
        zoom={13}
        className="size-full z-0"
        scrollWheelZoom
        aria-label="Map of search results"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBounds results={results} />
        <ActiveMarkerFocus result={activeResult} />

        {results.map((result) => {
          const isActive = activeId === result.id;
          return (
            <CircleMarker
              key={result.id}
              center={[result.lat, result.lng]}
              radius={isActive ? 11 : 8}
              pathOptions={{
                color: "#ffffff",
                weight: 2,
                fillColor: isActive ? "#cc3d00" : "#172e50",
                fillOpacity: 1,
              }}
              eventHandlers={{
                mouseover: () => onMarkerHover(result.id),
              }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
                {result.title}
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
