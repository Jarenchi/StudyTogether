"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Owner } from "@/types/clubType";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Pencil } from "lucide-react";
import nookies from "nookies";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface ClubDescriptionProps {
  description: string;
  owner: Owner;
  club: string;
}
const FormSchema = z.object({
  description: z.string(),
});

const ClubDescription: React.FC<ClubDescriptionProps> = ({ description, owner, club }) => {
  const [edit, setEdit] = useState(false);
  const isAbleToEdit = owner.name === nookies.get().user_name;
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { description },
  });

  const mutation = useMutation({
    mutationFn: async (values: { description: string }) =>
      axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/clubs/${club}`,
        { description: values.description },
        {
          headers: { Authorization: `Bearer ${nookies.get().access_token}` },
        },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["club", club] });
      setEdit(false);
    },
    onError: (error: any) => {
      if (error?.response?.status === 404) {
        alert("Club not found");
      } else if (error?.response?.status >= 500 && error?.response?.status < 600) {
        alert("請稍後再試或和我們的技術團隊聯絡");
      } else {
        alert(error);
      }
    },
  });

  async function descriptionUpdateHandler(values: z.infer<typeof FormSchema>) {
    await mutation.mutateAsync(values);
  }
  return (
    <Card className="my-2 w-5/6">
      <CardHeader className="relative">
        <CardTitle className="lg:text-xl text-base"> Description</CardTitle>
        {isAbleToEdit && (
          <button type="button" onClick={() => setEdit(true)} className="absolute top-3 right-3">
            <span className="sr-only">Edit</span>
            <Pencil size={20} color="#2563eb" />
          </button>
        )}
      </CardHeader>
      <CardContent className="max-w-5xl w-[64rem]">
        {edit ? (
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(descriptionUpdateHandler)} className="w-2/3 space-y-6">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea {...field} className="w-[60rem] h-8" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mt-2">
                  <Button type="submit" className="mr-2">
                    Submit
                  </Button>
                  <Button onClick={() => setEdit(false)}>Cancel</Button>
                </div>
              </form>
            </Form>
          </div>
        ) : (
          <pre className="font-sans break-words whitespace-pre-wrap md:text-base text-sm">{description}</pre>
        )}
      </CardContent>
    </Card>
  );
};

export default ClubDescription;
