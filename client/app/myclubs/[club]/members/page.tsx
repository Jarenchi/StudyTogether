"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import nookies from "nookies";
import axios from "axios";
import { MemberTable } from "@/components/members/memberTable/MemberTable";
import { MembersColumns } from "@/components/members/memberTable/columns";
import Draw from "@/components/members/Draw";

const Page = () => {
  const params = useParams();
  const router = useRouter();

  async function fetchMembers(clubId: string) {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/members`, {
        headers: { Authorization: `Bearer ${nookies.get().access_token}` },
      });
      return response.data.members;
    } catch (error: any) {
      if (error?.response?.status === 403) {
        alert("Account is expired, please Login again");
        router.push("/login");
      } else if (error?.response?.status >= 500 && error?.response?.status < 600) {
        alert("請稍後再試或和我們的技術團隊聯絡");
      } else {
        alert(error);
      }
      console.log("Error fetching members:", error);
      throw error;
    }
  }
  const { data, isLoading, isError } = useQuery({
    queryFn: () => fetchMembers(params.club as string),
    queryKey: ["members", params.club],
  });
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>500 Internal Server Error</div>;
  return (
    <div className="mx-auto mt-2">
      <Draw data={data} />
      <MemberTable data={data} columns={MembersColumns} />
    </div>
  );
};

export default Page;
