"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { formattedTime } from "@/utils/formattedTime";
import nookies from "nookies";
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
      console.log(response);
      router.push(`/myclubs/${clubId}/docs/${response.data._id}`);
    } catch (error: any) {
      if (error?.response?.status === 403) {
        alert("Account is expired, please Login again");
        router.push("/login");
      } else if (error?.response?.status >= 500 && error?.response?.status < 600) {
        alert("請稍後再試或和我們的技術團隊聯絡");
      } else {
        alert(error);
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Button onClick={createDocHandler} disabled={loading}>
      Create Doc
    </Button>
  );
};

export default CreateDocButton;
