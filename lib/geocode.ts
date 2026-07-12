export interface GeocodeResult {
  latitude: number;
  longitude: number;
  displayName: string;
}

interface NominatimResult {
    lat: string
    lon: string
    display_name: string
}

/**
 * Search OpenStreetMap's free Nominatim API for place names or addresses
 * matching the query, returning up to `limit` candidates for the user to
 * pick from. Used to power live-as-you-type address suggestions.
 *
 * Note: Nominatim's usage policy asks for at most 1 request/second and a
 * way to identify the calling app. Browsers can't set a custom
 * User-Agent header, but they do send Referer automatically, which
 * Nominatim accepts as identification for client-side use. Callers are
 * expected to debounce keystrokes before calling this — this function
 * itself does not rate-limit.
 */

export async function searchLocations(
  query: string,
  limit = 5
): Promise<GeocodeResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", trimmed);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", String(limit));

  try {
    const res = await fetch(url.toString());
    if (!res.ok) return [];

    const results: NominatimResult[] = await res.json();
    if (!Array.isArray(results)) return [];

    return results
      .map((r) => ({
        latitude: parseFloat(r.lat),
        longitude: parseFloat(r.lon),
        displayName: r.display_name,
      }))
      .filter((r) => !Number.isNaN(r.latitude) && !Number.isNaN(r.longitude));
  } catch {
    return [];
  }
}

/**
 * Look up a single best match for a place name/address. Thin wrapper
 * around searchLocations for callers that just want one result rather
 * than a list of suggestions.
 */
export async function geocodeLocation(
  query: string
): Promise<GeocodeResult | null> {
  const results = await searchLocations(query, 1);
  return results[0] ?? null;
}