import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Activity, City } from '@/lib/types'
import { CityActivitiesMap } from '@/components/maps/CityActivitiesMap'

async function getCityBySlug(citySlug: string): Promise<City | null> {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', citySlug)
    .single()

  if (error || !data) return null
  return data
}

async function getMappableActivities(cityId: string): Promise<Activity[]> {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('city_id', cityId)
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)

  if (error) {
    console.error('Failed to fetch activities:', error.message)
    return []
  }
  return (data ?? []) as Activity[]
}

export default async function CityMapPage({
  params,
}: {
  params: Promise<{ city: string }>
}) {
  const { city: citySlug } = await params
  const city = await getCityBySlug(citySlug)
  if (!city) notFound()

  const activities = await getMappableActivities(city.id)
  const freeCount = activities.filter((a) => a.is_free).length

  return (
    <div className="min-h-screen bg-warm-white text-earth font-sans flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 border-b border-sand/60">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden>&#x1F33F;</span>
            <span className="font-semibold text-earth text-lg tracking-tight">
              Local Budget Travel
            </span>
          </Link>
          <Link
            href={`/cities/${citySlug}`}
            className="text-sm text-earth-muted hover:text-terracotta transition-colors"
          >
            ← {city.name}
          </Link>
        </div>
      </header>

      {/* Page heading */}
      <section className="px-6 pt-8 pb-6 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-2 text-sm text-earth-muted mb-4 flex-wrap">
          <Link href="/cities" className="hover:text-terracotta transition-colors">
            Cities
          </Link>
          <span>/</span>
          <Link
            href={`/cities/${citySlug}`}
            className="hover:text-terracotta transition-colors"
          >
            {city.name}
          </Link>
          <span>/</span>
          <span className="text-earth">Map</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-earth mb-1">
          {city.name} on the map
        </h1>
        <p className="text-earth-muted text-sm">
          {activities.length} place{activities.length !== 1 ? 's' : ''} mapped
          {freeCount > 0 && (
            <span className="ml-2 inline-flex items-center gap-1 bg-olive/10 text-olive text-xs font-semibold px-2.5 py-0.5 rounded-full align-middle">
              ✓ {freeCount} free
            </span>
          )}
        </p>
      </section>

      {/* Map */}
      <main className="px-6 pb-16 max-w-4xl mx-auto w-full flex-1">
        <div className="bg-white border border-sand/80 rounded-2xl overflow-hidden h-[70vh] min-h-105">
          <CityActivitiesMap
            activities={activities.map((a) => ({
              id: a.id,
              title: a.title,
              latitude: a.latitude,
              longitude: a.longitude,
              is_free: a.is_free,
            }))}
            cityName={city.name}
          />
        </div>
      </main>

      <footer className="px-6 py-8 text-center border-t border-sand">
        <p className="text-earth-muted text-sm">
          Local Budget Travel &mdash; explore more, spend less.
        </p>
      </footer>
    </div>
  )
}