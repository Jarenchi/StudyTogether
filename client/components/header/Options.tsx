import nookies, { destroyCookie } from "nookies";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants, Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={nookies.get().user_image} />
            <AvatarFallback>{nookies.get().user_name}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="text-center">My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/my/dashboard" className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}>
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/my/settings" className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}>
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button variant="ghost" type="button" onClick={logoutHandler}>
              Log out
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Options;
