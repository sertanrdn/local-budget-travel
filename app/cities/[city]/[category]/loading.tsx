export default function Loading() {
    return (
      <div className="min-h-screen bg-warm-white font-sans">
        {/* Header */}
        <header className="px-6 py-5 border-b border-sand/60">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="h-7 w-48 bg-sand/60 rounded-full animate-pulse" />
            <div className="h-5 w-24 bg-sand/40 rounded-full animate-pulse" />
          </div>
        </header>
  
        {/* Hero skeleton */}
        <section className="px-6 pt-10 pb-8 max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <div className="h-4 w-10 bg-sand/40 rounded animate-pulse" />
            <div className="h-4 w-2 bg-sand/30 rounded animate-pulse" />
            <div className="h-4 w-16 bg-sand/40 rounded animate-pulse" />
            <div className="h-4 w-2 bg-sand/30 rounded animate-pulse" />
            <div className="h-4 w-24 bg-sand/50 rounded animate-pulse" />
          </div>
  
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-sand/50 rounded-xl animate-pulse shrink-0" />
            <div className="space-y-2">
              <div className="h-8 w-40 bg-sand/60 rounded-lg animate-pulse" />
              <div className="h-5 w-48 bg-sand/40 rounded animate-pulse" />
            </div>
          </div>
        </section>
  
        {/* Activity cards skeleton */}
        <main className="px-6 pb-20 max-w-4xl mx-auto">
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-sand/60 overflow-hidden flex flex-col sm:flex-row"
              >
                {/* Photo */}
                <div className="sm:w-48 sm:shrink-0 h-48 sm:h-auto bg-sand/50 animate-pulse" />
  
                {/* Content */}
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="h-6 w-48 bg-sand/60 rounded animate-pulse" />
                    <div className="h-6 w-16 bg-sand/40 rounded-full animate-pulse shrink-0" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-sand/40 rounded animate-pulse" />
                    <div className="h-4 w-5/6 bg-sand/30 rounded animate-pulse" />
                  </div>
                  {/* Local tip */}
                  <div className="mt-1 bg-sand/20 rounded-xl p-3 space-y-2">
                    <div className="h-4 w-20 bg-sand/50 rounded animate-pulse" />
                    <div className="h-4 w-full bg-sand/40 rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-sand/30 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    )
}