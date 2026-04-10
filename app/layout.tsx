import type { Metadata } from "next";
import "./globals.css";

// Fonts are now self-hosted in public/fonts to ensure reliability on all servers.

export const metadata: Metadata = {
  title: "Bali Inspired Digital Invitation",
  description: "Digital Invitation with Balinese Aesthetics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="antialiased font-inter">
        {children}
      </body>
    </html>
  );
}
