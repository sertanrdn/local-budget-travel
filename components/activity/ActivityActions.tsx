"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/useUser";
import { deleteActivityPhotoByUrl } from "@/lib/uploadActivityPhoto";
import type { Activity } from "@/lib/types";

export function ActivityActions({ activity }: { activity: Activity }) {
  const { user } = useUser();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user || user.id !== activity.submitted_by) return null;

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${activity.title}"? This can't be undone.`
    );
    if (!confirmed) return;

    setDeleting(true);
    setError(null);

    const { error: deleteError } = await supabase
      .from("activities")
      .delete()
      .eq("id", activity.id);

    if (deleteError) {
      setError(deleteError.message);
      setDeleting(false);
      return;
    }

    // Clean up the storage file after the row is gone, so a failed
    // delete never leaves an activity pointing at a removed photo.
    if (activity.photo_url) {
      await deleteActivityPhotoByUrl(activity.photo_url);
    }

    router.push("/cities");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href={`/activity/${activity.id}/edit`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-earth-muted hover:text-terracotta transition-colors"
      >
        <span aria-hidden>&#x270F;&#xFE0F;</span>
        Edit
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-earth-muted hover:text-terracotta transition-colors disabled:opacity-50"
      >
        <span aria-hidden>&#x1F5D1;&#xFE0F;</span>
        {deleting ? "Deleting…" : "Delete"}
      </button>
      {error && <span className="text-xs text-terracotta">{error}</span>}
    </div>
  );
}