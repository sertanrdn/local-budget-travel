"use client";

import { useEffect, useState, useRef, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/useUser";
import { uploadAvatar } from "@/lib/uploadAvatar";
import type { City } from "@/lib/types";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-sand bg-white text-earth placeholder:text-earth-muted/50 focus:outline-none focus:border-terracotta text-sm transition-colors";

async function getAllCities(): Promise<City[]> {
  const { data, error } = await supabase
    .from("cities")
    .select("*")
    .order("name");
  if (error) {
    console.error("Failed to fetch cities:", error.message);
    return [];
  }
  return data ?? [];
}

export default function CompleteProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isWelcome = searchParams.get('welcome') === '1'
  const { profile } = useUser();

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

  const profileReady =
    profile !== null && authedUser != null && profile.id === authedUser.id;

  if (authedUser === undefined || authedUser === null || !profileReady) {
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

  // Already complete somehow (e.g. direct nav) — nothing to do here,
  // Header's gate will bounce them onward anyway.
  return (
    <div className="min-h-screen bg-warm-white text-earth font-sans flex flex-col">
      <Header />
      <main className="flex-1 px-6 py-16 max-w-md mx-auto w-full">
        <p className="text-terracotta font-semibold text-xs tracking-widest uppercase mb-4">
          One last step
        </p>
        <h1 className="text-3xl font-bold text-earth leading-tight mb-2">
          {isWelcome ? "Welcome! One quick thing…" : "Complete your profile"}
        </h1>
        <p className="text-earth-muted text-sm mb-8">
          {isWelcome
            ? "You're all set to browse right away. If you ever want to submit a spot, you'll just need a short bio and at least one city you've lived in — might as well do it now."
            : "Tell us a bit about yourself and where you've lived — this is what makes your tips trustworthy to other travelers."}
        </p>
        <CompleteProfileForm
          key={profile.id}
          user={authedUser}
          profile={profile}
        />
        {isWelcome && (
          <p className="text-center mt-6">
            <Link
              href="/cities"
              className="text-sm text-earth-muted hover:text-terracotta transition-colors"
            >
              Skip for now — take me to the cities
            </Link>
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}

function CompleteProfileForm({
  user,
  profile,
}: {
  user: User;
  profile: NonNullable<ReturnType<typeof useUser>["profile"]>;
}) {
  const router = useRouter();

  const [cities, setCities] = useState<City[]>([]);
  const [bio, setBio] = useState(profile.bio ?? "");
  const [citiesLived, setCitiesLived] = useState<string[]>(
    profile.cities_lived ?? []
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getAllCities().then(setCities);
  }, []);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  function toggleCity(cityId: string) {
    setCitiesLived((prev) =>
      prev.includes(cityId)
        ? prev.filter((id) => id !== cityId)
        : [...prev, cityId]
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!bio.trim()) {
      setError("Please add a short bio.");
      return;
    }
    if (citiesLived.length === 0) {
      setError("Please select at least one city you've lived in.");
      return;
    }

    setSaving(true);
    try {
      let avatarUrl = profile.avatar_url ?? null;
      if (avatarFile) {
        avatarUrl = await uploadAvatar(user.id, avatarFile);
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          bio: bio.trim(),
          cities_lived: citiesLived,
          avatar_url: avatarUrl,
        })
        .eq("id", user.id);

      if (updateError) throw new Error(updateError.message);

      window.dispatchEvent(
        new CustomEvent("profile:updated", {
          detail: {
            ...profile,
            bio: bio.trim(),
            cities_lived: citiesLived,
            avatar_url: avatarUrl,
          },
        })
      );

      router.push("/cities");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Avatar — optional */}
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full bg-sand/50 overflow-hidden shrink-0 flex items-center justify-center text-2xl">
          {avatarPreview ? (
            <Image
              src={avatarPreview}
              alt="Avatar preview"
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <span aria-hidden>&#x1F464;</span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-earth">
            Avatar{" "}
            <span className="text-earth-muted/60 font-normal">(optional)</span>
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleAvatarChange}
            className="hidden"
            aria-label="Upload avatar image"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-medium text-earth bg-sand/50 hover:bg-sand/70 px-3 py-2 rounded-full transition-colors w-fit"
          >
            {avatarFile ? "Change photo" : "Choose photo"}
          </button>
        </div>
      </div>

      {/* Bio — required */}
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-earth">
          Bio <span className="text-terracotta">*</span>
        </span>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          required
          placeholder="Tell people a bit about yourself…"
          className={inputClass}
        />
      </label>

      {/* Cities lived — required, at least one */}
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-earth">
          Cities you&apos;ve lived in (1+ year){" "}
          <span className="text-terracotta">*</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {cities.map((city) => {
            const selected = citiesLived.includes(city.id);
            return (
              <button
                key={city.id}
                type="button"
                onClick={() => toggleCity(city.id)}
                className={`text-sm font-medium px-3.5 py-2 rounded-full border transition-colors ${
                  selected
                    ? "bg-terracotta text-white border-terracotta"
                    : "bg-white text-earth-muted border-sand hover:border-terracotta/40"
                }`}
              >
                {city.name}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <p className="text-terracotta text-sm bg-terracotta/10 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="bg-terracotta text-white px-6 py-3 rounded-full font-medium hover:bg-terracotta-dark transition-colors disabled:opacity-50"
      >
        {saving ? "Saving…" : "Complete profile"}
      </button>
    </form>
  );
}