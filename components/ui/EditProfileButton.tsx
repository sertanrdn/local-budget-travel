'use client'

import Link from 'next/link'
import { useUser } from '@/hooks/useUser'

export function EditProfileButton({ profileId }: { profileId: string }) {
  const { user } = useUser()

  if (!user || user.id !== profileId) return null

  return (
    <Link
      href="/profile/edit"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-earth-muted hover:text-terracotta transition-colors"
    >
      <span aria-hidden>&#x270F;&#xFE0F;</span>
      Edit profile
    </Link>
  )
}