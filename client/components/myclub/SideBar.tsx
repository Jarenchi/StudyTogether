"use client";

import { File, Tv, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

export function Sidebar({ id }: { id: string }) {
  const pathname = usePathname();
  return (
    <div className="max-w-[14rem] min-h-fit border-r">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">{id}</h2>
          <div className="space-y-1">
            <Link href={`${pathname}/docs`}>
              <Button variant="ghost" className="w-full justify-start">
                <File />
                <span className="ml-2">Docs</span>
              </Button>
            </Link>
            <Link href={`${pathname}/metting`}>
              <Button variant="ghost" className="w-full justify-start">
                <Tv />
                <span className="ml-2">Meeting</span>
              </Button>
            </Link>
            <Link href={`${pathname}/settings`}>
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
