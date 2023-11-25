import Link from "next/link";

const Header = () => {
  return (
    <div className="relative flex xl:px-[8.75rem] px-2 justify-between items-center bg-white dark:bg-[#121212] border-b border-[#D9D9D9]">
      <div className="flex items-center py-6 lg:flex">
        <Link href="/">
          <span className="block font-pattaya text-[37px] leading-9 font-normal text-primary">Study Together</span>
        </Link>
      </div>
    </div>
  );
};

export default Header;
