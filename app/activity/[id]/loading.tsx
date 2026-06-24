export default function Loading() {
    return (
      <div className="min-h-screen bg-warm-white font-sans">
        <header className="px-6 py-5 border-b border-sand/60">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="h-7 w-48 bg-sand/60 rounded-full animate-pulse" />
            <div className="h-5 w-28 bg-sand/40 rounded-full animate-pulse" />
          </div>
        </header>
  
        <main className="max-w-4xl mx-auto px-6 py-10 pb-24">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-4 w-10 bg-sand/40 rounded animate-pulse" />
            <div className="h-4 w-2 bg-sand/30 rounded animate-pulse" />
            <div className="h-4 w-14 bg-sand/40 rounded animate-pulse" />
            <div className="h-4 w-2 bg-sand/30 rounded animate-pulse" />
            <div className="h-4 w-16 bg-sand/40 rounded animate-pulse" />
            <div className="h-4 w-2 bg-sand/30 rounded animate-pulse" />
            <div className="h-4 w-32 bg-sand/40 rounded animate-pulse" />
          </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 flex flex-col gap-6">
              <div>
                <div className="flex gap-2 mb-3">
                  <div className="h-5 w-24 bg-sand/40 rounded animate-pulse" />
                  <div className="h-5 w-16 bg-sand/50 rounded-full animate-pulse" />
                </div>
                <div className="h-9 w-3/4 bg-sand/60 rounded-lg animate-pulse mb-2" />
                <div className="h-4 w-48 bg-sand/40 rounded animate-pulse" />
              </div>
              <div className="w-full h-64 sm:h-80 rounded-2xl bg-sand/50 animate-pulse" />
              <div>
                <div className="h-4 w-16 bg-sand/40 rounded animate-pulse mb-3" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-sand/40 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-sand/30 rounded animate-pulse" />
                  <div className="h-4 w-4/5 bg-sand/30 rounded animate-pulse" />
                </div>
              </div>
              <div className="bg-sand/20 rounded-2xl px-5 py-4 space-y-2">
                <div className="h-4 w-20 bg-sand/50 rounded animate-pulse" />
                <div className="h-4 w-full bg-sand/40 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-sand/30 rounded animate-pulse" />
              </div>
            </div>
  
            <div className="lg:col-span-2 flex flex-col gap-5">
              <div className="bg-white border border-sand/80 rounded-2xl p-5 space-y-3">
                <div className="h-4 w-24 bg-sand/40 rounded animate-pulse mb-1" />
                <div className="flex justify-between">
                  <div className="h-4 w-12 bg-sand/30 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-sand/50 rounded animate-pulse" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-12 bg-sand/30 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-sand/50 rounded animate-pulse" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-12 bg-sand/30 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-sand/50 rounded animate-pulse" />
                </div>
              </div>
              <div className="bg-white border border-sand/80 rounded-2xl overflow-hidden">
                <div className="h-56 bg-sand/40 animate-pulse" />
                <div className="h-10 border-t border-sand/60" />
              </div>
            </div>
          </div>
        </main>
      </div>
    )
}