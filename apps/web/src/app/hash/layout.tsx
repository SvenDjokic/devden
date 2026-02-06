import type { Metadata } from "next";
import { NavigationProvider } from "@/components/hash/navigation/NavigationProvider";

export const metadata: Metadata = {
  title: "Hash Generator - MD5, SHA-256, SHA-512 Online",
  description:
    "Free online hash generator. Generate MD5, SHA-1, SHA-256, SHA-512 hashes from text or files. 100% client-side — your data never leaves your browser.",
  keywords: ["hash generator", "md5 hash", "sha256", "sha512", "checksum", "file hash"],
  openGraph: {
    type: "website",
    url: "https://devden.dev/hash",
    title: "Hash Generator - MD5, SHA-256, SHA-512 Online | DevDen",
    description: "Free online hash generator. Generate hashes instantly.",
    siteName: "DevDen",
  },
};

export default function HashLayout({ children }: { children: React.ReactNode }) {
  return <NavigationProvider>{children}</NavigationProvider>;
}
