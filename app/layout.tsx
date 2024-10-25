import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { cn } from "@/lib/utils";

import "./globals.css";
import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "sonner";

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
        <QueryProvider>
          <Toaster />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
