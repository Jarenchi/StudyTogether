"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Sidebar } from "@/components/myclub/SideBar";

export default function ClubLayout({ children, params }: { children: React.ReactNode; params: { club: string } }) {
  const [clubName, setClubName] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClubName() {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${params.club}/name`);
      setClubName(response.data.name);
    }

    fetchClubName();
  }, [params.club]);

  const memoizedSidebar = useMemo(() => {
    return <Sidebar id={params.club} name={clubName!} />;
  }, [params.club, clubName]);

  return (
    <section className="flex">
      {memoizedSidebar}
      {children}
    </section>
  );
}
