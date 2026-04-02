"use client";

import { Sidebar } from "@/components/myclub/SideBar";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { AlignLeft } from "lucide-react";

export default function ClubLayout({ children, params }: { children: React.ReactNode; params: { club: string } }) {
  const [clubName, setClubName] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    if (clubName) localStorage.setItem(params.club, clubName);
  }, [params.club, clubName]);

  // Close the drawer on Escape key
  useEffect(() => {
    if (!sidebarOpen) return undefined;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen]);

  const handleClose = useCallback(() => setSidebarOpen(false), []);

  return (
    <section className="flex">
      {/* Backdrop overlay (mobile only, when sidebar is open) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={handleClose} aria-hidden="true" />
      )}

      <Sidebar id={params.club} name={clubName ?? ""} isOpen={sidebarOpen} onClose={handleClose} />

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
        <div className="px-4 py-5 max-w-5xl">{children}</div>
      </div>
    </section>
  );
}
