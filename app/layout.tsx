import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Collabio - Workspace Platform",
  description: "A modern workspace platform for collaboration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
