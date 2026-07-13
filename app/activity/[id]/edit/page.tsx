"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/useUser";
import { Activity } from "@/lib/types";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ActivityForm } from "@/components/activity/ActivityForm";

async function getActivity(id: string): Promise<Activity | null> {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return data;
}

export default function EditActivityPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { profile } = useUser();

  const [authedUser, setAuthedUser] = useState<User | null | undefined>(
    undefined
  );
  const [activity, setActivity] = useState<Activity | null | undefined>(
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
    void getActivity(params.id).then(setActivity);
  }, [params.id]);

  useEffect(() => {
    if (authedUser === null) {
      router.push("/auth/login");
    }
  }, [authedUser, router]);

  const loading = authedUser === undefined || activity === undefined;

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-white text-earth font-sans flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center text-earth-muted text-sm">
          Loading...
        </main>
        <Footer />
      </div>
    );
  }

  if (authedUser === null) return null;

  if (!activity) {
    return (
      <div className="min-h-screen bg-warm-white text-earth font-sans flex flex-col items-center justify-center text-center px-6">
        <div className="text-6xl mb-4" aria-hidden>
          📍
        </div>
        <h1 className="text-2xl font-bold text-earth mb-2">
          Activity not found
        </h1>
        <p className="text-earth-muted mb-8">
          This spot might have moved or been removed.
        </p>
        <Link
          href="/cities"
          className="bg-terracotta text-white px-6 py-3 rounded-full font-medium hover:bg-terracotta-dark transition-colors"
        >
          Browse all cities
        </Link>
      </div>
    );
  }

  if (activity.submitted_by !== authedUser.id) {
    return (
      <div className="min-h-screen bg-warm-white text-earth font-sans flex flex-col items-center justify-center text-center px-6">
        <div className="text-6xl mb-4" aria-hidden>
          🔒
        </div>
        <h1 className="text-2xl font-bold text-earth mb-2">
          You can&apos;t edit this
        </h1>
        <p className="text-earth-muted mb-8">
          Only the person who submitted this activity can edit it.
        </p>
        <Link
          href={`/activity/${activity.id}`}
          className="bg-terracotta text-white px-6 py-3 rounded-full font-medium hover:bg-terracotta-dark transition-colors"
        >
          Back to activity
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white text-earth font-sans flex flex-col">
      <Header />
      <main className="flex-1 px-6 py-16 max-w-md mx-auto w-full">
        <p className="text-terracotta font-semibold text-xs tracking-widest uppercase mb-4">
          Edit
        </p>
        <h1 className="text-3xl font-bold text-earth leading-tight mb-2">
          Edit activity
        </h1>
        <p className="text-earth-muted text-sm mb-8">
          Update the details below.
        </p>
        <ActivityForm
          mode="edit"
          user={authedUser}
          citiesLived={profile?.cities_lived ?? []}
          existingActivity={activity}
        />
      </main>
      <Footer />
    </div>
  );
}