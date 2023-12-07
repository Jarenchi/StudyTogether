"use client";

import { useQuery } from "@tanstack/react-query";
import nookies from "nookies";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { CalendarDays, MenuSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Club {
  id: string;
  name: string;
}

interface Event {
  eventId: string;
  type: ["online", "offline"];
}

const Page = () => {
  const pathname = usePathname();
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
  console.log(data);

  if (isLoading) return <div>Loading...</div>;
  if (isError) {
    return (
      <div className="flex items-center">
        <p>請先登入帳號</p>
        <Button>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  const clubItems = data?.clubs?.map((club: Club) => (
    <Link key={club.id} href={`${pathname}/${club.id}`}>
      <p className="text-primary text-xl">{club.name}</p>
    </Link>
  ));

  const eventItems = data.events.map((event: Event) => (
    <div key={event.eventId}>
      <div>{event.type}</div>
      <div>{event.eventId}</div>
    </div>
  ));
  return (
    <div className="ml-2 mt-2">
      <div className="flex gap-3 items-center">
        <MenuSquare />
        <p className="text-2xl">Clubs</p>
      </div>
      <div className="flex gap-3 flex-wrap">{clubItems}</div>
      <div className="mt-3 flex gap-3 items-center">
        <CalendarDays />
        <p className="text-2xl">Events</p>
      </div>
      <div>{eventItems}</div>
    </div>
  );
};

export default Page;
