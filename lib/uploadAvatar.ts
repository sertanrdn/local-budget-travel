import { supabase } from '@/lib/supabase'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB, matches the bucket limit
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Please upload a JPEG, PNG, or WebP image.')
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Image must be smaller than 5MB.')
  }

  const fileExt = file.name.split('.').pop()
  const filePath = `${userId}/avatar.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      upsert: true, // overwrite any existing avatar for this user
      cacheControl: '3600',
    })

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`)
  }

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)

  // Cache-bust so next/image and browsers pick up the new file
  // immediately instead of serving a stale cached avatar.
  return `${data.publicUrl}?t=${Date.now()}`
}