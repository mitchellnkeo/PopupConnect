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

export type ReservationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "confirmed"
  | "booked"
  | "cancelled";

export type Reservation = {
  id: string;
  guest_id: string;
  vendor_profile_id: string | null;
  vendor_slug: string;
  vendor_title: string;
  status: ReservationStatus;
  event_date: string | null;
  location: string | null;
  duration: string | null;
  guest_count: number | null;
  package_name: string | null;
  add_ons: string | null;
  deposit_amount: number;
  total_amount: number;
  guest_last_read_at: string | null;
  vendor_last_read_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ReservationMessageKind = "user" | "system";

export type ReservationMessage = {
  id: string;
  reservation_id: string;
  sender_id: string;
  body: string;
  kind: ReservationMessageKind;
  created_at: string;
  sender_name: string | null;
};

export type ReservationInput = {
  vendorSlug: string;
  vendorTitle: string;
  status: ReservationStatus;
  eventDate: string;
  location: string;
  duration: string;
  guestCount: number;
  packageName: string;
  addOns: string;
  depositAmount: number;
  totalAmount: number;
};

