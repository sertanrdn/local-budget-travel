export default function Loading() {
    return (
      <div className="min-h-screen bg-warm-white font-sans flex flex-col">
        <header className="px-6 py-5 border-b border-sand/60">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="h-7 w-48 bg-sand/60 rounded-full animate-pulse" />
            <div className="h-5 w-24 bg-sand/40 rounded-full animate-pulse" />
          </div>
        </header>
  
        <section className="px-6 pt-8 pb-6 max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-4 w-10 bg-sand/40 rounded animate-pulse" />
            <div className="h-4 w-2 bg-sand/30 rounded animate-pulse" />
            <div className="h-4 w-16 bg-sand/40 rounded animate-pulse" />
            <div className="h-4 w-2 bg-sand/30 rounded animate-pulse" />
            <div className="h-4 w-10 bg-sand/50 rounded animate-pulse" />
          </div>
          <div className="h-8 w-56 bg-sand/60 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-32 bg-sand/40 rounded animate-pulse" />
        </section>
  
        <main className="px-6 pb-16 max-w-4xl mx-auto w-full flex-1">
          <div className="bg-white border border-sand/80 rounded-2xl overflow-hidden h-[70vh] min-h-105 animate-pulse" />
        </main>
      </div>
    )
}