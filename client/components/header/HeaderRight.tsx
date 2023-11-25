"use client";

import { useEffect } from "react";
import nookies from "nookies";
import Link from "next/link";
import useUserStore from "@/stores/userStore";
import { Button } from "../ui/button";
import { ModeToggle } from "./ModeToggle";
import Options from "./Options";

const HeaderRight = () => {
  const userId = useUserStore((state) => state.userId);
  const setUserId = useUserStore((state) => state.setUserId);

  useEffect(() => {
    setUserId(nookies.get().user_id);
  }, [setUserId]);

  return (
    <div className="flex">
      <ModeToggle />
      <div className="ml-2">
        {userId ? (
          <Options />
        ) : (
          <Button>
            <Link href="/login" className="dark:text-white">
              Login
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default HeaderRight;
