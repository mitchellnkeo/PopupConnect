export type LocationOption = {
  id: string;
  primary: string;
  secondary: string;
  lat?: number;
  lng?: number;
};

export const searchLocations: LocationOption[] = [
  { id: "current", primary: "use current location", secondary: "" },
  {
    id: "honolulu",
    primary: "honolulu, hi",
    secondary: "hawaii, usa",
    lat: 21.3069,
    lng: -157.8583,
  },
  {
    id: "houston",
    primary: "houston, tx",
    secondary: "texas, usa",
    lat: 29.7604,
    lng: -95.3698,
  },
  {
    id: "seattle",
    primary: "seattle, wa",
    secondary: "washington, usa",
    lat: 47.6062,
    lng: -122.3321,
  },
  {
    id: "hartford",
    primary: "hartford, ct",
    secondary: "connecticut, usa",
    lat: 41.7658,
    lng: -72.6734,
  },
  {
    id: "hayward",
    primary: "hayward, ca",
    secondary: "california, usa",
    lat: 37.6688,
    lng: -122.0808,
  },
];

export function findCuratedLocation(where: string): LocationOption | undefined {
  const needle = where.trim().toLowerCase();
  if (!needle) return undefined;
  return searchLocations.find(
    (option) =>
      option.id !== "current" &&
      option.lat != null &&
      (option.primary === needle || option.primary.includes(needle) || needle.includes(option.id)),
  );
}
