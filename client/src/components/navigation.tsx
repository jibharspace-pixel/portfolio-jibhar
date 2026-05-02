import { useState, useEffect } from "react";
import { Menu, X, Download, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link, useLocation } from "wouter";

const navItems = [
  { label: "Accueil", href: "/" },
  { label: "Projets", href: "/projets" },
  { label: "À propos", href: "/apropos" },
  { label: "Contact", href: "/contact" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location === href;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
      data-testid="navigation-header"
    >
      <nav className="max-w-7xl mx-auto px-6 py-3.5">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2.5"
            data-testid="link-logo"
          >
            <div
              className="flex items-center justify-center w-10 h-10 rounded-2xl font-serif font-bold text-lg text-white shadow-lg"
              style={{
                background: "linear-gradient(135deg, hsl(258,80%,58%), hsl(200,80%,55%))",
                boxShadow: "0 4px 14px hsl(258,80%,58%,0.4)",
              }}
            >
              KJS
            </div>
            <span className="hidden md:block font-serif font-bold text-foreground">
              Kroman Jibhar Samuel
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1 bg-muted/60 rounded-full px-2 py-1.5 border border-border/50 backdrop-blur-sm">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <button
                  className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? "text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={isActive(item.href) ? {
                    background: "linear-gradient(135deg, hsl(258,80%,58%), hsl(200,80%,55%))",
                    boxShadow: "0 2px 10px hsl(258,80%,58%,0.35)",
                  } : {}}
                  data-testid={`link-nav-${item.label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`}
                >
                  {item.label}
                </button>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="default"
              size="sm"
              className="hidden sm:flex items-center gap-2 rounded-full px-5 font-semibold shadow-md transition-all hover:scale-105"
              style={{ boxShadow: "0 4px 14px hsl(258,80%,58%,0.35)" }}
              data-testid="button-download-cv"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Télécharger CV</span>
              <span className="md:hidden">CV</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-xl"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <button
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-left transition-all ${
                      isActive(item.href)
                        ? "text-white font-semibold"
                        : "hover:bg-muted"
                    }`}
                    style={isActive(item.href) ? {
                      background: "linear-gradient(135deg, hsl(258,80%,58%), hsl(200,80%,55%))",
                    } : {}}
                    data-testid={`link-mobile-${item.label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`}
                  >
                    <span className="font-medium">{item.label}</span>
                    <ChevronRight className="w-4 h-4 opacity-60" />
                  </button>
                </Link>
              ))}
              <div className="pt-2 border-t border-border mt-2">
                <Button
                  variant="default"
                  className="w-full flex items-center justify-center gap-2 rounded-full font-semibold"
                  data-testid="button-mobile-download-cv"
                >
                  <Download className="w-4 h-4" />
                  Télécharger CV
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
