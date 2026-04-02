"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ClubDescription from "@/components/club/ClubDescription";
import ClubInformation from "@/components/club/ClubInformation";
import { Club } from "@/types/clubType";
import ClubBanner from "@/components/club/ClubBanner";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorState from "@/components/ui/ErrorState";

const Page = ({ params }: { params: { club: string } }) => {
  async function fetchClub() {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${params.club}`);
    return response.data as Club;
  }

  const { data, isLoading, isError, refetch } = useQuery({
    queryFn: fetchClub,
    queryKey: ["club", params.club],
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <Skeleton className="h-52 w-full rounded-xl" />
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return <ErrorState title="無法載入社團資訊" description="請確認網路連線後再試。" onRetry={() => refetch()} />;
  }

  if (!data) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4 animate-fade-in">
      <ClubBanner data={data} />
      <ClubInformation data={data} />
      <ClubDescription description={data.description} owner={data.owner} club={params.club} />
    </div>
  );
};

export default Page;
