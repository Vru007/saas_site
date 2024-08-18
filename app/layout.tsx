import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const IBMPlexSans = IBM_Plex_Sans({ 
  subsets: ["latin"],
  weight:['400', '500','600','700'],
  variable:'--font-ibm-plex'
 });

export const metadata: Metadata = {
  title: "Imaginator",
  description: "AI-Powered image generating platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("font-IBMPlexSans antialiased",IBMPlexSans.variable)}>{children}</body>
    </html>
  );
}
