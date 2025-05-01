import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Changed font
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" }); // Setup Inter font

export const metadata: Metadata = {
  title: "Ace Showdown", // Updated title
  description: "A simple card game against the computer.", // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">{/* Apply dark theme globally */}
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster /> {/* Add Toaster here */}
      </body>
    </html>
  );
}
