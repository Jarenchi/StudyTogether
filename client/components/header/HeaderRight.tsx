"use client";

import { useEffect, useState } from "react";
import nookies from "nookies";
import Link from "next/link";
import useUserStore from "@/stores/userStore";
import { Button } from "../ui/button";
import { ModeToggle } from "./ModeToggle";
import Options from "./Options";

const HeaderRight = () => {
  const userId = useUserStore((state) => state.userId);
  const setUserId = useUserStore((state) => state.setUserId);
  // Prevent hydration flash: don't render auth UI until client has mounted
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setUserId(nookies.get().user_id);
    setMounted(true);
  }, [setUserId]);

  let authUI;
  if (!mounted) {
    authUI = <div className="w-9 h-9 rounded-full bg-muted animate-pulse" />;
  } else if (userId) {
    authUI = <Options />;
  } else {
    authUI = (
      <Button asChild size="sm">
        <Link href="/login">Login</Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center">
      <ModeToggle />
      {/* Fixed-size placeholder keeps layout stable during hydration */}
      <div className="ml-2">{authUI}</div>
    </div>
  );
};

export default HeaderRight;
