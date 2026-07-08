export function isWikimediaUrl(url: string | null | undefined): boolean {
    if (!url) return false
    try {
        const { hostname } = new URL(url, 'https://example.com')
        return hostname === 'upload.wikimedia.org'
    } catch {
        return false
    }
}