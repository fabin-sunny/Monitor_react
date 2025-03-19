import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google"; // 🔹 Using Inter as Geist is unavailable in next/font/google
import "./globals.css";


// Define fonts with correct subsets
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const mono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "System Monitoring",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${mono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
