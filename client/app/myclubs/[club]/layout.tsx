"use client";

import { Sidebar } from "@/components/myclub/SideBar";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

export default function ClubLayout({ children, params }: { children: React.ReactNode; params: { club: string } }) {
  const [clubName, setClubName] = useState<string | null>(null);

  useEffect(() => {
    const storedClubName = localStorage.getItem(params.club);

    if (storedClubName) {
      setClubName(storedClubName);
    } else {
      const fetchClubName = async () => {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${params.club}/name`);
        setClubName(response.data.name);
      };
      fetchClubName();
    }
  }, [params.club]);

  useEffect(() => {
    localStorage.setItem(params.club, clubName || "");
  }, [params.club, clubName]);

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
