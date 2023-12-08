"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Member } from "@/types/memberType";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "@/components/ui/dialog";

const formSchema = z.object({
  number: z.coerce.number(),
});
interface DrawProps {
  data: Member[];
}

const Draw: React.FC<DrawProps> = ({ data }) => {
  const [selectedUsers, setSelectedUsers] = useState<Member[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: 1,
    },
  });

  const drawHandler = (values: z.infer<typeof formSchema>) => {
    const numberOfDraws = values.number;
    const shuffledData = [...data];
    for (let i = shuffledData.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
    }
    const selected = shuffledData.slice(0, numberOfDraws);
    setSelectedUsers(selected);
    console.log("抽籤結果:", selected);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Draw Member</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogDescription asChild>
            <div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(drawHandler)} className="space-y-8 w-20 flex items-center">
                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number</FormLabel>
                        <FormControl>
                          <Input type="number" max={data.length} min={1} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="ml-4">
                    Draw
                  </Button>
                </form>
              </Form>
              {selectedUsers.length > 0 && (
                <div className="mt-4">
                  <p>Drawing results</p>
                  <ul>
                    {selectedUsers.map((user) => (
                      <div key={user.userId} className="flex items-center m-4">
                        <p className="text-xl">{user.name}</p>
                      </div>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default Draw;
