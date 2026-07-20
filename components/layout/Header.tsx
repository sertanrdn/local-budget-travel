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
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); // mobile menu
  const [menuOpen, setMenuOpen] = useState(false); // desktop user dropdown
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, profile, loading } = useUser();

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
    setIsOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  async function handleLogout() {
    await supabase.auth.signOut();
    setIsOpen(false);
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="px-6 py-4 border-b border-sand/60 relative">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Left cluster: logo + nav, grouped together */}
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0"
            onClick={() => setIsOpen(false)}
          >
            <span className="text-2xl" aria-hidden>
              &#x1F33F;
            </span>
            <span className="font-semibold text-earth text-lg tracking-tight">
              Local Budget Travel
            </span>
          </Link>

          <nav className="hidden sm:flex items-center gap-6">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? "text-terracotta"
                      : "text-earth-muted hover:text-terracotta"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right cluster: account */}
        <div className="hidden sm:flex items-center">
          {!loading &&
            (user ? (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="block rounded-full ring-offset-2 ring-terracotta/40 hover:ring-2 transition-shadow"
                  aria-expanded={menuOpen}
                  aria-haspopup="true"
                  aria-label="Account menu"
                >
                  <Avatar avatarUrl={profile?.avatar_url} size="md" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-lg border border-sand overflow-hidden z-20">
                    {profile?.username && (
                      <div className="px-4 py-3 border-b border-sand/60">
                        <p className="text-sm font-semibold text-earth truncate">
                          {profile.username}
                        </p>
                      </div>
                    )}
                    {profile?.username && (
                      <Link
                        href={`/profile/${profile.username}`}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-earth hover:bg-sand/40 transition-colors"
                      >
                        <UserIcon />
                        Profile
                      </Link>
                    )}
                    <Link
                      href="/activity/submit"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-earth hover:bg-sand/40 transition-colors"
                    >
                      <PlusCircleIcon />
                      Submit Activity
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-earth-muted hover:bg-sand/40 hover:text-terracotta transition-colors text-left"
                    >
                      <LogOutIcon />
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
            ))}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="sm:hidden text-earth-muted hover:text-terracotta transition-colors p-1"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          <span className="text-2xl leading-none" aria-hidden>
            {isOpen ? "\u00D7" : "\u2630"}
          </span>
        </button>
      </div>

      {/* Mobile nav dropdown — placeholder, full redesign coming in a later branch */}
      {isOpen && (
        <nav className="sm:hidden max-w-4xl mx-auto mt-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-sm font-medium px-2 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-terracotta/10 text-terracotta"
                    : "text-earth-muted hover:bg-sand/40"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="mt-2 pt-2 border-t border-sand/60 flex flex-col gap-1">
            {!loading &&
              (user ? (
                <>
                  {profile?.username && (
                    <Link
                      href={`/profile/${profile.username}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2.5 px-2 py-2.5 rounded-lg text-earth-muted hover:bg-sand/40 transition-colors"
                    >
                      <Avatar avatarUrl={profile.avatar_url} size="sm" />
                      {profile.username}
                    </Link>
                  )}
                  <Link
                    href="/activity/submit"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-earth hover:bg-sand/40 transition-colors"
                  >
                    <PlusCircleIcon />
                    Submit Activity
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
              ))}
          </div>
        </nav>
      )}
    </header>
  );
}

function Avatar({
  avatarUrl,
  size,
}: {
  avatarUrl: string | null | undefined
  size: 'sm' | 'md'
}) {
  const dimClass = size === 'md' ? 'w-9 h-9' : 'w-6 h-6'
  const textClass = size === 'md' ? 'text-lg' : 'text-sm'

  return (
    <span
      className={`relative ${dimClass} rounded-full bg-sand/60 overflow-hidden shrink-0 flex items-center justify-center`}
    >
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt=""
          fill
          className="object-cover"
          sizes={size === 'md' ? '36px' : '24px'}
        />
      ) : (
        <span aria-hidden className={`text-earth-muted ${textClass}`}>
          &#x1F464;
        </span>
      )}
    </span>
  )
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function PlusCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  )
}

function LogOutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}