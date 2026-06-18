export default function Loading() {
    return (
      <div className="min-h-screen bg-warm-white font-sans">
        <header className="px-6 py-5 border-b border-sand/60">
          <div className="max-w-4xl mx-auto">
            <div className="h-7 w-48 bg-sand/60 rounded-full animate-pulse" />
          </div>
        </header>
        <div className="px-6 pt-12 pb-10 max-w-4xl mx-auto">
          <div className="h-4 w-20 bg-sand/40 rounded animate-pulse mb-3" />
          <div className="h-10 w-48 bg-sand/60 rounded-lg animate-pulse mb-4" />
          <div className="h-5 w-full max-w-lg bg-sand/40 rounded animate-pulse" />
        </div>
        <main className="px-6 pb-20 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-sand/60 rounded-2xl p-5">
                <div className="h-8 w-8 bg-sand/50 rounded animate-pulse mb-3" />
                <div className="h-5 w-24 bg-sand/50 rounded animate-pulse mb-2" />
                <div className="h-4 w-16 bg-sand/30 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </main>
      </div>
    )
}