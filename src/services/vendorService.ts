import { isSupabaseConfigured, supabase } from "../lib/supabase";
import type {
  VendorProductInput,
  VendorProductRow,
  VendorProfileInput,
  VendorProfileRow,
  VendorProfileWithProducts,
} from "../types/database";

function parseCategoryIds(value: unknown): string[] {
  if (!Array.isArray(value)) return ["matcha-bar"];
  return value.filter((item): item is string => typeof item === "string" && item.length > 0);
}

function mapProduct(row: Record<string, unknown>): VendorProductRow {
  const highlights = row.highlights;
  return {
    id: row.id as string,
    vendor_profile_id: row.vendor_profile_id as string,
    name: row.name as string,
    description: (row.description as string | null) ?? null,
    price: Number(row.price),
    highlights: Array.isArray(highlights) ? (highlights as string[]) : [],
    sort_order: Number(row.sort_order ?? 0),
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

function mapProfile(row: Record<string, unknown>): VendorProfileRow {
  return {
    id: row.id as string,
    profile_id: row.profile_id as string,
    slug: row.slug as string,
    title: row.title as string,
    city: (row.city as string | null) ?? null,
    about: (row.about as string | null) ?? null,
    ideal_for: (row.ideal_for as string | null) ?? null,
    starting_price: row.starting_price != null ? Number(row.starting_price) : null,
    deposit: row.deposit != null ? Number(row.deposit) : null,
    lead_time: (row.lead_time as string | null) ?? null,
    min_party_size: row.min_party_size != null ? Number(row.min_party_size) : null,
    response_time: (row.response_time as string | null) ?? null,
    image_url: (row.image_url as string | null) ?? null,
    hero_image_url: (row.hero_image_url as string | null) ?? null,
    lat: row.lat != null ? Number(row.lat) : null,
    lng: row.lng != null ? Number(row.lng) : null,
    published: Boolean(row.published),
    category_ids: parseCategoryIds(row.category_ids),
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

async function fetchProducts(vendorProfileId: string): Promise<VendorProductRow[]> {
  const { data, error } = await supabase
    .from("vendor_products")
    .select("*")
    .eq("vendor_profile_id", vendorProfileId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []).map((row) => mapProduct(row as Record<string, unknown>));
}

export async function fetchVendorProfileByOwner(
  profileId: string,
): Promise<VendorProfileWithProducts | null> {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from("vendor_profiles")
    .select("*")
    .eq("profile_id", profileId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const profile = mapProfile(data as Record<string, unknown>);
  const products = await fetchProducts(profile.id);
  return { ...profile, products };
}

export async function fetchPublishedVendorBySlug(
  slug: string,
): Promise<VendorProfileWithProducts | null> {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from("vendor_profiles")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const profile = mapProfile(data as Record<string, unknown>);
  const products = await fetchProducts(profile.id);
  return { ...profile, products };
}

export async function fetchPublishedVendorProfiles(): Promise<VendorProfileWithProducts[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from("vendor_profiles")
    .select("*, vendor_products(*)")
    .eq("published", true)
    .order("title");

  if (error) throw error;

  return (data ?? []).map((row) => {
    const profile = mapProfile(row as Record<string, unknown>);
    const nestedProducts = (row as { vendor_products?: Record<string, unknown>[] }).vendor_products ?? [];
    const products = nestedProducts
      .map((product) => mapProduct(product))
      .sort((a, b) => a.sort_order - b.sort_order);

    return { ...profile, products };
  });
}

export async function saveVendorProfile(
  profileId: string,
  input: VendorProfileInput,
  products: VendorProductInput[],
): Promise<VendorProfileWithProducts> {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured.");
  }

  const existing = await fetchVendorProfileByOwner(profileId);

  let vendorProfileId = existing?.id;

  const profilePayload = {
    profile_id: profileId,
    slug: input.slug,
    title: input.title,
    city: input.city ?? null,
    about: input.about ?? null,
    ideal_for: input.ideal_for ?? null,
    starting_price: input.starting_price ?? null,
    deposit: input.deposit ?? null,
    lead_time: input.lead_time ?? null,
    min_party_size: input.min_party_size ?? null,
    response_time: input.response_time ?? null,
    image_url: input.image_url ?? null,
    hero_image_url: input.hero_image_url ?? null,
    lat: input.lat ?? null,
    lng: input.lng ?? null,
    published: input.published ?? false,
    category_ids: input.category_ids ?? ["matcha-bar"],
  };

  if (vendorProfileId) {
    const { error } = await supabase
      .from("vendor_profiles")
      .update(profilePayload)
      .eq("id", vendorProfileId);

    if (error) throw error;
  } else {
    const { data, error } = await supabase
      .from("vendor_profiles")
      .insert(profilePayload)
      .select("*")
      .single();

    if (error) throw error;
    vendorProfileId = (data as { id: string }).id;
  }

  const { error: deleteError } = await supabase
    .from("vendor_products")
    .delete()
    .eq("vendor_profile_id", vendorProfileId);

  if (deleteError) throw deleteError;

  if (products.length > 0) {
    const productRows = products.map((product, index) => ({
      vendor_profile_id: vendorProfileId,
      name: product.name,
      description: product.description ?? null,
      price: product.price,
      highlights: product.highlights ?? [],
      sort_order: product.sort_order ?? index,
    }));

    const { error: insertError } = await supabase.from("vendor_products").insert(productRows);
    if (insertError) throw insertError;
  }

  const saved = await fetchVendorProfileByOwner(profileId);
  if (!saved) {
    throw new Error("Vendor profile could not be loaded after save.");
  }
  return saved;
}
