import { File, Tv, Settings, Users, CalendarDays } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export function Sidebar({ id }: { id: string }) {
  return (
    <div className="max-w-[14rem] min-h-fit border-r">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight break-words">{id}</h2>
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
            <Link href={`/myclubs/${id}/mettings`}>
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
    </div>
  );
}
