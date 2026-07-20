"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/useUser";
import { ActivityForm } from "@/components/activity/ActivityForm";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { isProfileComplete } from "@/lib/profileComplete";
import Link from "next/link";

export default function SubmitActivityPage() {
  const router = useRouter();
  const { profile, loading: profileLoading } = useUser();

  const [authedUser, setAuthedUser] = useState<User | null | undefined>(
    undefined
  );

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      setAuthedUser(session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT") {
          setAuthedUser(null);
        } else if (event === "SIGNED_IN" && session?.user) {
          setAuthedUser(session.user);
        }
      }
    );

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (authedUser === null) {
      router.push("/auth/login");
    }
  }, [authedUser, router]);

  // Wait for BOTH auth to resolve AND the profile row to finish loading
  // before deciding whether to show the gate. Without profileLoading,
  // there's a brief window where authedUser is confirmed but profile is
  // still null (fetch in flight), which would incorrectly flash the
  // "complete your profile" gate for users who are actually complete.
  if (authedUser === undefined || authedUser === null || profileLoading) {
    return (
      <div className="min-h-screen bg-warm-white text-earth font-sans flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center text-earth-muted text-sm">
          Loading…
        </main>
        <Footer />
      </div>
    );
  }

  if (!isProfileComplete(profile)) {
    return (
      <div className="min-h-screen bg-warm-white text-earth font-sans flex flex-col">
        <Header />
        <main className="flex-1 px-6 py-16 max-w-md mx-auto w-full text-center">
          <div className="text-5xl mb-4" aria-hidden>
            ✍️
          </div>
          <h1 className="text-2xl font-bold text-earth mb-2">
            Complete your profile first
          </h1>
          <p className="text-earth-muted mb-8">
            To submit an activity, we need a short bio and at least one city
            you&apos;ve lived in — this is what makes your tips trustworthy.
          </p>
          <Link
            href="/profile/complete"
            className="bg-terracotta text-white px-6 py-3 rounded-full font-medium hover:bg-terracotta-dark transition-colors"
          >
            Complete your profile
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white text-earth font-sans flex flex-col">
      <Header />
      <main className="flex-1 px-6 py-16 max-w-md mx-auto w-full">
        <p className="text-terracotta font-semibold text-xs tracking-widest uppercase mb-4">
          Share a place
        </p>
        <h1 className="text-3xl font-bold text-earth leading-tight mb-2">
          Submit an activity
        </h1>
        <p className="text-earth-muted text-sm mb-8">
          The local tip is the whole point — tell people what only someone
          who&apos;s actually been there would know.
        </p>
        <ActivityForm
          mode="create"
          user={authedUser}
          citiesLived={profile?.cities_lived ?? []}
        />
      </main>
      <Footer />
    </div>
  );
}