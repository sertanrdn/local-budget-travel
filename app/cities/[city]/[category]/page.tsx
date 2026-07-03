import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { Activity, Category, City } from '@/lib/types'
import { ActivityCard } from '@/components/ui/ActivityCard'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

// Convert URL slug back to category name for DB lookup
// e.g. "street-food" → "Street Food", "free-museums" → "Free Museums"
function slugToCategoryName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

async function getCityBySlug(citySlug: string): Promise<City | null> {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', citySlug)
    .single()

  if (error || !data) return null
  return data
}

async function getCategoryByName(
  name: string,
  cityId: string
): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('city_id', cityId)
    .eq('name', name)
    .single()

  if (error || !data) return null
  return data
}

async function getActivitiesByCategory(
  categoryId: string,
  cityId: string
): Promise<Activity[]> {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('category_id', categoryId)
    .eq('city_id', cityId)
    .order('created_at')

  if (error) {
    console.error('Failed to fetch activities:', error.message)
    return []
  }
  return data ?? []
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ city: string; category: string }>
}) {
  const { city: citySlug, category: categorySlug } = await params

  const city = await getCityBySlug(citySlug)
  if (!city) notFound()

  const categoryName = slugToCategoryName(categorySlug)
  const category = await getCategoryByName(categoryName, city.id)
  if (!category) notFound()

  const activities = await getActivitiesByCategory(category.id, city.id)

  const freeCount = activities.filter((a) => a.is_free).length

  return (
    <div className="min-h-screen bg-warm-white text-earth font-sans">
      <Header />

      {/* Category hero */}
      <section className="px-6 pt-10 pb-8 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-earth-muted mb-6">
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
          <span className="text-earth">{category.name}</span>
        </div>

        <div className="flex items-start gap-4">
          <span className="text-5xl" aria-hidden>
            {category.icon}
          </span>
          <div>
            <h1 className="text-3xl font-bold text-earth leading-tight">
              {category.name}
            </h1>
            <p className="text-earth-muted mt-1">
              {activities.length} place{activities.length !== 1 ? 's' : ''} in {city.name}
              {freeCount > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 bg-olive/10 text-olive text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  ✓ {freeCount} free
                </span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Activities list */}
      <main className="px-6 pb-20 max-w-4xl mx-auto">
        {activities.length === 0 ? (
          <div className="text-center py-24 text-earth-muted">
            <div className="text-5xl mb-4" aria-hidden>🗂️</div>
            <p className="text-lg font-medium text-earth mb-1">Nothing here yet</p>
            <p className="text-sm">Check back soon — we&apos;re adding new spots.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}