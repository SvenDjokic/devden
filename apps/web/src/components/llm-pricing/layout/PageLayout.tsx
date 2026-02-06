import { Header } from "./Header";
import { Footer } from "./Footer";

interface PageLayoutProps {
  children: React.ReactNode;
  toolName?: string;
}

export function PageLayout({ children, toolName }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header toolName={toolName} />
      <main className="flex-1">
        <div className="container-devden py-8">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
