import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { cn } from "@/lib/utils";

import "./globals.css";
import { QueryProvider } from "@/components/query-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Toaster } from "@/components/ui/sonner";



const inter = Inter({
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Taskit",
  description: "Manage your day and projects at one place",
  icons: {
    icon: [
      {
        url: "./logo.svg",
        href: "./logo.svg"
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(inter.className, "antialiased")}
      >
        <NuqsAdapter>
          <SessionProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <QueryProvider>
                <Toaster />
                {children}
              </QueryProvider>
            </ThemeProvider>
          </SessionProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
