import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="container-devden py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              &copy; {currentYear} DevDen. Free developer tools.
            </span>
          </div>
          {/* Privacy/Terms - TODO: add when policies are created */}
        </div>
      </div>
    </footer>
  );
}
