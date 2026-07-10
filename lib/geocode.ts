export interface GeocodeResult {
  latitude: number;
  longitude: number;
  displayName: string;
}

/**
 * Look up a place name (e.g. "Westerpark, Amsterdam") and return its
 * coordinates via OpenStreetMap's free Nominatim API. Returns null if
 * nothing was found or the request failed.
 *
 * Note: Nominatim's usage policy asks for at most 1 request/second and
 * a way to identify the calling app. Browsers can't set a custom
 * User-Agent header, but they do send Referer automatically, which
 * Nominatim accepts as identification for client-side use.
 */
export async function geocodeLocation(
  query: string
): Promise<GeocodeResult | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", trimmed);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");

  try {
    const res = await fetch(url.toString());
    if (!res.ok) return null;

    const results = await res.json();
    if (!Array.isArray(results) || results.length === 0) return null;

    const { lat, lon, display_name } = results[0];
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;

    return { latitude, longitude, displayName: display_name };
  } catch {
    return null;
  }
}
