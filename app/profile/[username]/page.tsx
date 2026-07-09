import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Activity, City, Profile } from '@/lib/types'
import { ActivityCard } from '@/components/ui/ActivityCard'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { EditProfileButton } from '@/components/ui/EditProfileButton'

async function getProfileByUsername(username: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (error || !data) return null
  return data
}

async function getActivitiesBySubmitter(profileId: string): Promise<Activity[]> {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('submitted_by', profileId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch activities:', error.message)
    return []
  }
  return data ?? []
}

async function getCitiesLived(cityIds: string[]): Promise<City[]> {
  if (cityIds.length === 0) return []

  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .in('id', cityIds)

  if (error) {
    console.error('Failed to fetch cities lived:', error.message)
    return []
  }
  return data ?? []
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  const profile = await getProfileByUsername(username)
  if (!profile) notFound()

  const [activities, citiesLived] = await Promise.all([
    getActivitiesBySubmitter(profile.id),
    getCitiesLived(profile.cities_lived ?? []),
  ])

  const freeCount = activities.filter((a) => a.is_free).length

  return (
    <div className="min-h-screen bg-warm-white text-earth font-sans flex flex-col">
      <Header />

      {/* Profile header */}
      <section className="px-6 pt-12 pb-10 max-w-4xl mx-auto w-full">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="relative w-20 h-20 rounded-full bg-sand/50 shrink-0 flex items-center justify-center text-3xl overflow-hidden">
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt={profile.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span aria-hidden>&#x1F464;</span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-earth leading-tight">
                {profile.username}
              </h1>
              {profile.is_trusted_curator && (
                <span className="inline-flex items-center gap-1 bg-terracotta/10 text-terracotta text-xs font-semibold px-2.5 py-1 rounded-full">
                  <span aria-hidden>&#x2728;</span>
                  Trusted curator
                </span>
              )}
            </div>

            {profile.bio ? (
              <p className="text-earth-muted text-sm mt-2 leading-relaxed max-w-xl">
                {profile.bio}
              </p>
            ) : (
              <p className="text-earth-muted/60 text-sm mt-2 italic">
                No bio yet.
              </p>
            )}

            <div className="mt-3">
              <EditProfileButton profileId={profile.id} />
            </div>

            {citiesLived.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {citiesLived.map((city) => (
                  <Link
                    key={city.id}
                    href={`/cities/${city.slug}`}
                    className="inline-flex items-center gap-1.5 bg-sand/40 hover:bg-sand/60 text-earth text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
                  >
                    <span aria-hidden>&#x1F3D9;</span>
                    Lived in {city.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Submissions */}
      <main className="px-6 pb-20 max-w-4xl mx-auto w-full flex-1">
        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          <h2 className="text-sm font-semibold text-earth-muted uppercase tracking-widest">
            Submitted activities
          </h2>
          {activities.length > 0 && (
            <p className="text-earth-muted text-sm">
              {activities.length} place{activities.length !== 1 ? 's' : ''}
              {freeCount > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 bg-olive/10 text-olive text-xs font-semibold px-2.5 py-0.5 rounded-full align-middle">
                  &#x2713; {freeCount} free
                </span>
              )}
            </p>
          )}
        </div>

        {activities.length === 0 ? (
          <div className="text-center py-24 text-earth-muted">
            <div className="text-5xl mb-4" aria-hidden>
              &#x1F5FA;&#xFE0F;
            </div>
            <p className="text-lg font-medium text-earth mb-1">
              No submissions yet
            </p>
            <p className="text-sm">
              {profile.username} hasn&apos;t added any activities yet — check
              back soon.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}