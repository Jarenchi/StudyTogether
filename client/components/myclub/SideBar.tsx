import { AlignLeft, CalendarDays, File, Settings, Tv, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";

const links = [
  { href: "events", icon: <CalendarDays />, label: "Events" },
  { href: "docs", icon: <File />, label: "Docs" },
  { href: "meeting", icon: <Tv />, label: "Meeting" },
  { href: "members", icon: <Users />, label: "Members" },
  { href: "settings", icon: <Settings />, label: "Settings" },
];

const ClubLinks = ({ id, isOpen }: { id: string; isOpen: boolean }) => {
  return (
    <div>
      {links.map(({ href, icon, label }) => (
        <Link key={href} href={`/myclubs/${id}/${href}`}>
          {isOpen ? (
            <Button variant="ghost" className="w-full justify-start flex">
              {icon}
              <span className="ml-2">{label}</span>
            </Button>
          ) : (
            <Button variant="ghost" className="block">
              {icon}
            </Button>
          )}
        </Link>
      ))}
    </div>
  );
};

export function Sidebar({ id, name }: { id: string; name: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="max-w-[13rem] min-h-[calc(100vh_-_74px)] h-auto border-r py-4 z-10 break-words truncate">
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="p-2 border rounded-lg mx-2 block">
        <span className="sr-only">Open sidebar</span>
        <AlignLeft />
      </button>
      {isOpen && (
        <Link href={`/myclubs/${id}`} className="max-w-[13rem] text-lg font-semibold tracking-tight px-2">
          {name}
        </Link>
      )}
      <ClubLinks id={id} isOpen={isOpen} />
    </div>
  );
}
