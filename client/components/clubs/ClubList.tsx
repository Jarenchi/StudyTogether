"use client";

import { useQuery } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
import nookies from "nookies";
import axios from "axios";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchClubList } from "@/utils/api";
import { Club } from "@/types/clubType";

const ClubList = () => {
  //   const router = useRouter();
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
    // router.push("/myclub");
  }
  const clubItems = data?.clubs?.map((club: Club) => (
    <Card key={club._id}>
      <CardHeader>
        <CardTitle>{club.name}</CardTitle>
        <CardDescription>{club.owner.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{club.description}</p>
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          onClick={() => {
            joinClubHandler(club._id);
          }}
        >
          Join
        </Button>
      </CardFooter>
    </Card>
  ));
  return <div className="max-w-[900px]">{clubItems}</div>;
};

export default ClubList;
