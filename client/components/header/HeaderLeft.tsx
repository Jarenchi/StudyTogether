import Link from "next/link";
import { Button } from "../ui/button";

const HeaderLeft = () => {
  return (
    <div className="flex">
      <Link href="/clubs">
        <Button variant="link">Clubs</Button>
      </Link>
      <Link href="/my/clubs">
        <Button variant="link">My Clubs</Button>
      </Link>
    </div>
  );
};

export default HeaderLeft;
