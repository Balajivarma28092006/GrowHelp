import { Link, useLocation } from "react-router-dom";
import { Sprout, PenLine, Clock, Lightbulb, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export const Header = () => {
  const location = useLocation();

  const links = [
    { to: "/", label: "Home", icon: Sprout },
    { to: "/new", label: "New Entry", icon: PenLine },
    { to: "/history", label: "History", icon: Clock },
    { to: "/lessons", label: "Lessons", icon: Lightbulb },
    { to: "/trends", label: "Trends", icon: TrendingUp },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Sprout className="w-6 h-6 text-primary transition-transform group-hover:scale-110" />
            <span className="text-xl font-serif font-semibold">Growth Diary</span>
          </Link>

          <div className="flex items-center gap-1 md:gap-2">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg transition-all",
                  "hover:bg-primary/10 hover:text-primary",
                  location.pathname === to
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};
