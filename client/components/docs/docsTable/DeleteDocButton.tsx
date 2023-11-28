"use client";

import axios from "axios";
import { Button } from "@/components/ui/button";

const DeleteDocButton = () => {
  async function deleteDocHandler() {}

  return <Button onClick={deletDocHandler}>Delete Doc</Button>;
};

export default DeleteDocButton;
