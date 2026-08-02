export default function GearDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="aspect-[4/3] skeleton-premium rounded-xl" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 skeleton-premium rounded" />
          <div className="h-4 w-1/3 skeleton-premium rounded" />
          <div className="h-4 w-1/4 skeleton-premium rounded" />
          <div className="h-28 skeleton-premium rounded" />
          <div className="h-40 skeleton-premium rounded-xl" />
        </div>
      </div>
    </div>
  );
}
