import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Activity, Category, City } from '@/lib/types'
import { ActivityMap } from '@/components/maps/ActivityMap'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { isWikimediaUrl } from '@/lib/isWikimediaUrl'
import { getShortAddress } from '@/lib/formatAddress'

async function getActivity(id: string): Promise<Activity | null> {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data
}

async function getCategory(id: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data
}

async function getCity(id: string): Promise<City | null> {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data
}

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const activity = await getActivity(id)
  if (!activity) notFound()

  const [category, city] = await Promise.all([
    activity.category_id ? getCategory(activity.category_id) : null,
    getCity(activity.city_id),
  ])

  const categorySlug = category?.name.toLowerCase().replace(/\s+/g, '-') ?? ''

  return (
    <div className="min-h-screen bg-warm-white text-earth font-sans">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-10 pb-24">
        {/* Breadcrumb */}
        {city && category && (
          <nav className="flex items-center gap-2 text-sm text-earth-muted mb-8">
            <Link href="/cities" className="hover:text-terracotta transition-colors">
              Cities
            </Link>
            <span>/</span>
            <Link
              href={`/cities/${city.slug}`}
              className="hover:text-terracotta transition-colors"
            >
              {city.name}
            </Link>
            <span>/</span>
            <Link
              href={`/cities/${city.slug}/${categorySlug}`}
              className="hover:text-terracotta transition-colors"
            >
              {category.name}
            </Link>
            <span>/</span>
            <span className="text-earth truncate max-w-48">{activity.title}</span>
          </nav>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: main content */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* Title + badges */}
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {category && (
                  <span className="text-sm text-earth-muted font-medium">
                    {category.icon} {category.name}
                  </span>
                )}
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    activity.is_free
                      ? 'bg-olive/10 text-olive'
                      : 'bg-terracotta/10 text-terracotta'
                  }`}
                >
                  {activity.is_free ? '✓ Free' : activity.estimated_cost || 'Paid'}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-earth leading-tight">
                {activity.title}
              </h1>
              {activity.address && (
                <p className="text-earth-muted/70 text-sm mt-2 flex items-center gap-1.5">
                  <span aria-hidden>📍</span>
                  {getShortAddress(activity.address)}
                </p>
              )}
            </div>

            {/* Photo */}
            {activity.photo_url && (
              <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-sand/30">
                <Image
                  src={activity.photo_url}
                  alt={activity.title}
                  fill
                  unoptimized={isWikimediaUrl(activity.photo_url)}
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>
            )}

            {/* Description */}
            {activity.description && (
              <div>
                <h2 className="text-xs font-semibold text-earth-muted uppercase tracking-widest mb-3">
                  About
                </h2>
                <p className="text-earth leading-relaxed text-base">
                  {activity.description}
                </p>
              </div>
            )}

            {/* Local tip — hero field */}
            {activity.local_tip && (
              <div className="bg-terracotta/5 border border-terracotta/15 rounded-2xl px-5 py-4">
                <p className="text-xs font-semibold text-terracotta uppercase tracking-widest mb-2">
                  🗺 Local tip
                </p>
                <p className="text-earth leading-relaxed text-sm">
                  {activity.local_tip}
                </p>
              </div>
            )}
            {/* Origin story — the personal "I found this while..." bit */}
            {activity.origin_story && (
              <div>
                <h2 className="text-xs font-semibold text-earth-muted uppercase tracking-widest mb-3">
                  How I found this
                </h2>
                <p className="text-earth leading-relaxed text-base italic">
                  {activity.origin_story}
                </p>
              </div>
            )}
          </div>

          {/* Right: map + cost info */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Cost card */}
            <div className="bg-white border border-sand/80 rounded-2xl p-5">
              <h2 className="text-xs font-semibold text-earth-muted uppercase tracking-widest mb-4">
                At a glance
              </h2>
              <dl className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-sm text-earth-muted">Cost</dt>
                  <dd
                    className={`text-sm font-semibold ${
                      activity.is_free ? 'text-olive' : 'text-terracotta'
                    }`}
                  >
                    {activity.is_free ? 'Free' : activity.estimated_cost || 'Paid'}
                  </dd>
                </div>
                {city && (
                  <div className="flex items-start justify-between gap-3">
                    <dt className="text-sm text-earth-muted">City</dt>
                    <dd className="text-sm font-medium text-earth">
                      {city.name}, {city.country}
                    </dd>
                  </div>
                )}
                {category && (
                  <div className="flex items-start justify-between gap-3">
                    <dt className="text-sm text-earth-muted">Category</dt>
                    <dd className="text-sm font-medium text-earth">
                      {category.icon} {category.name}
                    </dd>
                  </div>
                )}
                {activity.address && (
                  <div className="flex items-start justify-between gap-3">
                    <dt className="text-sm text-earth-muted shrink-0">Address</dt>
                    <dd className="text-sm text-earth text-right">{activity.address}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Map */}
            {activity.latitude != null && activity.longitude != null ? (
              <div className="bg-white border border-sand/80 rounded-2xl overflow-hidden">
                <div className="h-56">
                  <ActivityMap
                    lat={activity.latitude}
                    lng={activity.longitude}
                    title={activity.title}
                  />
                </div>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${activity.latitude}&mlon=${activity.longitude}&zoom=16`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-3 text-xs text-earth-muted hover:text-terracotta transition-colors border-t border-sand/60"
                >
                  Open in OpenStreetMap ↗
                </a>
              </div>
            ) : null}

            {/* Back link */}
            {city && category && (
              <Link
                href={`/cities/${city.slug}/${categorySlug}`}
                className="text-center text-sm text-earth-muted hover:text-terracotta transition-colors py-2"
              >
                ← Back to {category.name} in {city.name}
              </Link>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}