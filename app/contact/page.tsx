import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-warm-white text-earth font-sans flex flex-col">
      <Header />

      <main className="flex-1 px-6 py-16 max-w-2xl mx-auto w-full text-center">
        <p className="text-terracotta font-semibold text-xs tracking-widest uppercase mb-4">
          Contact
        </p>

        <h1 className="text-3xl sm:text-4xl font-bold text-earth leading-tight mb-6">
          Say hello.
        </h1>

        <p className="text-earth-muted text-base leading-relaxed max-w-md mx-auto mb-10">
          Spotted an outdated tip, know a hidden gem we&apos;re missing, or just
          want to say hi? We&apos;d love to hear from you.
        </p>

        <a
          href="mailto:hello@localbudgettravel.com"
          className="inline-flex items-center gap-2 bg-terracotta text-white px-6 py-3 rounded-full font-medium hover:bg-terracotta-dark transition-colors"
        >
          <span aria-hidden>&#x2709;&#xFE0F;</span>
          hello@localbudgettravel.com
        </a>

        <div className="mt-12">
          <Link
            href="/cities"
            className="text-sm text-earth-muted hover:text-terracotta transition-colors"
          >
            &larr; Back to all cities
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}