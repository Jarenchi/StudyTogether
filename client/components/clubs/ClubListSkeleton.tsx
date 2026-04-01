import { Skeleton } from "@/components/ui/skeleton";

const ClubCardSkeleton = () => (
  <div className="rounded-xl border border-border bg-card overflow-hidden">
    <Skeleton className="aspect-video w-full" />
    <div className="pt-7 px-4 pb-4">
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-2/3 mb-3" />
      <div className="flex gap-1 mb-4">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-8 w-16 rounded-md" />
      </div>
    </div>
  </div>
);

const ClubListSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
    {Array.from({ length: 8 }).map((_, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <ClubCardSkeleton key={i} />
    ))}
  </div>
);

export default ClubListSkeleton;
