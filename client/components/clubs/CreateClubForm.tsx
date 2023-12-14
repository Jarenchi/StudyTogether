"use client";

import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import axios from "axios";
import nookies from "nookies";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
// import { Tag, TagInput } from "@/components/ui/tag-input";
import { Textarea } from "../ui/textarea";

const clubSchema = z.object({
  clubName: z.string().min(1, { message: "Club Name is required" }),
  clubDescription: z.string().min(1, { message: "Club Description is required" }),
  // clubTags: z.array(
  //   z.object({
  //     id: z.string(),
  //     text: z.string(),
  //   }),
  // ),
  clubImage: z
    .string()
    .refine((value) => /\.(jpg|jpeg|png)$/.test(value), {
      message: "Please upload an image",
    })
    .optional(),
});

interface CreateClubFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateClubForm: React.FC<CreateClubFormProps> = ({ setOpen }) => {
  // const [tags, setTags] = useState<Tag[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof clubSchema>>({
    resolver: zodResolver(clubSchema),
    defaultValues: {
      clubName: "",
      clubDescription: "",
      // clubTags: [],
    },
  });
  // const { setValue } = form;

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof clubSchema>) => {
      const userData = {
        id: nookies.get().user_id,
        name: nookies.get().user_name,
        picture: nookies.get().user_picture,
      };
      const formData = new FormData();
      formData.append("name", values.clubName);
      formData.append("description", values.clubDescription);
      formData.append("owner[id]", userData.id);
      formData.append("owner[name]", userData.name);
      formData.append("members", JSON.stringify([userData]));
      const selectedFile = fileInputRef?.current?.files?.[0];
      if (selectedFile) {
        formData.append("image", selectedFile);
      }
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clubs/`, formData, {
        headers: { Authorization: `Bearer ${nookies.get().access_token}`, "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      form.reset({
        clubName: "",
        clubDescription: "",
        clubImage: "",
      });
      toast({ title: "Club Created" });
      queryClient.invalidateQueries({ queryKey: ["clublist"] });
      setOpen(false);
    },
    onError: (error: any) => {
      if (error?.response?.status === 403) {
        alert("Account is expired, please Login again");
        router.push("/login");
      } else if (error?.response?.status >= 500 && error?.response?.status < 600) {
        alert("請稍後再試或和我們的技術團隊聯絡");
      } else {
        alert(error);
      }
    },
  });

  async function onSubmit(values: z.infer<typeof clubSchema>) {
    mutation.mutateAsync(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" encType="multipart/form-data">
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
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel className="text-left">Club Tags</FormLabel>
              <FormControl>
                <TagInput
                  {...field}
                  placeholder="Enter a topic"
                  tags={tags}
                  className="sm:min-w-[450px]"
                  setTags={(newTags) => {
                    setTags(newTags);
                    setValue("clubTags", newTags as [Tag, ...Tag[]]);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="clubImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Club Image</FormLabel>
              <FormControl>
                <Input type="file" id="clubImage" {...field} ref={fileInputRef} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
