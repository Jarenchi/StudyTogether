"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  title: string;
  status: "pending" | "processing" | "finished";
  creater: string;
  created_at: string;
  last_modified_at: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "creater",
    header: "Creater",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
  },
  {
    accessorKey: "last_modified_at",
    header: "Last Modified At",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];
