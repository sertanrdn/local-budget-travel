import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-warm-white font-sans flex flex-col items-center justify-center text-center px-6">
      <div className="text-6xl mb-4" aria-hidden>
        &#x1F464;
      </div>
      <h1 className="text-2xl font-bold text-earth mb-2">Profile not found</h1>
      <p className="text-earth-muted mb-8">
        We couldn&apos;t find a local under that username.
      </p>
      <Link
        href="/cities"
        className="bg-terracotta text-white px-6 py-3 rounded-full font-medium hover:bg-terracotta-dark transition-colors"
      >
        Browse all cities
      </Link>
    </div>
  )
}