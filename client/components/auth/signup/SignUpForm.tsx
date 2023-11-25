"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const signInSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(6, "密碼需大於6個字元")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, "密碼須包含大小寫和數字"),
    confirmPassword: z.string().min(1, { message: "Confirm Password is required" }),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "密碼不相符",
    path: ["confirmPassword"],
  });
const SignUpForm = () => {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  // const [open, setOpen] = useState(false);
  // const [message, setMessage] = useState("");

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/signup`, {
        name: values.name,
        email: values.email,
        password: values.password,
      });
      alert("註冊成功");
    } catch (error: any) {
      if (error.response.status === 404) {
        console.log("此信箱已註冊");
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
          <CardTitle>Create an account </CardTitle>
          <CardDescription>Enter your data below to create your account</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jaren Chang" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="dark:text-white">
              Sign Up
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
export default SignUpForm;
