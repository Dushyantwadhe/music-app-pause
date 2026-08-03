import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Riyaaz — Indian Music Practice Companion",
  description: "The best daily practice companion for Indian classical, devotional, and light music learners.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`} data-scroll-behavior="smooth">
      <body
        className="min-h-screen flex flex-col"
        style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
      >
        {children}
      </body>
    </html>
  );
}






