export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="aspect-square w-full animate-pulse bg-surface" />
        <div className="flex flex-col gap-5">
          <div className="h-4 w-24 animate-pulse bg-surface" />
          <div className="h-9 w-3/4 animate-pulse bg-surface" />
          <div className="h-8 w-40 animate-pulse bg-surface" />
          <div className="h-24 w-full animate-pulse bg-surface" />
          <div className="h-12 w-full animate-pulse bg-surface" />
        </div>
      </div>
    </div>
  );
}
