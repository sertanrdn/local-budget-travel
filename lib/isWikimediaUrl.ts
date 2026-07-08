export function isWikimediaUrl(url: string | null | undefined): boolean {
    if (!url) return false
    return url.includes('upload.wikimedia.org')
}