export type ExploreResult = {
  id: string;
  title: string;
  city: string;
  /** Placeholder map position (percent within map container) */
  mapX: number;
  mapY: number;
  imageSrc?: string;
};

export const exploreResults: ExploreResult[] = [
  { id: "1", title: "Omakaze chef", city: "Seattle, WA", mapX: 38, mapY: 42 },
  { id: "2", title: "Mobile Matcha bar", city: "Seattle, WA", mapX: 52, mapY: 55 },
  { id: "3", title: "Custom portraits", city: "Seattle, WA", mapX: 45, mapY: 68 },
  { id: "4", title: "DJ", city: "Seattle, WA", mapX: 61, mapY: 38 },
  { id: "5", title: "Backyard oven pizza bar", city: "Seattle, WA", mapX: 70, mapY: 62 },
  { id: "6", title: "Jewelry bar", city: "Seattle, WA", mapX: 33, mapY: 58 },
  { id: "7", title: "Photo booth pop-up", city: "Seattle, WA", mapX: 58, mapY: 48 },
  { id: "8", title: "Open bar cart", city: "Seattle, WA", mapX: 48, mapY: 35 },
];
