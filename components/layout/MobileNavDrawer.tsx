"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/lib/types";
import { NAV_LINKS } from "./Header";

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  onLogout: () => void;
}

export function MobileNavDrawer({
  isOpen,
  onClose,
  pathname,
  user,
  profile,
  loading,
  onLogout,
}: MobileNavDrawerProps) {
  // Lock body scroll while the drawer is open — same pattern used in
  // ActivityActions.tsx for the delete confirmation modal.
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  return (
    <div
      className={`sm:hidden fixed inset-0 z-9999 ${
        isOpen ? "" : "pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-earth/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-warm-white shadow-lg flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header row: wordmark + close */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-sand/60 shrink-0">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <span className="text-2xl" aria-hidden>
              &#x1F33F;
            </span>
            <span className="font-semibold text-earth text-lg tracking-tight">
              Local Budget Travel
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="text-earth-muted hover:text-terracotta transition-colors p-1"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-1">
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`text-base font-medium px-2 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-terracotta/10 text-terracotta"
                    : "text-earth hover:bg-sand/40"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="mt-4 pt-4 border-t border-sand/60 flex flex-col gap-1">
            {!loading &&
              (user ? (
                <>
                  {profile?.username && (
                    <Link
                      href={`/profile/${profile.username}`}
                      onClick={onClose}
                      className="flex items-center gap-3 px-2 py-3 rounded-lg text-earth hover:bg-sand/40 transition-colors"
                    >
                      <span className="relative w-7 h-7 rounded-full bg-sand/60 overflow-hidden shrink-0 flex items-center justify-center">
                        {profile.avatar_url ? (
                          <Image
                            src={profile.avatar_url}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="28px"
                          />
                        ) : (
                          <span aria-hidden className="text-sm">
                            &#x1F464;
                          </span>
                        )}
                      </span>
                      <span className="font-medium">{profile.username}</span>
                    </Link>
                  )}
                  <Link
                    href="/activity/submit"
                    onClick={onClose}
                    className="px-2 py-3 rounded-lg text-earth hover:bg-sand/40 transition-colors font-medium"
                  >
                    Submit Activity
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="text-left px-2 py-3 rounded-lg text-earth-muted hover:bg-sand/40 hover:text-terracotta transition-colors font-medium"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signup"
                    onClick={onClose}
                    className="bg-terracotta text-white text-center font-medium px-4 py-3 rounded-full hover:bg-terracotta-dark transition-colors mt-2"
                  >
                    Sign up
                  </Link>
                  <Link
                    href="/auth/login"
                    onClick={onClose}
                    className="text-center px-2 py-3 text-earth-muted hover:text-terracotta transition-colors font-medium"
                  >
                    Log in
                  </Link>
                </>
              ))}
          </div>
        </div>

        {/* Footer tagline */}
        <div className="px-6 py-5 border-t border-sand/60 shrink-0">
          <p className="text-earth-muted text-xs text-center">
            Local Budget Travel &mdash; explore more, spend less.
          </p>
        </div>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}