import { publicPath } from "@/config/deployment";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { site } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  icons: {
    icon: publicPath("/favicon.svg"),
    shortcut: publicPath("/favicon.svg"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
