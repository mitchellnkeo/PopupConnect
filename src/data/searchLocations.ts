export type LocationOption = {
  id: string;
  primary: string;
  secondary: string;
};

export const searchLocations: LocationOption[] = [
  { id: "current", primary: "use current location", secondary: "" },
  { id: "houston", primary: "houston, tx", secondary: "texas, usa" },
  { id: "honolulu", primary: "honolulu, hi", secondary: "hawaii, usa" },
  { id: "hartford", primary: "hartford, ct", secondary: "connecticut, usa" },
  { id: "hayward", primary: "hayward, ca", secondary: "california, usa" },
];
