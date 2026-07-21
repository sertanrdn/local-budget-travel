"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PasswordInput } from "@/components/ui/PasswordInput";

export default function ResetPasswordPage() {
  const router = useRouter();

  // undefined = still checking whether this is a valid recovery link,
  // true = confirmed recovery session, false = no valid recovery
  // session found (expired/invalid link, or user just navigated here
  // directly without going through the email flow).
  const [recoveryReady, setRecoveryReady] = useState<boolean | undefined>(
    undefined
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (cancelled) return;
      if (event === "PASSWORD_RECOVERY") {
        setRecoveryReady(true);
      }
    });

    // If the PASSWORD_RECOVERY event doesn't fire within a few seconds,
    // treat the link as invalid/expired rather than leaving
    // the user staring at a permanent loading state.
    const timeoutId = setTimeout(() => {
      if (!cancelled) {
        setRecoveryReady((current) => current ?? false);
      }
    }, 4000);

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/cities");
      router.refresh();
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-warm-white text-earth font-sans flex flex-col">
      <Header />

      <main className="flex-1 px-6 py-16 max-w-md mx-auto w-full">
        <p className="text-terracotta font-semibold text-xs tracking-widest uppercase mb-4">
          Reset password
        </p>
        <h1 className="text-3xl font-bold text-earth leading-tight mb-8">
          Choose a new password
        </h1>

        {recoveryReady === undefined && (
          <p className="text-earth-muted text-sm">Verifying your link…</p>
        )}

        {recoveryReady === false && (
          <div className="flex flex-col gap-4">
            <p className="text-terracotta text-sm bg-terracotta/10 rounded-xl px-4 py-3">
              This reset link is invalid or has expired.
            </p>
            <Link
              href="/auth/forgot-password"
              className="bg-terracotta text-white px-6 py-3 rounded-full font-medium hover:bg-terracotta-dark transition-colors text-center"
            >
              Request a new link
            </Link>
          </div>
        )}

        {recoveryReady === true &&
          (success ? (
            <p className="text-olive text-sm bg-olive/10 rounded-xl px-4 py-3">
              Password updated. Taking you to the app…
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-earth">
                  New password
                </span>
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-earth">
                  Confirm new password
                </span>
                <PasswordInput
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </label>

              {error && (
                <p className="text-terracotta text-sm bg-terracotta/10 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="bg-terracotta text-white px-6 py-3 rounded-full font-medium hover:bg-terracotta-dark transition-colors disabled:opacity-50 mt-2"
              >
                {saving ? "Saving…" : "Update password"}
              </button>
            </form>
          ))}
      </main>

      <Footer />
    </div>
  );
}