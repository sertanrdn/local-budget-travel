/**
 * Shortens a comma-separated address string to its first few segments,
 * e.g. "Yoğurtçu Park, Osmanağa Mahallesi, Kadıköy, Istanbul, Marmara
 * Region, 34714, Turkey" → "Yoğurtçu Park, Osmanağa Mahallesi, Kadıköy".
 * Used for compact display (card lists, page subtitles) where the full
 * address is either shown elsewhere or unnecessary. Falls back to the
 * original string if it has fewer parts than requested.
 */
export function getShortAddress(address: string, maxParts = 3): string {
  const parts = address
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length <= maxParts) return address;

  return parts.slice(0, maxParts).join(", ");
}