"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-sand bg-white text-earth placeholder:text-earth-muted/50 focus:outline-none focus:border-terracotta text-sm transition-colors";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
  }

  return (
    <div className="min-h-screen bg-warm-white text-earth font-sans flex flex-col">
      <Header />

      <main className="flex-1 px-6 py-16 max-w-md mx-auto w-full">
        <p className="text-terracotta font-semibold text-xs tracking-widest uppercase mb-4">
          Reset password
        </p>
        <h1 className="text-3xl font-bold text-earth leading-tight mb-2">
          Forgot your password?
        </h1>
        <p className="text-earth-muted text-sm mb-8">
          Enter the email you signed up with and we&apos;ll send you a link to
          reset it.
        </p>

        {sent ? (
          <div className="bg-olive/10 border border-olive/20 rounded-2xl px-5 py-4 text-sm text-earth">
            If an account exists for{" "}
            <span className="font-semibold">{email}</span>, a password reset
            link is on its way. Check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-earth">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className={inputClass}
              />
            </label>

            {error && (
              <p className="text-terracotta text-sm bg-terracotta/10 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-terracotta text-white px-6 py-3 rounded-full font-medium hover:bg-terracotta-dark transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}

        <p className="text-earth-muted text-sm mt-8 text-center">
          <Link
            href="/auth/login"
            className="text-terracotta font-medium hover:text-terracotta-dark"
          >
            &larr; Back to log in
          </Link>
        </p>
      </main>

      <Footer />
    </div>
  );
}