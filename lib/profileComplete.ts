import type { Profile } from '@/lib/types'

export function isProfileComplete(profile: Profile | null): boolean {
  if (!profile) return false
  return Boolean(profile.bio?.trim()) && (profile.cities_lived?.length ?? 0) > 0
}