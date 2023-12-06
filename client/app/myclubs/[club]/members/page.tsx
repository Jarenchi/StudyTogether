"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import nookies from "nookies";
import axios from "axios";
import { MemberTable } from "@/components/members/memberTable/MemberTable";
import { MembersColumns } from "@/components/members/memberTable/columns";

async function fetchMembers(clubId: string) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/members`, {
      headers: { Authorization: `Bearer ${nookies.get().access_token}` },
    });
    return response.data.members;
  } catch (error) {
    console.log("Error fetching docs:", error);
    throw error;
  }
}

const Page = () => {
  const params = useParams();
  const { data, isLoading, isError } = useQuery({
    queryFn: () => fetchMembers(params.club as string),
    queryKey: ["members", params.club],
  });
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>500 Internal Server Error</div>;

  return (
    <div className="mx-auto mt-2">
      <MemberTable data={data} columns={MembersColumns} />
    </div>
  );
};

export default Page;
