import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap, useMapEvents } from "react-leaflet";
import type { ExploreResult } from "../../data/exploreResults";
import { distanceMiles, type GeoPoint } from "../../lib/geo";
import "leaflet/dist/leaflet.css";

type ExploreMapProps = {
  results: ExploreResult[];
  activeId: string | null;
  onMarkerHover: (id: string) => void;
  onMarkerClick?: (id: string) => void;
  searchOrigin?: GeoPoint | null;
  onSearchArea?: (center: GeoPoint) => void;
  layoutKey?: string;
};

const HONOLULU_CENTER: [number, number] = [21.3069, -157.8583];
const SEARCH_AREA_MILES = 1.5;

function MapResize({ layoutKey }: { layoutKey?: string }) {
  const map = useMap();

  useEffect(() => {
    const invalidate = () => {
      map.invalidateSize();
    };

    invalidate();
    const frame = window.requestAnimationFrame(invalidate);
    window.addEventListener("resize", invalidate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", invalidate);
    };
  }, [map, layoutKey]);

  return null;
}

function MapBounds({ results }: { results: ExploreResult[] }) {
  const map = useMap();
  const boundsKey = results.map((result) => `${result.id}:${result.lat}:${result.lng}`).join("|");

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
  }, [map, boundsKey, results]);

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

function SearchAreaWatcher({
  origin,
  onMoved,
}: {
  origin?: GeoPoint | null;
  onMoved: (center: GeoPoint, drifted: boolean) => void;
}) {
  const map = useMap();
  const onMovedRef = useRef(onMoved);
  onMovedRef.current = onMoved;

  useMapEvents({
    moveend() {
      const center = map.getCenter();
      const point = { lat: center.lat, lng: center.lng };
      if (!origin) {
        onMovedRef.current(point, false);
        return;
      }
      onMovedRef.current(point, distanceMiles(origin, point) > SEARCH_AREA_MILES);
    },
  });

  useEffect(() => {
    onMovedRef.current(
      { lat: origin?.lat ?? HONOLULU_CENTER[0], lng: origin?.lng ?? HONOLULU_CENTER[1] },
      false,
    );
  }, [origin?.lat, origin?.lng]);

  return null;
}

export function ExploreMap({
  results,
  activeId,
  onMarkerHover,
  onMarkerClick,
  searchOrigin,
  onSearchArea,
  layoutKey,
}: ExploreMapProps) {
  const activeResult = results.find((r) => r.id === activeId);
  const [showSearchArea, setShowSearchArea] = useState(false);
  const [mapCenter, setMapCenter] = useState<GeoPoint | null>(null);

  function handleMoved(center: GeoPoint, drifted: boolean) {
    setMapCenter(center);
    setShowSearchArea(drifted);
  }

  return (
    <div className="relative h-full overflow-hidden rounded-2xl border border-neutral-200 shadow-sm">
      {showSearchArea && onSearchArea && mapCenter ? (
        <button
          type="button"
          onClick={() => {
            onSearchArea(mapCenter);
            setShowSearchArea(false);
          }}
          className="absolute top-3 left-1/2 z-[1000] -translate-x-1/2 rounded-full bg-white px-4 py-2 font-medium text-midnight text-sm shadow-md ring-1 ring-neutral-200 hover:bg-starlight/50"
        >
          Search this area
        </button>
      ) : null}
      <MapContainer
        center={HONOLULU_CENTER}
        zoom={13}
        className="h-full w-full"
        scrollWheelZoom
        aria-label="Map of search results"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapResize layoutKey={layoutKey} />
        <MapBounds results={results} />
        <ActiveMarkerFocus result={activeResult} />
        <SearchAreaWatcher origin={searchOrigin} onMoved={handleMoved} />

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
                click: () => onMarkerClick?.(result.id),
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
