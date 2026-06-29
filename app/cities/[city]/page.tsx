import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { City, Category } from "@/lib/types";

async function getCityBySlug(citySlug: string): Promise<City | null> {
    const { data, error } = await supabase
        .from('cities')
        .select('*')
        .eq('slug', citySlug)
        .single()

    if (error || !data) return null
    return data
}

async function getCategoriesForCity(cityId: string): Promise<Category[]> {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('city_id', cityId)
        .order('name')

    if (error) {
        console.error('Failed to fetch categories:', error.message)
        return []
    }
    return data ?? []
}

async function getActivityCountsByCategory(
    cityId: string
): Promise<Record<string, number>> {
    const { data, error } = await supabase
        .from('activities')
        .select('category_id')
        .eq('city_id', cityId)

    if (error || !data) return {}

    return data.reduce<Record<string, number>>((acc, row) => {
        acc[row.category_id] = (acc[row.category_id] ?? 0) + 1
        return acc
    }, {})
}

export default async function CityPage({ 
    params 
}: { 
        params: Promise<{ city: string }>
}) {
    const { city: citySlug } = await params;
    const city = await getCityBySlug(citySlug)
    if (!city) notFound()
  
    const [categories, countsByCategory] = await Promise.all([
        getCategoriesForCity(city.id),
        getActivityCountsByCategory(city.id),
    ])

    return (
        <div className="min-h-screen bg-warm-white text-earth font-sans">
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
                href="/cities"
                className="text-sm text-earth-muted hover:text-terracotta transition-colors"
              >
                ← All cities
              </Link>
            </div>
          </header>

            {/* Cover image */}
            {city.cover_image_url && (
            <div className="relative h-80 md:h-96 w-full">
                <Image
                    src={city.cover_image_url}
                    alt={city.name}
                    fill
                    className="object-cover object-center"
                    priority
                />
                <div className="absolute inset-0 bg-black/10" />
            </div>
            )}
    
          {/* City hero */}
          <section className="px-6 pt-12 pb-10 max-w-4xl mx-auto">
            <p className="text-terracotta text-sm font-semibold tracking-widest uppercase mb-2">
              {city.country}
            </p>
            <h1 className="text-4xl font-bold text-earth mb-4">{city.name}</h1>
            {city.description && (
              <p className="text-earth-muted text-lg leading-relaxed max-w-2xl">
                {city.description}
              </p>
            )}
          </section>
    
          {/* Categories grid */}
          <main className="px-6 pb-20 max-w-4xl mx-auto">
            <h2 className="text-sm font-semibold text-earth-muted uppercase tracking-widest mb-6">
              Browse by category
            </h2>
    
            {categories.length === 0 ? (
              <div className="text-center py-24 text-earth-muted">
                <div className="text-5xl mb-4" aria-hidden>🗂️</div>
                <p className="text-lg font-medium text-earth mb-1">No categories yet</p>
                <p className="text-sm">Check back soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/cities/${citySlug}/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="group"
                  >
                    <div className="bg-white border border-sand/80 rounded-2xl p-5 h-full hover:border-terracotta/40 hover:shadow-sm transition-all duration-200">
                      <span className="text-3xl block mb-3" aria-hidden>
                        {cat.icon}
                      </span>
                      <h3 className="font-semibold text-earth group-hover:text-terracotta transition-colors">
                        {cat.name}
                      </h3>
                      {countsByCategory[cat.id] !== undefined && (
                        <p className="text-earth-muted text-sm mt-1">
                          {countsByCategory[cat.id]} place
                          {countsByCategory[cat.id] !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
    
          <footer className="px-6 py-8 text-center border-t border-sand">
            <p className="text-earth-muted text-sm">
              Local Budget Travel &mdash; explore more, spend less.
            </p>
          </footer>
        </div>
    )
}