import Link from 'next/link'
import { SearchBar } from '@/components/ui/SearchBar'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import type { City } from '@/lib/types'

const FEATURES = [
  {
    icon: '&#x1F193;',
    title: 'Budget first',
    desc: 'Every activity shows if it\'s free or exactly how much it costs. No surprises.',
  },
  {
    icon: '&#x1F4CD;',
    title: 'Insider tips',
    desc: "Local knowledge you won't find in guidebooks — the shortcuts, best times, and hidden spots.",
  },
  {
    icon: '&#x1F48E;',
    title: 'Hidden gems',
    desc: 'Skip the overrated tourist traps. Discover the places only locals know about.',
  },
]

const GRADIENTS = [
  'from-terracotta to-olive',
  'from-olive to-earth-muted',
  'from-terracotta-dark to-earth-muted',
]

async function getCities(): Promise<City[]> {
  const { data, error } = await supabase.from('cities').select('*').order('name')
  if (error) return []
  return data ?? []
}

async function getFreeCountsByCity(): Promise<Record<string, number>> {
  const { data, error } = await supabase.from('activities').select('city_id, is_free')
  if (error || !data) return {}
  return data.reduce<Record<string, number>>((acc, row) => {
    if (row.is_free) acc[row.city_id] = (acc[row.city_id] ?? 0) + 1
    return acc
  }, {})
}

async function getTotalCountsByCity(): Promise<Record<string, number>> {
  const { data, error } = await supabase.from('activities').select('city_id')
  if (error || !data) return {}
  return data.reduce<Record<string, number>>((acc, row) => {
    acc[row.city_id] = (acc[row.city_id] ?? 0) + 1
    return acc
  }, {})
}

export default async function Home() {
  const [cities, freeCounts, totalCounts] = await Promise.all([
    getCities(),
    getFreeCountsByCity(),
    getTotalCountsByCity(),
  ])

  return (
    <div className="min-h-screen bg-warm-white text-earth font-sans">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden>&#x1F33F;</span>
          <span className="font-semibold text-earth text-lg tracking-tight">
            Local Budget Travel
          </span>
        </div>
        <Link
          href="/cities"
          className="text-sm text-earth-muted hover:text-terracotta transition-colors"
        >
          All cities &rarr;
        </Link>
      </header>

      {/* Hero */}
      <section className="px-6 pt-14 pb-20 text-center max-w-2xl mx-auto">
        <p className="text-terracotta font-semibold text-xs tracking-widest uppercase mb-5">
          Travel local &bull; Spend less
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-earth leading-tight mb-6">
          Explore cities<br />like a local.
        </h1>
        <p className="text-earth-muted text-lg leading-relaxed mb-10 max-w-lg mx-auto">
          Free activities, hidden gems, and real insider tips &mdash; from
          people who actually lived there. No tourist traps, no big budgets.
        </p>
        <SearchBar />
      </section>

      {/* Featured Cities */}
      <section className="px-6 pb-20 max-w-3xl mx-auto">
        <h2 className="text-lg font-semibold text-earth mb-5">
          Start exploring
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city, i) => {
            const freeCount = freeCounts[city.id] ?? 0
            const totalCount = totalCounts[city.id] ?? 0
            const gradient = GRADIENTS[i % GRADIENTS.length]
            return (
              <Link key={city.slug} href={`/cities/${city.slug}`} className="group block">
                <div className={`relative rounded-3xl overflow-hidden bg-linear-to-br ${gradient} min-h-52 flex flex-col justify-end group-hover:brightness-105 transition-all duration-200`}>
                  {city.cover_image_url && (
                    <Image
                      src={city.cover_image_url}
                      alt={city.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="relative p-5">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-bold text-white">{city.name}</h3>
                        <p className="text-white/70 text-sm">{city.country}</p>
                      </div>
                      <div className="flex flex-col gap-1 items-end shrink-0">
                        {freeCount > 0 && (
                          <span className="bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-white text-xs font-medium">
                            {freeCount} free
                          </span>
                        )}
                        {totalCount > 0 && (
                          <span className="bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-white text-xs font-medium">
                            {totalCount} total
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 border-t border-sand">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-earth mb-3">
              Travel the way locals do
            </h2>
            <p className="text-earth-muted text-base">
              Built for students, backpackers, and anyone who values authentic
              over expensive.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 border border-sand/80"
              >
                <div
                  className="text-3xl mb-3"
                  aria-hidden
                  dangerouslySetInnerHTML={{ __html: f.icon }}
                />
                <h3 className="font-semibold text-earth mb-2">{f.title}</h3>
                <p className="text-earth-muted text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center border-t border-sand">
        <p className="text-earth-muted text-sm">
          Local Budget Travel &mdash; explore more, spend less.
        </p>
      </footer>
    </div>
  )
}
