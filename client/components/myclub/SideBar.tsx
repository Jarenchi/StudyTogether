import { CalendarDays, File, Settings, Tv, Users, X } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const links = [
  { href: "events", icon: <CalendarDays />, label: "Events" },
  { href: "docs", icon: <File />, label: "Docs" },
  { href: "meeting", icon: <Tv />, label: "Meeting" },
  { href: "members", icon: <Users />, label: "Members" },
  { href: "settings", icon: <Settings />, label: "Settings" },
];

interface SidebarProps {
  id: string;
  name: string;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ id, name, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop: always visible static sidebar */}
      <div className="hidden md:flex flex-col min-h-[calc(100vh_-_74px)] w-52 border-r py-4 shrink-0">
        <Link href={`/myclubs/${id}`} className="text-lg font-semibold tracking-tight px-4 mb-2 block truncate">
          {name}
        </Link>
        {links.map(({ href, icon, label }) => (
          <Link key={href} href={`/myclubs/${id}/${href}`}>
            <Button variant="ghost" className="w-full justify-start flex">
              {icon}
              <span className="ml-2">{label}</span>
            </Button>
          </Link>
        ))}
      </div>

      {/* Mobile: Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-30 flex flex-col w-64 bg-background border-r py-4 transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 mb-2">
          <Link
            href={`/myclubs/${id}`}
            className="text-lg font-semibold tracking-tight truncate"
            onClick={onClose}
          >
            {name}
          </Link>
          <button type="button" onClick={onClose} aria-label="Close sidebar">
            <X className="h-5 w-5" />
          </button>
        </div>
        {links.map(({ href, icon, label }) => (
          <Link key={href} href={`/myclubs/${id}/${href}`} onClick={onClose}>
            <Button variant="ghost" className="w-full justify-start flex">
              {icon}
              <span className="ml-2">{label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </>
  );
}
