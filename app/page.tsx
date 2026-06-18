import Link from 'next/link'
import { SearchBar } from '@/components/ui/SearchBar'

const FEATURED_CITIES = [
  {
    name: 'Istanbul',
    country: 'Turkey',
    slug: 'istanbul',
    description:
      "Two continents, one city — ancient bazaars, jaw-dropping viewpoints, and the world's best street food for under €2.",
    freeCount: 28,
    totalCount: 40,
    emoji: '&#x1F54C;',
  },
]

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

export default function Home() {
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
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURED_CITIES.map((city) => (
            <Link key={city.slug} href={`/cities/${city.slug}`} className="group block">
              <div className="relative rounded-3xl overflow-hidden bg-linear-to-br from-terracotta to-olive p-6 min-h-52 flex flex-col justify-between group-hover:brightness-105 transition-all duration-200">
                {/* Decorative blob */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white" />
                  <div className="absolute -bottom-10 -left-6 w-32 h-32 rounded-full bg-white" />
                </div>

                <div className="relative flex items-start justify-between">
                  <div>
                    <span
                      className="text-4xl"
                      aria-hidden
                      dangerouslySetInnerHTML={{ __html: city.emoji }}
                    />
                    <h3 className="text-2xl font-bold text-white mt-3">
                      {city.name}
                    </h3>
                    <p className="text-white/70 text-sm">{city.country}</p>
                  </div>
                  <div className="flex flex-col gap-1.5 items-end text-right shrink-0">
                    <span className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-medium">
                      {city.freeCount} free
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-medium">
                      {city.totalCount} total
                    </span>
                  </div>
                </div>

                <p className="relative text-white/85 text-sm leading-relaxed mt-4">
                  {city.description}
                </p>
              </div>
            </Link>
          ))}
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
