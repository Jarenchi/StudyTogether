import Header from "@/components/header/Header";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import TanstackProvider from "@/providers/tanstackProvider";
import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "StudyTogether",
  description: "A study group website",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TanstackProvider>
            <main>
              <Header />
              {children}
              <Toaster />
            </main>
          </TanstackProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
