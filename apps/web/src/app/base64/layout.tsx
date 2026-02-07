import type { Metadata } from "next";
import { NavigationProvider } from "@/components/shared/navigation";

export const metadata: Metadata = {
  title: "Base64 Encoder/Decoder - Free Online Base64 Tool",
  description:
    "Encode text to Base64 or decode Base64 to text instantly. Auto-detect mode, keyboard shortcuts. 100% client-side — your data never leaves your browser.",
  keywords: [
    "Base64 encoder",
    "Base64 decoder",
    "encode Base64 online",
    "decode Base64 online",
    "Base64 converter",
    "Base64 tool",
    "developer tools",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://devden.dev/base64",
    title: "Base64 Encoder/Decoder - Free Online Base64 Tool | DevDen",
    description:
      "Encode text to Base64 or decode Base64 to text instantly. Auto-detect mode, keyboard shortcuts. 100% client-side — your data never leaves your browser.",
    siteName: "DevDen",
    images: [
      {
        url: "/og?tool=base64",
        width: 1200,
        height: 630,
        alt: "DevDen Base64 Encoder/Decoder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Base64 Encoder/Decoder - Free Online Base64 Tool | DevDen",
    description:
      "Encode text to Base64 or decode Base64 to text instantly. Auto-detect mode, keyboard shortcuts. 100% client-side — your data never leaves your browser.",
    images: ["/og?tool=base64"],
  },
};

export default function Base64Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <NavigationProvider currentToolId="base64">{children}</NavigationProvider>;
}
