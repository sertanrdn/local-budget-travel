'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-sand bg-white text-earth placeholder:text-earth-muted/50 focus:outline-none focus:border-terracotta text-sm transition-colors'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (error) {
      setError(
        error.message === 'Invalid login credentials'
          ? 'Incorrect email or password.'
          : error.message
      )
      return
    }

    router.push('/cities')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-warm-white text-earth font-sans flex flex-col">
      <Header />

      <main className="flex-1 px-6 py-16 max-w-md mx-auto w-full">
        <p className="text-terracotta font-semibold text-xs tracking-widest uppercase mb-4">
          Welcome back
        </p>
        <h1 className="text-3xl font-bold text-earth leading-tight mb-8">Log in</h1>

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

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-earth">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="text-earth-muted text-sm mt-8 text-center">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-terracotta font-medium hover:text-terracotta-dark">
            Sign up
          </Link>
        </p>
      </main>

      <Footer />
    </div>
  )
}