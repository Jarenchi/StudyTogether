"use client";

import { useCallback, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";

const Searchbar = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams()!;
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const handleSearch = () => {
    if (searchInputRef.current?.value) {
      router.push(`/clubs?${createQueryString("keyword", searchInputRef.current?.value)}`);
    }
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <div className="flex items-center gap-3">
      <Input className="w-60" placeholder="search club..." type="text" ref={searchInputRef} onKeyDown={handleKeyDown} />
      <Button onClick={handleSearch}>
        <Search size={20} />
      </Button>
    </div>
  );
};

export default Searchbar;
