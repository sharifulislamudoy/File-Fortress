// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import InitialLoader from "@/components/InitialLoader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FileFortress - Secure Cloud Storage",
  description: "End-to-end encrypted file storage with voice control",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <InitialLoader>
          <AuthProvider>{children}</AuthProvider>
        </InitialLoader>
      </body>
    </html>
  );
}