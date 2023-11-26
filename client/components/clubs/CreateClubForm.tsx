"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
// import { FancyMultiSelect } from "../ui/multi-select";

const clubSchema = z.object({
  clubName: z.string().min(1, { message: "Club Name is required" }),
  clubDescription: z.string().min(1, { message: "Club Description is required" }),
});

const CreateClubForm = () => {
  const form = useForm<z.infer<typeof clubSchema>>({
    resolver: zodResolver(clubSchema),
    defaultValues: {
      clubName: "",
      clubDescription: "",
    },
  });

  async function onSubmit(values: z.infer<typeof clubSchema>) {
    try {
      console.log(values);
    } catch (error: any) {
      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        alert("請稍後再試或和我們的技術團隊聯絡");
      } else {
        alert(error);
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="clubName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Club Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="clubTags"
          render={() => (
            <FormItem>
              <FormLabel>clubTags</FormLabel>
              <FormControl>
                <FancyMultiSelect onChange={handleTagChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="clubDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="description about your club" className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="dark:text-white">
          Create Club
        </Button>
      </form>
    </Form>
  );
};

export default CreateClubForm;
