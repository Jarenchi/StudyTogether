"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import nookies from "nookies";
import axios from "axios";
import { MemberTable } from "@/components/members/memberTable/MemberTable";
import { MembersColumns } from "@/components/members/memberTable/columns";
import Draw from "@/components/members/Draw";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorState from "@/components/ui/ErrorState";
import { handleApiError } from "@/utils/handleApiError";

const Page = () => {
  const params = useParams();
  const router = useRouter();

  const { data, isLoading, isError, refetch } = useQuery({
    queryFn: async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${params.club}/members`, {
          headers: { Authorization: `Bearer ${nookies.get().access_token}` },
        });
        return response.data.members;
      } catch (error: any) {
        handleApiError(error, router);
        throw error;
      }
    },
    queryKey: ["members", params.club],
  });

  if (isLoading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );

  if (isError)
    return <ErrorState title="無法載入成員列表" description="請確認網路連線後再試。" onRetry={() => refetch()} />;

  return (
    <div className="space-y-4">
      <Draw data={data} />
      <MemberTable data={data} columns={MembersColumns} />
    </div>
  );
};

export default Page;
