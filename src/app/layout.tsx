import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "2077日报 — DISPATCH FROM THE FUTURE",
  description: "来自2077年的疯狂新闻社区。疯子写的，先知读的。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${mono.variable} font-mono antialiased scan-line`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
