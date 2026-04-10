import type { Metadata } from "next";
import "./globals.css";

// Import @fontsource fonts for production reliability
import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/900.css";
import "@fontsource/great-vibes/400.css";

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
