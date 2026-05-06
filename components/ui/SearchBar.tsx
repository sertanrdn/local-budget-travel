'use client'

import { useState } from 'react'
import Link from 'next/link'

interface City {
  name: string
  country: string
  slug: string
}

const CITIES: City[] = [
  { name: 'Istanbul', country: 'Turkey', slug: 'istanbul' },
]

export function SearchBar() {
  const [query, setQuery] = useState('')

  const results =
    query.length > 0
      ? CITIES.filter((c) =>
          c.name.toLowerCase().includes(query.toLowerCase())
        )
      : []

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a city, e.g. Istanbul…"
          className="w-full px-5 py-4 pr-12 rounded-full border-2 border-sand bg-white text-earth placeholder:text-earth-muted/50 focus:outline-none focus:border-terracotta text-base shadow-sm transition-colors"
        />
        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-earth-muted/50 pointer-events-none">
          &#x1F50D;
        </span>
      </div>
      {results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-lg border border-sand overflow-hidden z-10">
          {results.map((city) => (
            <Link
              key={city.slug}
              href={`/cities/${city.slug}`}
              className="flex items-center gap-3 px-5 py-3 hover:bg-sand/40 transition-colors"
              onClick={() => setQuery('')}
            >
              <span className="text-xl">&#x1F3D9;</span>
              <div>
                <div className="font-medium text-earth">{city.name}</div>
                <div className="text-sm text-earth-muted">{city.country}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
