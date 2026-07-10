export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
      <div className="h-8 w-48 animate-pulse bg-surface" />
      <div className="mt-8 aspect-[4/5] w-full animate-pulse bg-surface md:aspect-[16/7]" />
      <div className="mt-6 grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col border border-border bg-surface">
            <div className="aspect-[4/5] w-full animate-pulse bg-surface-sunken" />
            <div className="flex flex-col gap-2 p-4">
              <div className="h-3 w-16 animate-pulse bg-surface-sunken" />
              <div className="h-4 w-3/4 animate-pulse bg-surface-sunken" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
