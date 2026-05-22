import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nimo — Your Personal Vault",
  description: "Secure file manager with voice assistant",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#030a06]">{children}</body>
    </html>
  );
}