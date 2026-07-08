export default function Loading() {
    return (
      <div className="min-h-screen bg-warm-white font-sans flex flex-col">
        <header className="px-6 py-5 border-b border-sand/60">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="h-7 w-48 bg-sand/60 rounded-full animate-pulse" />
            <div className="h-5 w-24 bg-sand/40 rounded-full animate-pulse" />
          </div>
        </header>
  
        <section className="px-6 pt-12 pb-10 max-w-4xl mx-auto w-full">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-full bg-sand/50 animate-pulse shrink-0" />
            <div className="space-y-3 flex-1">
              <div className="h-7 w-40 bg-sand/60 rounded-lg animate-pulse" />
              <div className="h-4 w-64 bg-sand/40 rounded animate-pulse" />
              <div className="flex gap-2 mt-2">
                <div className="h-7 w-28 bg-sand/40 rounded-full animate-pulse" />
                <div className="h-7 w-28 bg-sand/40 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </section>
  
        <main className="px-6 pb-20 max-w-4xl mx-auto w-full flex-1">
          <div className="h-4 w-40 bg-sand/40 rounded animate-pulse mb-6" />
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-sand/60 overflow-hidden flex flex-col sm:flex-row"
              >
                <div className="sm:w-48 sm:shrink-0 h-48 sm:h-auto bg-sand/50 animate-pulse" />
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="h-6 w-48 bg-sand/60 rounded animate-pulse" />
                    <div className="h-6 w-16 bg-sand/40 rounded-full animate-pulse shrink-0" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-sand/40 rounded animate-pulse" />
                    <div className="h-4 w-5/6 bg-sand/30 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    )
}