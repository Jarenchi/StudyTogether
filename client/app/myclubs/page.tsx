"use client";

import { useQuery } from "@tanstack/react-query";
import nookies from "nookies";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { fetchMyClubs } from "@/utils/api";

interface Club {
  id: string;
  name: string;
}
const Page = () => {
  const pathname = usePathname();
  const userId = nookies.get().user_id;
  const { data, isLoading, isError } = useQuery({
    queryFn: () => fetchMyClubs(userId),
    queryKey: ["myclubs", userId],
  });

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
      <div>{club.name}</div>
    </Link>
  ));
  return (
    <div>
      <p>ClubList</p>
      <div>{clubItems}</div>
    </div>
  );
};

export default Page;
