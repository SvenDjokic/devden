import type { Metadata, Viewport } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090b",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://devden.dev"),
  title: {
    default: "DevDen - Free Developer Tools",
    template: "%s | DevDen",
  },
  description:
    "Free online developer tools. JSON formatter, Base64 encoder, Regex tester, and more. 100% client-side - your data never leaves your browser.",
  authors: [{ name: "DevDen" }],
  creator: "DevDen",
  publisher: "DevDen",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: { url: "/icon.svg", type: "image/svg+xml" },
    apple: "/icon.svg",
  },
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
