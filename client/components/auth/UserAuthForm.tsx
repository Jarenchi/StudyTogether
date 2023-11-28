"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInForm from "./signin/SignInForm";
import SignUpForm from "./signup/SignUpForm";

export default function UserAuthForm() {
  const [tab, setTab] = useState("signin");
  const onTabChange = (value: string) => {
    setTab(value);
  };
  return (
    <Tabs defaultValue={tab} onValueChange={onTabChange} className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="signin">
        <SignInForm />
      </TabsContent>
      <TabsContent value="signup">
        <SignUpForm tabChange={onTabChange} />
      </TabsContent>
    </Tabs>
  );
}
