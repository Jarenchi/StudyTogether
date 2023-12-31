"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import nookies from "nookies";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import DeleteDocAlertContent from "./DeleteDocAlertContent";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Doc = {
  _id: string;
  title: string;
  status: "pending" | "processing" | "finished";
  creator: {
    id: string;
    name: string;
    picture: string;
  };
  createdAt: string;
  last_modified_at: string;
};
export const DocsColumns: ColumnDef<Doc>[] = [
  {
    accessorKey: "_id",
    enableHiding: true,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      return <Link href={`docs/${row.getValue("_id")}`}>{row.getValue("title")}</Link>;
    },
  },
  {
    accessorKey: "creator.name",
    id: "creator.name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Creator
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const formatted = date.toLocaleDateString();
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Last Modified At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"));
      const formatted = date.toLocaleDateString();
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Rename file</DropdownMenuItem>
              {nookies.get().user_name === row.getValue("creator.name") && (
                <DropdownMenuItem>
                  <AlertDialogTrigger>Delete file</AlertDialogTrigger>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <DeleteDocAlertContent docId={row.getValue("_id")} />
        </AlertDialog>
      );
    },
  },
];
