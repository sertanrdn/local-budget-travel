'use client'

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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user || user.id !== activity.submitted_by) return null;

  async function handleConfirmDelete() {
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
    <>
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
          onClick={() => setConfirmOpen(true)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-earth-muted hover:text-terracotta transition-colors"
        >
          <span aria-hidden>&#x1F5D1;&#xFE0F;</span>
          Delete
        </button>
      </div>
      {confirmOpen && (
        <div
          className="fixed inset-0 bg-earth/40 backdrop-blur-sm flex items-center justify-center z-50 px-6"
          onClick={() => !deleting && setConfirmOpen(false)}
        >
          <div
            className="bg-white rounded-2xl border border-sand/80 shadow-lg max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-earth mb-2">
              Delete this activity?
            </h2>
            <p className="text-earth-muted text-sm leading-relaxed mb-6">
              <span className="font-medium text-earth">
                &ldquo;{activity.title}&rdquo;
              </span>{" "}
              will be permanently removed. This can&apos;t be undone.
            </p>

            {error && (
              <p className="text-terracotta text-sm bg-terracotta/10 rounded-xl px-4 py-3 mb-4">
                {error}
              </p>
            )}

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                disabled={deleting}
                className="text-sm font-medium text-earth-muted hover:text-terracotta transition-colors px-4 py-2.5 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="bg-terracotta text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-terracotta-dark transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete activity"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}