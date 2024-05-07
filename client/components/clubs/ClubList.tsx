"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Club } from "@/types/clubType";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Users } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import nookies from "nookies";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const ClubList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword");
  async function fetchClubList() {
    try {
      let response;
      if (keyword !== null) {
        response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/clubs/search`, {
          params: { keyword },
        });
      } else {
        response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/clubs/all`);
      }
      return response.data.clubs;
    } catch (error) {
      console.error("Error fetching club list:", error);
      throw error;
    }
  }
  const { data, isLoading, isError } = useQuery({
    queryFn: () => fetchClubList(),
    queryKey: ["clublist"],
    staleTime: 60 * 1000,
  });
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>500 Internal Server Error</div>;
  if (data.length === 0) {
    return <div className="text-center">No Data</div>;
  }
  async function joinClubHandler(clubId: string) {
    try {
      const userId = nookies.get().user_id;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/clubs/join`,
        { userId, clubId },
        { headers: { Authorization: `Bearer ${nookies.get().access_token}` } },
      );
      console.log(response.data);
      router.push("/myclubs");
    } catch (error: any) {
      if (error?.response?.status === 403) {
        alert("Account is expired, please Login again");
        router.push("/login");
      } else if (error?.response?.status >= 500 && error?.response?.status < 600) {
        alert("請稍後再試或和我們的技術團隊聯絡");
      } else {
        alert(error);
      }
    }
  }
  const clubItems = data?.map((club: Club) => {
    const isMember = club?.members?.includes(nookies.get().user_id);
    return (
      <Card key={club._id} className="w-[20rem] mb-2">
        <CardHeader>
          <div className="flex items-center">
            <Avatar className="mr-4">
              <AvatarImage src={club.picture} />
              <AvatarFallback>{club.name}</AvatarFallback>
            </Avatar>
            <CardTitle className="overflow-hidden break-words leading-8">
              {isMember ? (
                <Link href={`/myclubs/${club._id}`} className="hover:underline">
                  {club.name}
                </Link>
              ) : (
                club.name
              )}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg"> Creator:{club.owner.name}</p>
          <div className="flex items-center gap-3">
            <Users />
            <p className="text-lg">{club.members.length}</p>
          </div>
        </CardContent>
        <CardFooter>
          {isMember || (
            <Button
              type="button"
              onClick={() => {
                joinClubHandler(club._id);
              }}
              disabled={typeof window === "undefined" ? false : !nookies.get().user_id}
            >
              Join
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  });
  return <div className="flex gap-2 flex-wrap">{clubItems}</div>;
};

export default ClubList;
