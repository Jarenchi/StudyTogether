"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Member = {
  _id: string;
  userId: string;
  clubId: string;
  name: string;
  picture: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
export const MembersColumns: ColumnDef<Member>[] = [
  {
    accessorKey: "userId",
  },
  {
    accessorKey: "picture",
    cell: ({ row }) => {
      return (
        <Avatar>
          <AvatarImage src={row.getValue("picture")} />
          <AvatarFallback>{row.getValue("name")}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: () => {
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
              <DropdownMenuItem>Edit file</DropdownMenuItem>
              <DropdownMenuItem>
                <AlertDialogTrigger>Delete user</AlertDialogTrigger>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </AlertDialog>
      );
    },
  },
];
