'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/useUser";
import { ActivityForm } from "@/components/activity/ActivityForm";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function SubmitActivityPage() {
  const router = useRouter();
  const { profile } = useUser();

  // Same auth-gating pattern as /profile/edit: undefined = not checked
  // yet, null = confirmed signed out, User = confirmed signed in.
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

  if (authedUser === undefined || authedUser === null) {
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
        <ActivityForm mode="create" user={authedUser} citiesLived={profile?.cities_lived ?? []} />
      </main>
      <Footer />
    </div>
  );
}