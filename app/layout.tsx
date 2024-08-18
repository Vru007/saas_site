import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

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
    <ClerkProvider>
    <html lang="en">
         <body>
         <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <main className={cn("font-IBMPlexSans antialiased",IBMPlexSans.variable)}>{children}</main>
        </body>
     
    </html>
    </ClerkProvider>
  );
}
