"use client";

import { useQuery } from "@tanstack/react-query";
import nookies from "nookies";
import axios from "axios";
import { useRouter } from "next/navigation";
import Dashboard from "@/components/dashboard/Dashboard";
import { Skeleton } from "@/components/ui/skeleton";

const Page = () => {
  const router = useRouter();
  const userId = nookies.get().user_id;

  async function fetchUsages() {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/${userId}/usages/all`, {
      headers: { Authorization: `Bearer ${nookies.get().access_token}` },
    });
    return response.data.userUsages[0];
  }

  const { data, isLoading, isError } = useQuery({
    queryFn: fetchUsages,
    queryKey: ["usages", userId],
    retry: false,
    throwOnError: (error: any) => {
      if (error?.response?.status === 403) router.push("/login");
      return false;
    },
  });

  if (isLoading)
    return (
      <div className="max-w-7xl mx-auto my-4 px-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-xl" />
      </div>
    );

  if (isError || !data)
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-lg font-semibold mb-2">無法載入學習紀錄</p>
        <p className="text-sm">請重新整理頁面。</p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto my-4 px-4">
      <Dashboard data={data} userId={userId} />
    </div>
  );
};

export default Page;
