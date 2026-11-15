export function isBookingPreview(params: URLSearchParams, idKey = "id") {
  if (!import.meta.env.DEV) return false;
  if (params.get("preview") === "1") return true;
  return Boolean(params.get(idKey)?.startsWith("demo-"));
}

function withDevPreview(path: string, id?: string | null) {
  if (!import.meta.env.DEV || !id?.startsWith("demo-")) return path;
  const url = new URL(path, "http://local");
  url.searchParams.set("preview", "1");
  return `${url.pathname}?${url.searchParams.toString()}`;
}

export function paymentHref(reservationId?: string | null) {
  const path = reservationId ? `/booking/payment?id=${reservationId}` : "/booking/payment";
  return withDevPreview(path, reservationId);
}

export function confirmHref(reservationId?: string | null) {
  const path = reservationId ? `/booking/confirm?id=${reservationId}` : "/booking/confirm";
  return withDevPreview(path, reservationId);
}
