"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import nookies from "nookies";
import { Club } from "@/types/clubType";
import ClubCard from "./ClubCard";
import ClubListSkeleton from "./ClubListSkeleton";
import ErrorState from "../ui/ErrorState";
import EmptyState from "../ui/EmptyState";

const ClubList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword");

  async function fetchClubList(): Promise<Club[]> {
    const response = keyword
      ? await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/clubs/search`, { params: { keyword } })
      : await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/clubs/all`);
    return response.data.clubs;
  }

  const { data, isLoading, isError, refetch } = useQuery({
    queryFn: fetchClubList,
    queryKey: ["clublist", keyword],
    staleTime: 60 * 1000,
  });

  async function joinClubHandler(clubId: string) {
    try {
      const userId = nookies.get().user_id;
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/clubs/join`,
        { userId, clubId },
        { headers: { Authorization: `Bearer ${nookies.get().access_token}` } },
      );
      router.push("/myclubs");
    } catch (error: any) {
      if (error?.response?.status === 403) {
        router.push("/login");
      }
    }
  }

  if (isLoading) return <ClubListSkeleton />;

  if (isError) {
    return <ErrorState title="無法載入讀書會" description="請確認網路連線後再試。" onRetry={() => refetch()} />;
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title={keyword ? `找不到「${keyword}」的相關讀書會` : "還沒有任何讀書會"}
        description={keyword ? "換個關鍵字試試，或建立一個新的讀書會。" : "成為第一個建立讀書會的人！"}
      />
    );
  }

  const currentUserId = nookies.get().user_id;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {data.map((club: Club) => (
        <ClubCard
          key={club._id}
          club={club}
          isMember={club.members?.includes(currentUserId)}
          onJoin={joinClubHandler}
        />
      ))}
    </div>
  );
};

export default ClubList;
