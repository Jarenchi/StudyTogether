"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { formattedTime } from "@/utils/formattedTime";
import nookies from "nookies";
import { handleApiError } from "@/utils/handleApiError";
import { Button } from "../ui/button";

const CreateDocButton = () => {
  const router = useRouter();
  const params = useParams();
  const clubId = params.club;
  const [loading, setLoading] = useState(false);

  async function createDocHandler() {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/docs`,
        {
          title: formattedTime,
          content: "",
          creator: {
            id: nookies.get().user_id,
            name: nookies.get().user_name,
            picture: nookies.get().user_image,
          },
        },
        { headers: { Authorization: `Bearer ${nookies.get().access_token}` } },
      );
      router.push(`/myclubs/${clubId}/docs/${response.data._id}`);
    } catch (error: any) {
      handleApiError(error, router);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={createDocHandler} disabled={loading}>
      {loading ? "建立中..." : "建立文件"}
    </Button>
  );
};

export default CreateDocButton;
