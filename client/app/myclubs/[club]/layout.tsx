"use client";

import { Sidebar } from "@/components/myclub/SideBar";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { AlignLeft } from "lucide-react";

export default function ClubLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { club: string };
}) {
  const [clubName, setClubName] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const storedClubName = localStorage.getItem(params.club);
    if (storedClubName) {
      setClubName(storedClubName);
    } else {
      const fetchClubName = async () => {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/clubs/${params.club}/name`,
        );
        setClubName(response.data.name);
      };
      fetchClubName();
    }
  }, [params.club]);

  useEffect(() => {
    localStorage.setItem(params.club, clubName || "");
  }, [params.club, clubName]);

  const memoizedSidebar = useMemo(
    () => (
      <Sidebar
        id={params.club}
        name={clubName!}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    ),
    [params.club, clubName, sidebarOpen],
  );

  return (
    <section className="flex">
      {/* Backdrop overlay (mobile only, when sidebar is open) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {memoizedSidebar}

      <div className="flex-1 min-w-0">
        {/* Mobile hamburger — inside content flow, below the Header */}
        <div className="md:hidden p-2 border-b">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 border rounded-lg"
            aria-label="Open sidebar"
          >
            <AlignLeft className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </section>
  );
}
