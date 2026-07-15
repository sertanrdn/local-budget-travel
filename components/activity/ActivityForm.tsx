"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { searchLocations, type GeocodeResult } from "@/lib/geocode";
import {
  uploadActivityPhoto,
  deleteActivityPhotoByUrl,
} from "@/lib/uploadActivityPhoto";
import type { City, Category, Activity } from "@/lib/types";
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

interface ActivityFormProps {
  mode: "create" | "edit";
  user: User;
  citiesLived: string[];
  existingActivity?: Activity;
}

export function ActivityForm({
  mode,
  user,
  citiesLived,
  existingActivity,
}: ActivityFormProps) {
  const router = useRouter();

  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [cityId, setCityId] = useState(existingActivity?.city_id ?? "");
  const [categoryId, setCategoryId] = useState(
    existingActivity?.category_id ?? ""
  );
  const [title, setTitle] = useState(existingActivity?.title ?? "");
  const [description, setDescription] = useState(
    existingActivity?.description ?? ""
  );
  const [address, setAddress] = useState(existingActivity?.address ?? "");
  const [latitude, setLatitude] = useState(
    existingActivity?.latitude != null ? String(existingActivity.latitude) : ""
  );
  const [longitude, setLongitude] = useState(
    existingActivity?.longitude != null
      ? String(existingActivity.longitude)
      : ""
  );
  const [isFree, setIsFree] = useState(existingActivity?.is_free ?? true);
  const [estimatedCost, setEstimatedCost] = useState(
    existingActivity?.estimated_cost ?? ""
  );
  const [localTip, setLocalTip] = useState(existingActivity?.local_tip ?? "");
  const [originStory, setOriginStory] = useState(
    existingActivity?.origin_story ?? ""
  );

  // The photo already saved on this activity (edit mode only) — kept
  // separate from photoFile/photoPreview so we know what to clean up
  // in storage if it gets replaced or removed.
  const [existingPhotoUrl] = useState(existingActivity?.photo_url ?? null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    existingActivity?.photo_url ?? null
  );
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [suggestions, setSuggestions] = useState<GeocodeResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchingAddress, setSearchingAddress] = useState(false);
  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const [showManualCoords, setShowManualCoords] = useState(
    // If this activity already has coordinates (typical in edit mode),
    // show the fields open by default so they're visible/editable.
    Boolean(existingActivity?.latitude && existingActivity?.longitude)
  );
  const addressWrapperRef = useRef<HTMLDivElement>(null);
  const skipNextSearchRef = useRef(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getAllCities().then(setCities);
  }, []);

  // Reset the chosen category whenever the city changes — same
  // render-time pattern Header.tsx uses for prevPathname. Does not
  // fire on initial mount in edit mode since prevCityId starts equal
  // to cityId.
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
    setPhotoRemoved(false);
  }

  function handleRemovePhoto() {
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoRemoved(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // Debounced live search as the user types — waits 400ms after the
  // last keystroke before hitting Nominatim.
  useEffect(() => {
    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return;
    }

    const trimmed = address.trim();
    if (trimmed.length < 3) return;

    const timeoutId = setTimeout(() => {
      setSearchingAddress(true);
      const query = selectedCity ? `${trimmed}, ${selectedCity.name}` : trimmed;
      void searchLocations(query).then((results) => {
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
        setSearchingAddress(false);
      });
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [address, selectedCity]);

  useEffect(() => {
    if (!showSuggestions) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        addressWrapperRef.current &&
        !addressWrapperRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSuggestions]);

  function handleSelectSuggestion(result: GeocodeResult) {
    // Only lat/lng come from the suggestion — the address field keeps
    // whatever the user typed.
    skipNextSearchRef.current = true;
    setLatitude(result.latitude.toFixed(6));
    setLongitude(result.longitude.toFixed(6));
    setLocationConfirmed(true);
    setShowSuggestions(false);
    setSuggestions([]);
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
      // Work out the final photo_url for this save, and whether the
      // old storage file (if any) needs cleaning up afterward.
      let photoUrl: string | null = existingPhotoUrl;
      let oldPhotoToDelete: string | null = null;

      if (photoFile) {
        photoUrl = await uploadActivityPhoto(user.id, photoFile);
        if (existingPhotoUrl) oldPhotoToDelete = existingPhotoUrl;
      } else if (photoRemoved) {
        photoUrl = null;
        if (existingPhotoUrl) oldPhotoToDelete = existingPhotoUrl;
      }

      const payload = {
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
        submitted_as_local: isLocalToCity,
      };

      let activityId: string;

      if (mode === "create") {
        const { data, error: insertError } = await supabase
          .from("activities")
          .insert({ ...payload, submitted_by: user.id })
          .select("id")
          .single();

        if (insertError) throw new Error(insertError.message);
        activityId = data.id;
      } else {
        if (!existingActivity) throw new Error("Missing activity to update.");

        const { error: updateError } = await supabase
          .from("activities")
          .update(payload)
          .eq("id", existingActivity.id);

        if (updateError) throw new Error(updateError.message);
        activityId = existingActivity.id;
      }

      // Only clean up the old photo after the DB write succeeds, so a
      // failed save never leaves an activity pointing at a deleted file.
      if (oldPhotoToDelete) {
        await deleteActivityPhotoByUrl(oldPhotoToDelete);
      }

      router.push(`/activity/${activityId}`);
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

      {/* Address — live autocomplete via Nominatim */}
      <div className="flex flex-col gap-1.5 relative" ref={addressWrapperRef}>
        <span className="text-sm font-medium text-earth">Address</span>
        <input
          type="text"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            setLocationConfirmed(false);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          placeholder="Start typing a place name or address…"
          autoComplete="off"
          className={inputClass}
        />

        {showSuggestions &&
          suggestions.length > 0 &&
          address.trim().length >= 3 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-sand shadow-lg overflow-hidden z-10">
              {suggestions.map((result, i) => (
                <button
                  key={`${result.latitude}-${result.longitude}-${i}`}
                  type="button"
                  onClick={() => handleSelectSuggestion(result)}
                  className="w-full text-left px-4 py-2.5 text-sm text-earth hover:bg-sand/40 transition-colors border-b border-sand/40 last:border-b-0"
                >
                  {result.displayName}
                </button>
              ))}
            </div>
          )}

        {searchingAddress && (
          <span className="text-xs text-earth-muted">Searching…</span>
        )}
        {!searchingAddress && locationConfirmed && (
          <span className="text-xs text-olive">✓ Location set</span>
        )}
        {!searchingAddress &&
          !locationConfirmed &&
          address.trim().length >= 3 &&
          suggestions.length === 0 && (
            <span className="text-xs text-earth-muted">
              No matches found — keep typing, or enter coordinates below.
            </span>
          )}

        <button
          type="button"
          onClick={() => setShowManualCoords((v) => !v)}
          className="text-xs text-earth-muted underline hover:text-terracotta transition-colors self-start mt-1"
        >
          {showManualCoords
            ? "Hide manual coordinates"
            : "Coordinates not quite right? Enter them manually"}
        </button>
      </div>

      {showManualCoords && (
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
      )}

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
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className="text-earth-muted/50"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
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
              {photoFile || photoPreview ? "Change photo" : "Choose photo"}
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
          {saving
            ? "Saving…"
            : mode === "create"
            ? "Submit activity"
            : "Save changes"}
        </button>
        <Link
          href={
            mode === "edit" && existingActivity
              ? `/activity/${existingActivity.id}`
              : "/cities"
          }
          className="text-sm font-medium text-earth-muted hover:text-terracotta transition-colors px-4 py-3"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
