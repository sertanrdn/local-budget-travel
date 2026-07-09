'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/hooks/useUser'
import { uploadAvatar } from '@/lib/uploadAvatar'
import type { City, Profile } from '@/lib/types'
import type { User } from '@supabase/supabase-js'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-sand bg-white text-earth placeholder:text-earth-muted/50 focus:outline-none focus:border-terracotta text-sm transition-colors'

async function getAllCities(): Promise<City[]> {
  const { data, error } = await supabase.from('cities').select('*').order('name')
  if (error) {
    console.error('Failed to fetch cities:', error.message)
    return []
  }
  return data ?? []
}

export default function EditProfilePage() {
  const router = useRouter()
  const { user, profile, loading: userLoading } = useUser()

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/auth/login')
    }
  }, [userLoading, user, router])

  if (userLoading || !user) {
    return (
      <div className="min-h-screen bg-warm-white text-earth font-sans flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center text-earth-muted text-sm">
          Loading…
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-white text-earth font-sans flex flex-col">
      <Header />
      <main className="flex-1 px-6 py-16 max-w-md mx-auto w-full">
        <p className="text-terracotta font-semibold text-xs tracking-widest uppercase mb-4">
          Your profile
        </p>
        <h1 className="text-3xl font-bold text-earth leading-tight mb-8">
          Edit profile
        </h1>
        {/* key forces a fresh mount once profile has actually loaded,
            so EditProfileForm's useState can read it directly */}
        <EditProfileForm key={profile?.id ?? 'new'} user={user} profile={profile} />
      </main>
      <Footer />
    </div>
  )
}

function EditProfileForm({
  user,
  profile,
}: {
  user: User
  profile: Profile | null
}) {
  const router = useRouter()

  const [cities, setCities] = useState<City[]>([])
  const [bio, setBio] = useState(profile?.bio ?? '')
  const [citiesLived, setCitiesLived] = useState<string[]>(profile?.cities_lived ?? [])
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    void getAllCities().then(setCities)
  }, [])

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  function toggleCity(cityId: string) {
    setCitiesLived((prev) =>
      prev.includes(cityId)
        ? prev.filter((id) => id !== cityId)
        : [...prev, cityId]
    )
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setSaving(true)

    try {
      let avatarUrl = profile?.avatar_url ?? null

      if (avatarFile) {
        avatarUrl = await uploadAvatar(user.id, avatarFile)
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          bio: bio.trim() || null,
          cities_lived: citiesLived,
          avatar_url: avatarUrl,
        })
        .eq('id', user.id)

      if (updateError) throw new Error(updateError.message)

      setSuccess(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  const displayAvatar = avatarPreview ?? profile?.avatar_url ?? null

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full bg-sand/50 overflow-hidden shrink-0 flex items-center justify-center text-2xl">
          {displayAvatar ? (
            <Image
              src={displayAvatar}
              alt="Avatar preview"
              fill
              className="object-cover"
              unoptimized={Boolean(avatarPreview)}
            />
          ) : (
            <span aria-hidden>&#x1F464;</span>
          )}
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-earth">Avatar</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleAvatarChange}
            className="text-sm text-earth-muted file:mr-3 file:py-2 file:px-3 file:rounded-full file:border-0 file:bg-sand/50 file:text-earth file:text-xs file:font-medium hover:file:bg-sand/70"
          />
        </label>
      </div>

      {/* Bio */}
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-earth">Bio</span>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          placeholder="Tell people a bit about yourself…"
          className={inputClass}
        />
      </label>

      {/* Cities lived */}
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-earth">
          Cities you&apos;ve lived in (1+ year)
        </span>
        <div className="flex flex-wrap gap-2">
          {cities.map((city) => {
            const selected = citiesLived.includes(city.id)
            return (
              <button
                key={city.id}
                type="button"
                onClick={() => toggleCity(city.id)}
                className={`text-sm font-medium px-3.5 py-2 rounded-full border transition-colors ${
                  selected
                    ? 'bg-terracotta text-white border-terracotta'
                    : 'bg-white text-earth-muted border-sand hover:border-terracotta/40'
                }`}
              >
                {city.name}
              </button>
            )
          })}
        </div>
      </div>

      {error && (
        <p className="text-terracotta text-sm bg-terracotta/10 rounded-xl px-4 py-3">
          {error}
        </p>
      )}
      {success && (
        <p className="text-olive text-sm bg-olive/10 rounded-xl px-4 py-3">
          Profile updated.
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="bg-terracotta text-white px-6 py-3 rounded-full font-medium hover:bg-terracotta-dark transition-colors disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  )
}