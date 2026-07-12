"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/useUser";
import { geocodeLocation } from "@/lib/geocode";
import { uploadActivityPhoto } from "@/lib/uploadActivityPhoto";
import type { City, Category } from "@/lib/types";
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

async function getCategoriesForCity(cityId: string): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("city_id", cityId)
    .order("name");

  if (error) {
    console.error("Failed to fetch categories:", error.message);
    return [];
  }
  return data ?? [];
}

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
        <SubmitActivityForm
          user={authedUser}
          citiesLived={profile?.cities_lived ?? []}
        />
      </main>
      <Footer />
    </div>
  );
}

function SubmitActivityForm({
  user,
  citiesLived,
}: {
  user: User;
  citiesLived: string[];
}) {
  const router = useRouter();

  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [cityId, setCityId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isFree, setIsFree] = useState(true);
  const [estimatedCost, setEstimatedCost] = useState("");
  const [localTip, setLocalTip] = useState("");
  const [originStory, setOriginStory] = useState("");

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [geocoding, setGeocoding] = useState(false);
  const [geocodeMessage, setGeocodeMessage] = useState<string | null>(null);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getAllCities().then(setCities);
  }, []);

  // Reset the chosen category whenever the city changes — same
  // render-time pattern Header.tsx uses for prevPathname.
  const [prevCityId, setPrevCityId] = useState(cityId);
  if (cityId !== prevCityId) {
    setPrevCityId(cityId);
    setCategoryId("");
    setCategories([]);
  }

  useEffect(() => {
    if (!cityId) return;
    void getCategoriesForCity(cityId).then(setCategories);
  }, [cityId]);

  const selectedCity = cities.find((c) => c.id === cityId);
  const isLocalToCity = Boolean(
    selectedCity && citiesLived.includes(selectedCity.id)
  );

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function handleRemovePhoto() {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleFindOnMap() {
    if (!address.trim()) {
      setGeocodeError("Enter an address or place name first.");
      return;
    }
    setGeocoding(true);
    setGeocodeError(null);
    setGeocodeMessage(null);

    const query = selectedCity ? `${address}, ${selectedCity.name}` : address;
    const result = await geocodeLocation(query);

    setGeocoding(false);

    if (!result) {
      setGeocodeError(
        "Couldn't find that location — try a more specific address, or enter coordinates manually."
      );
      return;
    }

    setLatitude(result.latitude.toFixed(6));
    setLongitude(result.longitude.toFixed(6));
    setGeocodeMessage(`Found: ${result.displayName}`);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!cityId || !categoryId) {
      setError("Please choose a city and category.");
      return;
    }
    if (!title.trim() || !localTip.trim()) {
      setError("Title and local tip are required.");
      return;
    }
    const lat = latitude ? parseFloat(latitude) : null;
    const lng = longitude ? parseFloat(longitude) : null;
    if (latitude && Number.isNaN(lat)) {
      setError("Latitude must be a number.");
      return;
    }
    if (longitude && Number.isNaN(lng)) {
      setError("Longitude must be a number.");
      return;
    }

    setSaving(true);
    try {
      let photoUrl: string | null = null;
      if (photoFile) {
        photoUrl = await uploadActivityPhoto(user.id, photoFile);
      }

      const { data, error: insertError } = await supabase
        .from("activities")
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          category_id: categoryId,
          city_id: cityId,
          address: address.trim() || null,
          latitude: lat,
          longitude: lng,
          photo_url: photoUrl,
          is_free: isFree,
          estimated_cost: isFree ? "Free" : estimatedCost.trim() || null,
          local_tip: localTip.trim(),
          origin_story: originStory.trim() || null,
          submitted_by: user.id,
        })
        .select("id")
        .single();

      if (insertError) throw new Error(insertError.message);

      router.push(`/activity/${data.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* City */}
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-earth">City</span>
        <select
          value={cityId}
          onChange={(e) => setCityId(e.target.value)}
          required
          className={inputClass}
        >
          <option value="">Choose a city…</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}, {city.country}
            </option>
          ))}
        </select>
        {selectedCity && (
          <span
            className={`text-xs font-medium ${
              isLocalToCity ? "text-olive" : "text-earth-muted"
            }`}
          >
            {isLocalToCity
              ? `✓ You've lived in ${selectedCity.name} — this will show as a local submission.`
              : `You haven't marked ${selectedCity.name} as a city you've lived in. Add it in your profile if you have.`}
          </span>
        )}
      </label>

      {/* Category */}
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-earth">Category</span>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          disabled={!cityId}
          className={`${inputClass} disabled:opacity-50`}
        >
          <option value="">
            {cityId ? "Choose a category…" : "Choose a city first"}
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
      </label>

      {/* Title */}
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-earth">Title</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="e.g. Westerpark"
          className={inputClass}
        />
      </label>

      {/* Description */}
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-earth">Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="What is this place, in a couple of sentences?"
          className={inputClass}
        />
      </label>

      {/* Address + geocode */}
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-earth">Address</span>
        <div className="flex gap-2">
          <input
            type="text"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setGeocodeMessage(null);
              setGeocodeError(null);
            }}
            placeholder="Street, neighbourhood, or landmark name"
            className={inputClass}
          />
          <button
            type="button"
            onClick={handleFindOnMap}
            disabled={geocoding}
            className="shrink-0 bg-sand/50 hover:bg-sand/70 text-earth text-sm font-medium px-4 rounded-xl transition-colors disabled:opacity-50"
          >
            {geocoding ? "Finding…" : "Find on map"}
          </button>
        </div>
        {geocodeMessage && (
          <span className="text-xs text-olive">{geocodeMessage}</span>
        )}
        {geocodeError && (
          <span className="text-xs text-terracotta">{geocodeError}</span>
        )}
      </div>

      {/* Lat/lng — filled by geocode, editable manually */}
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-earth">Latitude</span>
          <input
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="41.0136"
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-earth">Longitude</span>
          <input
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="28.9550"
            className={inputClass}
          />
        </label>
      </div>

      {/* Photo */}
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-earth">Photo</span>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-xl bg-sand/50 overflow-hidden shrink-0 flex items-center justify-center text-2xl">
            {photoPreview ? (
              <Image
                src={photoPreview}
                alt="Preview"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <span aria-hidden>📍</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              className="hidden"
              aria-label="Upload activity photo"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-medium text-earth bg-sand/50 hover:bg-sand/70 px-3 py-2 rounded-full transition-colors"
            >
              {photoFile ? "Change photo" : "Choose photo"}
            </button>
            {photoPreview && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="text-xs font-medium text-terracotta hover:text-terracotta-dark transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Free / cost */}
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-earth">Cost</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsFree(true)}
            className={`text-sm font-medium px-4 py-2 rounded-full border transition-colors ${
              isFree
                ? "bg-olive text-white border-olive"
                : "bg-white text-earth-muted border-sand hover:border-olive/40"
            }`}
          >
            Free
          </button>
          <button
            type="button"
            onClick={() => setIsFree(false)}
            className={`text-sm font-medium px-4 py-2 rounded-full border transition-colors ${
              !isFree
                ? "bg-terracotta text-white border-terracotta"
                : "bg-white text-earth-muted border-sand hover:border-terracotta/40"
            }`}
          >
            Costs something
          </button>
        </div>
        {!isFree && (
          <input
            type="text"
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(e.target.value)}
            placeholder="e.g. ~€4"
            className={`${inputClass} mt-2`}
          />
        )}
      </div>

      {/* Local tip — the hero field */}
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-earth">
          Local tip <span className="text-terracotta">*</span>
        </span>
        <textarea
          value={localTip}
          onChange={(e) => setLocalTip(e.target.value)}
          rows={3}
          required
          placeholder="The thing only a local would know — best time to go, what to order, how to get there cheaply…"
          className={inputClass}
        />
      </label>

      {/* Origin story */}
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-earth">
          Your story (optional)
        </span>
        <textarea
          value={originStory}
          onChange={(e) => setOriginStory(e.target.value)}
          rows={3}
          placeholder="I found this while…"
          className={inputClass}
        />
      </label>

      {error && (
        <p className="text-terracotta text-sm bg-terracotta/10 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-terracotta text-white px-6 py-3 rounded-full font-medium hover:bg-terracotta-dark transition-colors disabled:opacity-50"
        >
          {saving ? "Submitting…" : "Submit activity"}
        </button>
        <Link
          href="/cities"
          className="text-sm font-medium text-earth-muted hover:text-terracotta transition-colors px-4 py-3"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
