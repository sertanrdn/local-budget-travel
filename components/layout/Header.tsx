'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const NAV_LINKS = [
  { href: '/cities', label: 'Cities' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="px-6 py-5 border-b border-sand/60 relative">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setIsOpen(false)}
        >
          <span className="text-2xl" aria-hidden>
            &#x1F33F;
          </span>
          <span className="font-semibold text-earth text-lg tracking-tight">
            Local Budget Travel
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-terracotta'
                    : 'text-earth-muted hover:text-terracotta'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="sm:hidden text-earth-muted hover:text-terracotta transition-colors p-1"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen ? 'true' : 'false'}
        >
          <span className="text-2xl leading-none" aria-hidden>
            {isOpen ? '\u00D7' : '\u2630'}
          </span>
        </button>
      </div>

      {/* Mobile nav dropdown */}
      {isOpen && (
        <nav className="sm:hidden max-w-4xl mx-auto mt-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-sm font-medium px-2 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-terracotta/10 text-terracotta'
                    : 'text-earth-muted hover:bg-sand/40'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      )}
    </header>
  )
}