export type VendorItem = {
  id: string;
  title: string;
  city: string;
  distanceMiles: number;
  isNew?: boolean;
};

export const exploreVendors: VendorItem[] = [
  { id: "1", title: "omakaze chef", city: "Seattle, Washington", distanceMiles: 2.5, isNew: true },
  { id: "2", title: "custom portraits", city: "Seattle, Washington", distanceMiles: 2.5, isNew: true },
  { id: "3", title: "jewelry bar", city: "Seattle, Washington", distanceMiles: 2.5 },
  { id: "4", title: "book binding", city: "Seattle, Washington", distanceMiles: 2.5 },
  { id: "5", title: "gluten free pizza party", city: "Seattle, Washington", distanceMiles: 2.5 },
];

export const lovedByLocals: VendorItem[] = [
  { id: "6", title: "squid ink stickers", city: "Seattle, Washington", distanceMiles: 3.1 },
  { id: "7", title: "hats with cats", city: "Seattle, Washington", distanceMiles: 3.1 },
  { id: "8", title: "bows and bouquets", city: "Seattle, Washington", distanceMiles: 3.1 },
  { id: "9", title: "swanky sweaters", city: "Seattle, Washington", distanceMiles: 3.1 },
  { id: "10", title: "mix and matcha", city: "Seattle, Washington", distanceMiles: 3.1 },
  { id: "11", title: "donuts hole mini golf", city: "Seattle, Washington", distanceMiles: 3.1 },
];

export const celebrateSection: VendorItem[] = [
  { id: "12", title: "lei workshop", city: "Seattle, Washington", distanceMiles: 4.2 },
  { id: "13", title: "island beats dj", city: "Seattle, Washington", distanceMiles: 4.2 },
  { id: "14", title: "family photo booth", city: "Seattle, Washington", distanceMiles: 4.2 },
];
