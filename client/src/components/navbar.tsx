import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        <div className="font-semibold text-lg">YourApp</div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}