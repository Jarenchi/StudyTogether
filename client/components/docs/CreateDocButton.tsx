"use client";

import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { formattedTime } from "@/utils/formattedTime";
import nookies from "nookies";
import { Button } from "../ui/button";

const CreateDocButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const clubId = pathSegments[2];
  async function createDocHandler() {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/docs`, {
        title: formattedTime,
        content: "",
        creater: {
          id: nookies.get().user_id,
          name: nookies.get().user_name,
          picture: nookies.get().user_image,
        },
      });
      console.log(response);
      router.push(`/myclubs/${clubId}/docs/${response.data._id}`);
    } catch (error: any) {
      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        alert("請稍後再試或和我們的技術團隊聯絡");
      }
    }
  }
  return <Button onClick={createDocHandler}>Create Doc</Button>;
};

export default CreateDocButton;
