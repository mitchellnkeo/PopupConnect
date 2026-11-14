import type { VendorProfile } from "../data/vendors";
import type { Reservation } from "../types/database";
import {
  defaultExploreFilters,
  formatLocationLabel,
  parseExploreFilters,
} from "./exploreSearch";

export type QuoteFormState = {
  eventDate: string;
  location: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  packageId: string;
  addOns: string;
};

export type QuoteSnapshot = {
  vendorSlug: string;
  vendorTitle: string;
  eventDate: string;
  location: string;
  duration: string;
  guestCount: number;
  packageName: string;
  addOns: string;
  depositAmount: number;
  totalAmount: number;
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function toDateInputValue(value: string | Date) {
  if (typeof value === "string" && ISO_DATE.test(value)) return value;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function formatQuoteDate(isoDate: string) {
  if (!isoDate) return "To be confirmed";
  if (!ISO_DATE.test(isoDate)) return isoDate;
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function toMinutes(hhmm: string) {
  const [hours, minutes] = hhmm.split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  return hours * 60 + minutes;
}

export function formatTimeLabel(hhmm: string) {
  const minutes = toMinutes(hhmm);
  if (minutes == null) return "";
  const hours24 = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const suffix = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${pad(mins)} ${suffix}`;
}

export function formatDurationLabel(startTime: string, endTime: string) {
  if (!startTime || !endTime) return "To be confirmed";
  const start = toMinutes(startTime);
  const end = toMinutes(endTime);
  if (start == null || end == null) return "To be confirmed";
  let span = end - start;
  if (span <= 0) span += 24 * 60;
  const hours = span / 60;
  const hoursLabel = Number.isInteger(hours) ? `${hours} hours` : `${hours.toFixed(1)} hours`;
  return `${formatTimeLabel(startTime)} – ${formatTimeLabel(endTime)} (${hoursLabel})`;
}

function parseClock(token: string) {
  const match = token.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return "";
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const suffix = match[3].toUpperCase();
  if (suffix === "PM" && hours < 12) hours += 12;
  if (suffix === "AM" && hours === 12) hours = 0;
  return `${pad(hours)}:${pad(minutes)}`;
}

export function parseDurationTimes(label: string | null | undefined) {
  if (!label) return { startTime: "14:00", endTime: "20:00" };
  const match = label.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))\s*[–-]\s*(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
  if (!match) return { startTime: "14:00", endTime: "20:00" };
  return {
    startTime: parseClock(match[1]) || "14:00",
    endTime: parseClock(match[2]) || "20:00",
  };
}

export function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function selectedPackage(vendor: VendorProfile, packageId: string) {
  return vendor.packages.find((pkg) => pkg.id === packageId) ?? vendor.packages[0];
}

function defaultEventDate(params: URLSearchParams) {
  const filters = parseExploreFilters(params);
  const hasDate =
    params.has("when") ||
    params.has("whenStart") ||
    params.has("whenYear") ||
    params.has("whenMonth");
  const source = hasDate ? filters : defaultExploreFilters;
  return toDateInputValue(new Date(source.whenYear, source.whenMonth, source.whenDay));
}

export function initialQuoteForm(vendor: VendorProfile, params: URLSearchParams): QuoteFormState {
  const filters = parseExploreFilters(params);
  const packageId = params.get("package") ?? vendor.packages[0]?.id ?? "";
  const guests = Number(params.get("guests"));
  const where = params.get("where")?.trim();

  return {
    eventDate: defaultEventDate(params),
    location: where ? formatLocationLabel(where) : vendor.city || formatLocationLabel(filters.where),
    startTime: "14:00",
    endTime: "20:00",
    guestCount:
      Number.isFinite(guests) && guests > 0 ? Math.round(guests) : Math.max(vendor.minPartySize, 1),
    packageId,
    addOns: params.get("addons")?.trim() || "",
  };
}

export function formFromReservation(
  vendor: VendorProfile,
  reservation: Reservation,
): QuoteFormState {
  const pkg =
    vendor.packages.find((item) => item.name === reservation.package_name) ?? vendor.packages[0];
  const times = parseDurationTimes(reservation.duration);

  return {
    eventDate: toDateInputValue(reservation.event_date ?? ""),
    location: reservation.location ?? vendor.city,
    startTime: times.startTime,
    endTime: times.endTime,
    guestCount: reservation.guest_count ?? Math.max(vendor.minPartySize, 1),
    packageId: pkg?.id ?? "",
    addOns: reservation.add_ons && reservation.add_ons !== "None" ? reservation.add_ons : "",
  };
}

export function quoteSnapshotFromForm(vendor: VendorProfile, form: QuoteFormState): QuoteSnapshot {
  const pkg = selectedPackage(vendor, form.packageId);
  return {
    vendorSlug: vendor.slug || vendor.id,
    vendorTitle: vendor.title,
    eventDate: formatQuoteDate(form.eventDate),
    location: form.location.trim() || vendor.city,
    duration: formatDurationLabel(form.startTime, form.endTime),
    guestCount: Math.max(1, Math.round(form.guestCount) || 1),
    packageName: pkg?.name ?? "Custom package",
    addOns: form.addOns.trim() || "None",
    depositAmount: vendor.deposit ?? 0,
    totalAmount: pkg?.price ?? vendor.startingPrice ?? 0,
  };
}

export function quoteSnapshotFromVendor(
  vendor: VendorProfile,
  params: URLSearchParams,
): QuoteSnapshot {
  return quoteSnapshotFromForm(vendor, initialQuoteForm(vendor, params));
}

export function vendorShortName(title: string) {
  const token = title.split(/[\s']/u)[0]?.trim();
  return token || title;
}
