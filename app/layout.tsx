import type { Metadata } from "next";
import "./globals.css";

// Import @fontsource fonts for production reliability
import "@fontsource/inter"; // Loads 400 by default
import "@fontsource/inter/700.css";
import "@fontsource/playfair-display"; // Loads 400 by default
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/900.css";
import "@fontsource/great-vibes"; // Loads 400 by default

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
