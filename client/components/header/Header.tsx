import { GraduationCap } from "lucide-react";
import { Montserrat } from "next/font/google";
import Link from "next/link";
import HeaderLeft from "./HeaderLeft";
import HeaderRight from "./HeaderRight";

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700"],
});

const Header = () => {
  return (
    <div className="flex xl:px-[8.75rem] p-2 justify-between items-center border-b border-[#9494ac] dark:border-[#2f2f3a]">
      <div className="flex">
        <Link href="/">
          <div className="md:hidden">
            <GraduationCap color="hsl(var(--primary))" size={37} />
          </div>
          <span
            className={`font-pattaya text-[28px] leading-9 font-normal text-primary hidden md:block ${montserrat.className}`}
          >
            Study Together
          </span>
        </Link>
        <HeaderLeft />
      </div>
      <HeaderRight />
    </div>
  );
};

export default Header;
