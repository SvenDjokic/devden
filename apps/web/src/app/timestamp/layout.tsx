import type { Metadata } from "next";
import { NavigationProvider } from "@/components/shared/navigation";

export const metadata: Metadata = {
  title: "Unix Timestamp Converter - Epoch to Date Online | DevDen",
  description:
    "Free online Unix timestamp converter. Convert epoch time to human-readable dates or dates to timestamps instantly. Timezone support, live clock, keyboard shortcuts. 100% client-side.",
  keywords: [
    "Unix timestamp converter",
    "epoch converter",
    "timestamp to date",
    "date to timestamp",
    "epoch time",
    "Unix time",
    "timestamp converter online",
    "developer tools",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://devden.dev/timestamp",
    title: "Unix Timestamp Converter - Epoch to Date Online | DevDen",
    description:
      "Free online Unix timestamp converter. Convert epoch time to human-readable dates or dates to timestamps. Timezone support, live clock. 100% client-side.",
    siteName: "DevDen",
    images: [
      {
        url: "/og?tool=timestamp",
        width: 1200,
        height: 630,
        alt: "DevDen Unix Timestamp Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unix Timestamp Converter - Epoch to Date Online | DevDen",
    description:
      "Free online Unix timestamp converter. Convert epoch time to human-readable dates or dates to timestamps. 100% client-side.",
    images: ["/og?tool=timestamp"],
  },
};

export default function TimestampLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <NavigationProvider currentToolId="timestamp">{children}</NavigationProvider>;
}
