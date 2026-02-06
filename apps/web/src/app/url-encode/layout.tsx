import type { Metadata } from "next";
import { NavigationProvider } from "@/components/url-encode/navigation/NavigationProvider";

export const metadata: Metadata = {
  title: "URL Encoder/Decoder - Free Online Tool",
  description:
    "Free online URL encoder and decoder. Encode special characters for URLs or decode percent-encoded strings. 100% client-side.",
  keywords: ["url encoder", "url decoder", "percent encoding", "urlencode", "url escape"],
  openGraph: {
    type: "website",
    url: "https://devden.dev/url-encode",
    title: "URL Encoder/Decoder - Free Online Tool | DevDen",
    description: "Free online URL encoder and decoder. Encode and decode URLs instantly.",
    siteName: "DevDen",
  },
};

export default function UrlEncodeLayout({ children }: { children: React.ReactNode }) {
  return <NavigationProvider>{children}</NavigationProvider>;
}
