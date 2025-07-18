import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Office Management",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <div className="">
          <Header />
          {/* Push content down so it doesn't go behind the fixed header */}
          <main className="pt-24 px-4">
            <Breadcrumbs />

            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
