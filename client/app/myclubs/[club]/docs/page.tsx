"use client";

import CreateDocButton from "@/components/docs/CreateDocButton";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { fetchDocs } from "@/utils/api";
import { DocsTable } from "@/components/docs/docsTable/DocsTable";
import { DocsColumns } from "@/components/docs/docsTable/columns";

const Page = () => {
  const params = useParams();
  const { data, isLoading, isError } = useQuery({
    queryFn: () => fetchDocs(params.club as string),
    queryKey: ["docs"],
  });
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>500 Internal Server Error</div>;
  console.log(data);
  return (
    <div className="ml-4 mt-2">
      <CreateDocButton />
      <DocsTable columns={DocsColumns} data={data} />
    </div>
  );
};

export default Page;
