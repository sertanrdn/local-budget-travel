'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/hooks/useUser'

const NAV_LINKS = [
  { href: '/cities', label: 'Cities' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false) // mobile menu
  const [menuOpen, setMenuOpen] = useState(false) // desktop user dropdown
  const menuRef = useRef<HTMLDivElement>(null)
  const { user, profile, loading } = useUser()

  const [prevPathname, setPrevPathname] = useState(pathname)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setMenuOpen(false)
    setIsOpen(false)
  }

  // Close the desktop dropdown on outside click
  useEffect(() => {
    if (!menuOpen) return

    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  async function handleLogout() {
    await supabase.auth.signOut()
    setIsOpen(false)
    setMenuOpen(false)
    router.push('/')
    router.refresh()
  }

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
        <nav className="hidden sm:flex items-center gap-8">
          <div className="flex items-center gap-6">
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
          </div>

          {!loading && (
            user ? (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-full border border-transparent hover:border-sand transition-colors"
                  aria-expanded={menuOpen}
                  aria-haspopup="true"
                >
                  <span className="text-sm font-medium text-earth-muted">
                    {profile?.username ?? 'Profile'}
                  </span>
                  <Avatar avatarUrl={profile?.avatar_url ?? null} size={32} />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-lg border border-sand overflow-hidden z-20">
                    {profile?.username && (
                      <Link
                        href={`/profile/${profile.username}`}
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-3 text-sm font-medium text-earth hover:bg-sand/40 transition-colors"
                      >
                        Profile
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-earth-muted hover:bg-sand/40 hover:text-terracotta transition-colors border-t border-sand/60"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-earth-muted hover:text-terracotta transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-terracotta text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-terracotta-dark transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )
          )}
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="sm:hidden text-earth-muted hover:text-terracotta transition-colors p-1"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
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
          <div className="mt-2 pt-2 border-t border-sand/60 flex flex-col gap-1">
            {!loading && (
              user ? (
                <>
                  {profile?.username && (
                    <Link
                      href={`/profile/${profile.username}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2.5 px-2 py-2.5 rounded-lg text-earth-muted hover:bg-sand/40 transition-colors"
                    >
                      <Avatar avatarUrl={profile.avatar_url} size={24} />
                      {profile.username}
                    </Link>
                  )}
                  <Link
                    href="/profile/edit"
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-medium px-2 py-2.5 rounded-lg text-earth-muted hover:bg-sand/40 transition-colors"
                  >
                    Edit profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-sm font-medium px-2 py-2.5 rounded-lg text-earth-muted hover:bg-sand/40 hover:text-terracotta transition-colors text-left"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-medium px-2 py-2.5 rounded-lg text-earth-muted hover:bg-sand/40 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-medium px-2 py-2.5 rounded-lg text-terracotta hover:bg-terracotta/10 transition-colors"
                  >
                    Sign up
                  </Link>
                </>
              )
            )}
          </div>
        </nav>
      )}
    </header>
  )
}

function Avatar({
  avatarUrl,
  size,
}: {
  avatarUrl: string | null | undefined
  size: number
}) {
  return (
    <span
      className="relative rounded-full bg-sand/60 overflow-hidden shrink-0 flex items-center justify-center"
    >
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt=""
          fill
          className="object-cover"
          sizes={`${size}px`}
        />
      ) : (
        <span aria-hidden className="text-earth-muted">
          &#x1F464;
        </span>
      )}
    </span>
  )
}