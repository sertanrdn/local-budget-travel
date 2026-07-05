import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import type { City } from '@/lib/types'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

async function getCities(): Promise<City[]> {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .order('name')

  if (error) {
    console.error('Failed to fetch cities:', error.message)
    return []
  }

  return data ?? []
}

const GRADIENTS = [
  'from-terracotta to-olive',
  'from-olive to-earth-muted',
  'from-terracotta-dark to-earth-muted',
  'from-olive-light to-olive',
  'from-earth-muted to-terracotta',
  'from-terracotta to-terracotta-dark',
]

export default async function CitiesPage() {
  const cities = await getCities()

  return (
    <div className="min-h-screen bg-warm-white text-earth font-sans">
      <Header />
      <main className="px-6 py-12 max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-earth mb-2">All cities</h1>
          <p className="text-earth-muted">
            Choose a city and start exploring like a local.
          </p>
        </div>

        {cities.length === 0 ? (
          <div className="text-center py-24 text-earth-muted">
            <div className="text-5xl mb-4" aria-hidden>&#x1F5FA;</div>
            <p className="text-lg font-medium text-earth mb-1">No cities yet</p>
            <p className="text-sm">Check back soon — more cities are on the way.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {cities.map((city, i) => (
              <CityCard key={city.id} city={city} gradientIndex={i} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

function CityCard({
  city,
  gradientIndex,
}: {
  city: City
  gradientIndex: number
}) {
  const gradient = GRADIENTS[gradientIndex % GRADIENTS.length]

  return (
    <Link href={`/cities/${city.slug}`} className="group block">
      <div className="rounded-2xl overflow-hidden border border-sand/60 bg-white group-hover:shadow-md transition-shadow duration-200 h-full">
        <div
          className={`relative h-40 bg-linear-to-br ${gradient} flex items-end p-4`}
        >
          {city.cover_image_url && (
            <Image
              src={city.cover_image_url}
              alt={city.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="eager"
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative">
            <h2 className="text-xl font-bold text-white leading-tight">
              {city.name}
            </h2>
            <p className="text-white/75 text-sm">{city.country}</p>
          </div>
        </div>

        {city.description && (
          <div className="p-4">
            <p className="text-earth-muted text-sm leading-relaxed line-clamp-3">
              {city.description}
            </p>
          </div>
        )}
      </div>
    </Link>
  )
}
