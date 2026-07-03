import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-warm-white text-earth font-sans flex flex-col">
      <Header />

      <main className="flex-1 px-6 py-16 max-w-2xl mx-auto w-full">
        <p className="text-terracotta font-semibold text-xs tracking-widest uppercase mb-4">
          About
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-earth leading-tight mb-6">
          Travel doesn&apos;t need a big budget.
        </h1>

        <div className="flex flex-col gap-5 text-earth-muted text-base leading-relaxed">
          <p>
            Local Budget Travel started from a simple frustration: most travel
            guides point you toward the same paid attractions, the same tourist
            traps, the same overpriced &ldquo;must-sees.&rdquo; We wanted
            something different &mdash; a guide built for students, backpackers,
            and anyone who&apos;d rather spend a day discovering a hidden park
            than queuing for a landmark.
          </p>
          <p>
            Every place in this guide shows clearly whether it&apos;s free or
            exactly how much it costs. No surprises, no hidden entrance fees
            buried three paragraphs into a description.
          </p>
          <p>
            And every activity comes with a local tip &mdash; the kind of thing
            only someone who actually lived there would know. The best time to
            go, the bus to take instead of a taxi, the dish to order. That&apos;s
            the part we care about most.
          </p>
          <p>
            We&apos;re just getting started, with a handful of cities so far.
            More are on the way.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/cities"
            className="bg-terracotta text-white px-6 py-3 rounded-full font-medium hover:bg-terracotta-dark transition-colors"
          >
            Browse cities
          </Link>
          <Link
            href="/contact"
            className="bg-white border border-sand/80 text-earth-muted px-6 py-3 rounded-full font-medium hover:border-terracotta/40 hover:text-terracotta transition-colors"
          >
            Get in touch
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}