import { Inter as FontSans } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/theme-provider";

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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
