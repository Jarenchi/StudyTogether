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
        { headers: { Authorization: `Bearer ${nookies.get().access_token}` } },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["club", club] });
      setEdit(false);
    },
  });

  async function descriptionUpdateHandler(values: z.infer<typeof FormSchema>) {
    await mutation.mutateAsync(values);
  }

  return (
    <Card className="w-full">
      <CardHeader className="relative pb-2">
        <CardTitle className="text-base font-semibold text-muted-foreground uppercase tracking-wide">
          About
        </CardTitle>
        {isAbleToEdit && !edit && (
          <button
            type="button"
            onClick={() => setEdit(true)}
            className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-muted transition-colors"
          >
            <span className="sr-only">Edit description</span>
            <Pencil className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </CardHeader>
      <CardContent>
        {edit ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(descriptionUpdateHandler)} className="space-y-3">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea {...field} className="w-full min-h-[80px] resize-y" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={mutation.isPending}>
                  {mutation.isPending ? "儲存中..." : "儲存"}
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => setEdit(false)}>
                  取消
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap break-words">
            {description || <span className="text-muted-foreground italic">尚未填寫說明</span>}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ClubDescription;
