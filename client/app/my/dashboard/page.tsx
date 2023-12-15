"use client";

import { useQuery } from "@tanstack/react-query";
import nookies from "nookies";
import axios from "axios";
import { useRouter } from "next/navigation";
import Dashboard from "@/components/dashboard/Dashboard";
// import ProfileBanner from "@/components/dashboard/ProfileBanner";

const Page = () => {
  const router = useRouter();
  const userId = nookies.get().user_id;

  async function fetchUsages() {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/${userId}/usages/all`, {
        headers: { Authorization: `Bearer ${nookies.get().access_token}` },
      });
      return response.data.userUsages[0];
    } catch (error: any) {
      if (error?.response?.status === 403) {
        alert("Account is expired, please Login again");
        router.push("/login");
      }
      console.log(error);
      throw error;
    }
  }
  const { data, isLoading, isError } = useQuery({
    queryFn: () => fetchUsages(),
    queryKey: ["usages", userId],
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  return (
    <div className="max-w-7xl mx-auto my-4 px-4">
      <Dashboard data={data!} />
    </div>
  );
};

export default Page;
