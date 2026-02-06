import Link from "next/link";

interface HeaderProps {
  toolName?: string;
}

export function Header({ toolName }: HeaderProps) {
  return (
    <header className="border-b border-border bg-background">
      <div className="container-devden flex h-12 sm:h-14 items-center justify-between">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-lg sm:text-xl font-semibold text-primary font-sans">DevDen</span>
          </Link>
          {toolName && (
            <>
              <span className="text-muted-foreground shrink-0">/</span>
              <span className="text-sm sm:text-lg font-medium truncate font-sans">{toolName}</span>
            </>
          )}
        </div>
        <nav className="flex items-center gap-4 shrink-0">
          <a
            href="https://json.devden.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
          >
            All Tools
          </a>
        </nav>
      </div>
    </header>
  );
}
