import { supabase } from '@/lib/supabase'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB, matches the bucket limit
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const BUCKET = 'activity-photos'

export async function uploadActivityPhoto(userId: string, file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Please upload a JPEG, PNG, or WebP image.')
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Image must be smaller than 5MB.')
  }

  const fileExt = file.name.split('.').pop()
  // Random filename per upload — unlike avatars, a user can have many
  // activity photos, so there's no single fixed slot to overwrite.
  const filePath = `${userId}/${crypto.randomUUID()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
    })

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`)
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath)
  return data.publicUrl
}

/**
 * Deletes a previously uploaded activity photo given its public URL.
 * Used when a user replaces or removes a photo on an existing activity,
 * so the old file doesn't linger in storage. Safe to call with null/
 * undefined or a non-Supabase URL — it just no-ops.
 */
export async function deleteActivityPhotoByUrl(url: string | null | undefined): Promise<void> {
  if (!url) return

  const marker = `/storage/v1/object/public/${BUCKET}/`
  const index = url.indexOf(marker)
  if (index === -1) return // not a URL from this bucket — nothing to do

  const filePath = url.slice(index + marker.length).split('?')[0] // strip any cache-busting query string

  const { error } = await supabase.storage.from(BUCKET).remove([filePath])
  if (error) {
    console.error('Failed to delete old activity photo:', error.message)
  }
}