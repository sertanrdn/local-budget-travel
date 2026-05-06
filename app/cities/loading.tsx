export default function Loading() {
  return (
    <div className="min-h-screen bg-warm-white font-sans">
      <header className="px-6 py-5 border-b border-sand/60">
        <div className="max-w-4xl mx-auto">
          <div className="h-7 w-48 bg-sand/60 rounded-full animate-pulse" />
        </div>
      </header>

      <main className="px-6 py-12 max-w-4xl mx-auto">
        <div className="mb-10">
          <div className="h-9 w-36 bg-sand/60 rounded-lg animate-pulse mb-3" />
          <div className="h-5 w-64 bg-sand/40 rounded-lg animate-pulse" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden border border-sand/60 bg-white"
            >
              <div className="h-40 bg-sand/50 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-sand/50 rounded-full animate-pulse w-3/4" />
                <div className="h-4 bg-sand/40 rounded-full animate-pulse w-1/2" />
                <div className="h-4 bg-sand/30 rounded-full animate-pulse w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
