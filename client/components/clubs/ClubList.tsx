"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import nookies from "nookies";
import axios from "axios";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchClubList } from "@/utils/api";
import { Club } from "@/types/clubType";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const ClubList = () => {
  const router = useRouter();
  const { data, isLoading, isError } = useQuery({
    queryFn: () => fetchClubList(),
    queryKey: ["clublist"],
  });
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>500 Internal Server Error</div>;

  async function joinClubHandler(clubId: string) {
    try {
      const userId = nookies.get().user_id;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/clubs/join`,
        { userId, clubId },
        { headers: { Authorization: `Bearer ${nookies.get().access_token}` } },
      );
      console.log(response.data);
    } catch (error: any) {
      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        alert("請稍後再試或和我們的技術團隊聯絡");
      }
    }
    router.push("/myclubs");
  }
  const clubItems = data?.clubs?.map((club: Club) => {
    const isMember = club?.members?.includes(nookies.get().user_id);
    return (
      <Card key={club._id} className="min-w-[20rem] mb-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="mr-4">
                <AvatarImage src={club.picture} />
                <AvatarFallback>{club.name}</AvatarFallback>
              </Avatar>
              <CardTitle>{club.name}</CardTitle>
            </div>
            <div>
              <CardDescription>
                創辦人:
                {club.owner.name}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="max-w-lg lg:max-w-2xl">
          <pre className="font-sans break-words whitespace-pre-wrap">{club.description}</pre>
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
