"use client";

import { useQuery } from "@tanstack/react-query";
import nookies from "nookies";
import axios from "axios";
import { useRouter } from "next/navigation";
import TimeChart from "@/components/dashboard/TimeChart";
import ProfileBanner from "@/components/dashboard/ProfileBanner";

const Page = () => {
  const router = useRouter();
  const userId = nookies.get().user_id;

  async function fetchMyProfile(user: string) {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/${user}/profile`, {
        headers: { Authorization: `Bearer ${nookies.get().access_token}` },
      });
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 403) {
        alert("Account is expired, please Login again");
        router.push("/login");
      }
      console.log("Error fetching myclub list:", error);
      throw error;
    }
  }
  const { data, isLoading, isError } = useQuery({
    queryFn: () => fetchMyProfile(userId),
    queryKey: ["myclubs", userId],
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  return (
    <div className="max-w-7xl mx-auto my-4">
      <ProfileBanner data={data} />
      <TimeChart />
    </div>
  );
};

export default Page;
