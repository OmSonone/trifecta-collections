import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

// Using Geist as a temporary font - replace with your custom font later
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trifecta Collections - Custom Car Models",
  description: "Get your custom car model made to perfection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
