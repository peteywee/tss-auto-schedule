import type { Metadata } from "next";
import "./globals.css";

// Fail-fast env validation on server startup/render.
// Import is safe even if optional fields are unset.
import { env } from "@/config/env";

export const metadata: Metadata = {
  title: "TSS Auto Schedule",
  description: "Top Shelf Service Auto Schedule",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Touch env to ensure tree-shaking doesn't drop it in some builds
  void env;

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
