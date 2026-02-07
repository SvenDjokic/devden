import type { Metadata } from "next";
import { NavigationProvider } from "@/components/shared/navigation";

export const metadata: Metadata = {
  title: "JSON Formatter - Free Online JSON Beautifier",
  description:
    "Free online JSON formatter and validator. Beautify, minify, and fix broken JSON instantly. 100% client-side — your data never leaves your browser. Fast & private.",
  keywords: [
    "JSON formatter",
    "JSON beautifier",
    "format JSON online",
    "JSON validator",
    "pretty print JSON",
    "JSON tool",
    "developer tools",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://devden.dev/json",
    title: "JSON Formatter - Free Online JSON Beautifier | DevDen",
    description:
      "Free online JSON formatter and validator. Beautify, minify, and fix broken JSON instantly. 100% client-side — your data never leaves your browser.",
    siteName: "DevDen",
    images: [
      {
        url: "/og?tool=json-formatter",
        width: 1200,
        height: 630,
        alt: "DevDen JSON Formatter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Formatter - Free Online JSON Beautifier | DevDen",
    description:
      "Free online JSON formatter and validator. Beautify, minify, and fix broken JSON instantly. 100% client-side — your data never leaves your browser.",
    images: ["/og?tool=json-formatter"],
  },
};

export default function JsonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <NavigationProvider currentToolId="json-formatter">{children}</NavigationProvider>;
}
