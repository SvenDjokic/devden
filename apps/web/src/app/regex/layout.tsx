import type { Metadata } from "next";
import { NavigationProvider } from "@/components/shared/navigation";

export const metadata: Metadata = {
  title: "Regex Tester - Free Online Regular Expression Tool",
  description:
    "Free online regex tester and debugger. Test regular expressions with real-time matching, capture groups, and common patterns library. 100% client-side.",
  keywords: ["regex tester", "regular expression", "regex debugger", "pattern matching", "regex online"],
  openGraph: {
    type: "website",
    url: "https://devden.dev/regex",
    title: "Regex Tester - Free Online Regular Expression Tool | DevDen",
    description: "Free online regex tester and debugger. Test regular expressions with real-time matching.",
    siteName: "DevDen",
  },
};

export default function RegexLayout({ children }: { children: React.ReactNode }) {
  return <NavigationProvider currentToolId="regex">{children}</NavigationProvider>;
}
