import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import nookies, { destroyCookie } from "nookies";

import useUserStore from "@/stores/userStore";

const Options = () => {
  const router = useRouter();
  const setUserId = useUserStore((state) => state.setUserId);

  function logoutHandler() {
    destroyCookie(null, "access_token");
    destroyCookie(null, "user_id");
    destroyCookie(null, "user_name");
    destroyCookie(null, "user_email");
    setUserId("");
    router.push("/login");
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <Avatar>
              <AvatarImage src={nookies.get().user_image} />
              <AvatarFallback>{nookies.get().user_name}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="text-center">My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/my/dashboard">Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={logoutHandler}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Options;
