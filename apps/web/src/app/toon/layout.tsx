import type { Metadata } from "next";
import { NavigationProvider } from "@/components/toon/navigation/NavigationProvider";

export const metadata: Metadata = {
  title: "TOON Converter - JSON to TOON Format",
  description:
    "Free online TOON converter. Convert JSON to TOON format for optimized LLM token usage. Reduce token count while preserving data structure.",
  keywords: ["toon converter", "json to toon", "token optimization", "llm format", "toon format"],
  openGraph: {
    type: "website",
    url: "https://devden.dev/toon",
    title: "TOON Converter - JSON to TOON Format | DevDen",
    description: "Free online TOON converter. Optimize your data for LLMs.",
    siteName: "DevDen",
  },
};

export default function ToonLayout({ children }: { children: React.ReactNode }) {
  return <NavigationProvider>{children}</NavigationProvider>;
}
