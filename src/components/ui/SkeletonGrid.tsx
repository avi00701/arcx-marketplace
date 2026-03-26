"use client";

interface SkeletonCardProps {
  type: "nft" | "creator" | "collection";
}

export function SkeletonCard({ type }: SkeletonCardProps) {
  if (type === "creator") {
    return (
      <div className="flex items-center gap-5 p-5 rounded-[32px] bg-white/5 border border-white/5 overflow-hidden">
        <div className="w-20 h-20 rounded-2xl skeleton" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-3/4 rounded-full skeleton" />
          <div className="h-3 w-1/2 rounded-full skeleton" />
        </div>
      </div>
    );
  }

  if (type === "collection") {
    return (
      <div className="rounded-[40px] bg-white/5 border border-white/5 overflow-hidden">
        <div className="aspect-[16/9] skeleton" />
        <div className="p-8 space-y-6">
          <div className="h-6 w-2/3 rounded-full skeleton" />
          <div className="h-12 w-full rounded-2xl skeleton" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[40px] bg-white/5 border border-white/5 overflow-hidden">
      <div className="aspect-[4/5] skeleton" />
      <div className="p-8 space-y-6">
        <div className="h-6 w-3/4 rounded-full skeleton" />
        <div className="h-20 w-full rounded-[32px] skeleton" />
      </div>
    </div>
  );
}

interface SkeletonGridProps {
  count?: number;
  type: "nft" | "creator" | "collection";
  gridClass?: string;
}

export default function SkeletonGrid({ count = 6, type, gridClass }: SkeletonGridProps) {
  const defaultGrids = {
    nft: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8",
    creator: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
    collection: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
  };

  return (
    <div className={gridClass || defaultGrids[type]}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} type={type} />
      ))}
    </div>
  );
}
