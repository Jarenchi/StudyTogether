"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import nookies from "nookies";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useUserStore from "@/stores/userStore";

const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, { message: "Confirm Password is required" }),
});

const SignInForm = () => {
  const router = useRouter();
  const setUserId = useUserStore((state) => state.setUserId);
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(values: z.infer<typeof signInSchema>) {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/signin`, {
        email: values.email,
        password: values.password,
      });
      const userData = response.data.data;
      const maxAge = { maxAge: 3600 }; // 1hr
      nookies.set(null, "access_token", userData.access_token, maxAge);
      nookies.set(null, "user_id", userData.user.id.toString(), maxAge);
      nookies.set(null, "user_name", userData.user.name, maxAge);
      nookies.set(null, "user_email", userData.user.email, maxAge);
      nookies.set(null, "user_image", userData.user.image, maxAge);
      setUserId(userData.user.id.toString());
      router.back();
    } catch (error: any) {
      if (error?.response?.status === 401) {
        alert("信箱或密碼錯誤");
      }
      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        alert("請稍後再試或和我們的技術團隊聯絡");
      } else {
        alert(error);
      }
    }
  }

  return (
    <Card>
      <CardContent>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Enter your email and password</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="test@test.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="dark:text-white">
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SignInForm;
