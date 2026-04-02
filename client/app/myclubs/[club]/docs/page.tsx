"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { fetchDocs } from "@/utils/api";
import { DocsTable } from "@/components/docs/docsTable/DocsTable";
import { DocsColumns } from "@/components/docs/docsTable/columns";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorState from "@/components/ui/ErrorState";

const Page = () => {
  const params = useParams();
  const { data, isLoading, isError, refetch } = useQuery({
    queryFn: () => fetchDocs(params.club as string),
    queryKey: ["docs", params.club],
  });

  if (isLoading)
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );

  if (isError)
    return <ErrorState title="無法載入文件列表" description="請確認網路連線後再試。" onRetry={() => refetch()} />;

  return <DocsTable columns={DocsColumns} data={data} />;
};

export default Page;
