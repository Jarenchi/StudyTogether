"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Club } from "@/types/clubType";
import ClubDescription from "@/components/club/ClubDescription";
import ClubInformation from "@/components/club/ClubInformation";
import ClubBanner from "@/components/club/ClubBanner";

const Page = ({ params }: { params: { club: string } }) => {
  async function fetchClub() {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${params.club}`);
    console.log(response.data);
    return response.data as Club;
  }
  const { data, isLoading, isError } = useQuery({
    queryFn: () => fetchClub(),
    queryKey: ["club", params.club],
  });
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>500 Internal Server Error</div>;
  console.log(data);

  return (
    <div className="mx-auto flex flex-col items-center mt-3">
      <ClubBanner data={data!} />
      <ClubDescription description={data?.description!} owner={data?.owner!} club={params.club} />
      <ClubInformation data={data!} />
    </div>
  );
};

export default Page;
