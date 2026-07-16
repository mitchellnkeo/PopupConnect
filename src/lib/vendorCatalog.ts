import type { ExploreResult } from "../data/exploreResults";
import type { VendorProfile } from "../data/vendors";
import { vendors as mockVendors } from "../data/vendors";
import { fetchPublishedVendorProfiles } from "../services/vendorService";
import type { VendorProfileWithProducts } from "../types/database";

const HONOLULU = { lat: 21.3069, lng: -157.8583 };

function coordsForVendor(key: string, lat: number | null, lng: number | null) {
  if (lat != null && lng != null) {
    return { lat, lng };
  }

  const hash = [...key].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return {
    lat: HONOLULU.lat + ((hash % 100) - 50) * 0.001,
    lng: HONOLULU.lng + (((hash >> 4) % 100) - 50) * 0.001,
  };
}

function parseCategoryIds(value: unknown): string[] {
  if (!Array.isArray(value)) return ["matcha-bar"];
  return value.filter((item): item is string => typeof item === "string" && item.length > 0);
}

export function mapDbVendorToProfile(row: VendorProfileWithProducts): VendorProfile {
  const { lat, lng } = coordsForVendor(row.slug, row.lat, row.lng);
  const gallery = [row.hero_image_url, row.image_url].filter(
    (src): src is string => Boolean(src),
  );

  return {
    id: row.slug,
    slug: row.slug,
    title: row.title,
    city: row.city ?? "Honolulu, HI",
    distance: row.city ?? "Honolulu area",
    categoryIds: parseCategoryIds(row.category_ids),
    imageSrc: row.image_url ?? undefined,
    heroImageSrc: row.hero_image_url ?? row.image_url ?? undefined,
    tags: parseCategoryIds(row.category_ids).map((id) => id.replace(/-/g, " ")),
    about: row.about ?? "",
    whatsIncluded: [],
    idealFor: row.ideal_for ?? "",
    startingPrice: row.starting_price ?? row.products[0]?.price ?? 0,
    deposit: row.deposit ?? 0,
    leadTime: row.lead_time ?? "",
    minPartySize: row.min_party_size ?? 1,
    responseTime: row.response_time ?? "",
    verified: [],
    contact: {
      website: "",
      instagram: "",
      tiktok: "",
      email: "",
      phone: "",
    },
    highlights: {
      bookingsThisYear: 0,
      localPartnerships: 0,
      repeatClients: 0,
      avgRating: 0,
    },
    packages: row.products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description ?? "",
      highlights: product.highlights,
    })),
    gallery: gallery.length > 0 ? gallery : [],
    mapX: 50,
    mapY: 50,
    lat,
    lng,
  };
}

export function vendorToExploreResult(vendor: VendorProfile): ExploreResult {
  return {
    id: vendor.id,
    title: vendor.title,
    city: vendor.distance,
    locationCity: vendor.city,
    mapX: vendor.mapX,
    mapY: vendor.mapY,
    lat: vendor.lat,
    lng: vendor.lng,
    imageSrc: vendor.imageSrc,
    categoryIds: vendor.categoryIds,
  };
}

export function mergeVendorCatalog(dbVendors: VendorProfile[]): VendorProfile[] {
  const dbSlugs = new Set(dbVendors.map((vendor) => vendor.slug));
  const mockOnly = mockVendors.filter((vendor) => !dbSlugs.has(vendor.slug) && !dbSlugs.has(vendor.id));
  return [...dbVendors, ...mockOnly];
}

export function findVendorInCatalog(catalog: VendorProfile[], idOrSlug: string): VendorProfile | undefined {
  return catalog.find((vendor) => vendor.id === idOrSlug || vendor.slug === idOrSlug);
}

let cachedCatalog: VendorProfile[] | null = null;
let catalogPromise: Promise<VendorProfile[]> | null = null;

export function invalidateVendorCatalog() {
  cachedCatalog = null;
  catalogPromise = null;
}

export async function loadVendorCatalog(): Promise<VendorProfile[]> {
  if (cachedCatalog) {
    return cachedCatalog;
  }

  if (!catalogPromise) {
    catalogPromise = (async () => {
      try {
        const published = await fetchPublishedVendorProfiles();
        const dbVendors = published.map(mapDbVendorToProfile);
        const merged = mergeVendorCatalog(dbVendors);
        cachedCatalog = merged;
        return merged;
      } catch {
        cachedCatalog = mockVendors;
        return mockVendors;
      } finally {
        catalogPromise = null;
      }
    })();
  }

  return catalogPromise;
}

export function vendorsToExploreResults(vendorList: VendorProfile[]): ExploreResult[] {
  return vendorList.map(vendorToExploreResult);
}
