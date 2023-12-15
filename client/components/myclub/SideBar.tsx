import { File, Tv, Settings, Users, CalendarDays } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export function Sidebar({ id, name }: { id: string; name: string }) {
  return (
    <div className="max-w-[13rem] min-h-[calc(100vh_-_74px)] h-auto border-r space-y-4 py-4 z-10">
      {/* <Button variant="ghost" className="float-right mr-3">
        <ChevronsLeft />
      </Button> */}
      <div className="px-3 py-2">
        <Link href={`/myclubs/${id}`} className="mb-4 text-lg font-semibold tracking-tight break-words">
          {name}
        </Link>
        <div className="space-y-1">
          <Link href={`/myclubs/${id}/events`}>
            <Button variant="ghost" className="w-full justify-start">
              <CalendarDays />
              <span className="ml-2">Events</span>
            </Button>
          </Link>
          <Link href={`/myclubs/${id}/docs`}>
            <Button variant="ghost" className="w-full justify-start">
              <File />
              <span className="ml-2">Docs</span>
            </Button>
          </Link>
          <Link href={`/myclubs/${id}/meeting`}>
            <Button variant="ghost" className="w-full justify-start">
              <Tv />
              <span className="ml-2">Meeting</span>
            </Button>
          </Link>
          <Link href={`/myclubs/${id}/members`}>
            <Button variant="ghost" className="w-full justify-start">
              <Users />
              <span className="ml-2">Members</span>
            </Button>
          </Link>
          <Link href={`/myclubs/${id}/settings`}>
            <Button variant="ghost" className="w-full justify-start">
              <Settings />
              <span className="ml-2">Settings</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
