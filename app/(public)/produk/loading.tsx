export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
      <div className="h-8 w-48 animate-pulse bg-surface" />
      <div className="mt-8 grid gap-4 md:grid-cols-[220px_1fr]">
        <div className="hidden h-64 animate-pulse bg-surface md:block" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col border border-border bg-surface">
              <div className="aspect-[4/3] w-full animate-pulse bg-surface-sunken" />
              <div className="flex flex-col gap-2 p-4">
                <div className="h-3 w-16 animate-pulse bg-surface-sunken" />
                <div className="h-4 w-3/4 animate-pulse bg-surface-sunken" />
                <div className="h-4 w-1/3 animate-pulse bg-surface-sunken" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
