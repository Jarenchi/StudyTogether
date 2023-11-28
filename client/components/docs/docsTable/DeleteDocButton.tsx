"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

const DeleteDocButton = () => {
  const { club, doc } = useParams();
  async function deleteDocHandler() {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${club}/docs/${doc}`);
    console.log(response.data);
  }

  return <Button onClick={deleteDocHandler}>Delete Doc</Button>;
};

export default DeleteDocButton;
