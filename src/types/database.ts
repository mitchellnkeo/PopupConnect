export type AppRole = "vendor" | "host" | "organizer";

export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type ProfileRole = {
  id: string;
  profile_id: string;
  role: AppRole;
  created_at: string;
};

export type ProfileWithRoles = Profile & {
  roles: AppRole[];
};

export type VendorProfileRow = {
  id: string;
  profile_id: string;
  slug: string;
  title: string;
  city: string | null;
  about: string | null;
  ideal_for: string | null;
  starting_price: number | null;
  deposit: number | null;
  lead_time: string | null;
  min_party_size: number | null;
  response_time: string | null;
  image_url: string | null;
  hero_image_url: string | null;
  lat: number | null;
  lng: number | null;
  published: boolean;
  category_ids: string[];
  created_at: string;
  updated_at: string;
};

export type VendorProductRow = {
  id: string;
  vendor_profile_id: string;
  name: string;
  description: string | null;
  price: number;
  highlights: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type VendorProfileWithProducts = VendorProfileRow & {
  products: VendorProductRow[];
};

export type VendorProfileInput = {
  slug: string;
  title: string;
  city?: string | null;
  about?: string | null;
  ideal_for?: string | null;
  starting_price?: number | null;
  deposit?: number | null;
  lead_time?: string | null;
  min_party_size?: number | null;
  response_time?: string | null;
  image_url?: string | null;
  hero_image_url?: string | null;
  lat?: number | null;
  lng?: number | null;
  published?: boolean;
  category_ids?: string[];
};

export type VendorProductInput = {
  id?: string;
  name: string;
  description?: string | null;
  price: number;
  highlights?: string[];
  sort_order?: number;
};

