'use client'

import { useEffect, useState, useRef, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/hooks/useUser'
import { uploadAvatar } from '@/lib/uploadAvatar'
import type { City, Profile } from '@/lib/types'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

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
  const { profile } = useUser() // still used for profile data (bio, avatar, cities_lived)

  // undefined = auth not checked yet, null = confirmed signed out,
  // User = confirmed signed in. Only ever set from real callbacks below.
  const [authedUser, setAuthedUser] = useState<User | null | undefined>(undefined)

  useEffect(() => {
    let cancelled = false

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return
      setAuthedUser(session?.user ?? null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      // Only react to genuine sign-in/out. Deliberately ignore
      // TOKEN_REFRESHED and other background events Supabase fires when
      // the tab regains focus — reacting to those would unmount the
      // form below and wipe whatever the user was typing.
      if (event === 'SIGNED_OUT') {
        setAuthedUser(null)
      } else if (event === 'SIGNED_IN' && session?.user) {
        setAuthedUser(session.user)
      }
    })

    return () => {
      cancelled = true
      listener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (authedUser === null) {
      router.push('/auth/login')
    }
  }, [authedUser, router])

  // Wait for BOTH: a confirmed user, AND the matching profile row to
  // have actually loaded — not just "authed", since profile arrives
  // from a separate async fetch and can lag behind authedUser.
  const profileReady = profile !== null && authedUser != null && profile.id === authedUser.id

  if (authedUser === undefined || authedUser === null || !profileReady) {
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
        {/* key=authedUser.id: remounts only if a different user signs
            in, never on background token refreshes */}
        <EditProfileForm key={profile.id} user={authedUser} profile={profile} />
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
  const [removeAvatar, setRemoveAvatar] = useState(false)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    void getAllCities().then(setCities)
  }, [])

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
    setRemoveAvatar(false) // picking a new file cancels any pending removal
  }

  function handleRemoveAvatar() {
    setAvatarFile(null)
    setAvatarPreview(null)
    setRemoveAvatar(true)
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
      } else if (removeAvatar) {
        avatarUrl = null
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

      window.dispatchEvent(
        new CustomEvent("profile:updated", {
          detail: {
            ...profile,
            bio: bio.trim() || null,
            cities_lived: citiesLived,
            avatar_url: avatarUrl,
          },
        })
      );

      setSuccess(true)
      router.refresh()
      setTimeout(() => {
        router.push(`/profile/${profile?.username}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  const displayAvatar = removeAvatar ? null: avatarPreview ?? profile?.avatar_url ?? null

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
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-earth">Avatar</span>
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarChange}
              className="hidden"
              aria-label="Upload avatar image"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-medium text-earth bg-sand/50 hover:bg-sand/70 px-3 py-2 rounded-full transition-colors"
            >
              {avatarFile ? "Change photo" : "Choose photo"}
            </button>
            {displayAvatar && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="text-xs font-medium text-terracotta hover:text-terracotta-dark transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        </div>
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
            const selected = citiesLived.includes(city.id);
            return (
              <button
                key={city.id}
                type="button"
                onClick={() => toggleCity(city.id)}
                className={`text-sm font-medium px-3.5 py-2 rounded-full border transition-colors ${
                  selected
                    ? "bg-terracotta text-white border-terracotta"
                    : "bg-white text-earth-muted border-sand hover:border-terracotta/40"
                }`}
              >
                {city.name}
              </button>
            );
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
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-terracotta text-white px-6 py-3 rounded-full font-medium hover:bg-terracotta-dark transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        <Link
          href={`/profile/${profile?.username}`}
          className="text-sm font-medium text-earth-muted hover:text-terracotta transition-colors px-4 py-3"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}