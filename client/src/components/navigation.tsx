import { useState, useEffect } from "react";
import { Menu, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link, useLocation } from "wouter";

const navItems = [
  { label: "Accueil", href: "/" },
  { label: "Projets", href: "/projets" },
  { label: "Blog", href: "/blog" },
  { label: "Ressources", href: "/ressources" },
  { label: "À propos", href: "/apropos" },
  { label: "Contact", href: "/contact" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/92 dark:bg-background/92 backdrop-blur-xl border-b border-border/60 shadow-sm"
          : "bg-transparent"
      }`}
      data-testid="navigation-header"
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0" data-testid="link-logo">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-nexalion text-white font-serif font-bold text-sm shadow-sm">
              KJS
            </div>
            <span className="hidden md:block font-serif font-semibold text-foreground tracking-tight text-[15px]">
              Kroman Jibhar Samuel
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <button
                  className={`relative px-3.5 py-2 text-[13.5px] font-medium rounded-md transition-all duration-150 ${
                    isActive(item.href)
                      ? "text-primary bg-primary/8"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                  data-testid={`link-nav-${item.label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3.5 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
            <Button
              size="sm"
              className="hidden sm:flex items-center gap-1.5 bg-nexalion hover:opacity-90 shadow-sm font-medium text-[13px] h-8 px-3"
              data-testid="button-download-cv"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Télécharger CV</span>
              <span className="md:hidden">CV</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden w-9 h-9"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/97 dark:bg-background/97 backdrop-blur-xl border-b border-border shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <button
                  className={`w-full flex items-center px-4 py-2.5 rounded-md text-sm font-medium text-left transition-colors ${
                    isActive(item.href)
                      ? "text-primary bg-primary/8"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                  data-testid={`link-mobile-${item.label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`}
                >
                  {item.label}
                </button>
              </Link>
            ))}
            <div className="pt-2 mt-1 border-t border-border">
              <Button className="w-full bg-nexalion hover:opacity-90 font-medium text-sm" data-testid="button-mobile-download-cv">
                <Download className="w-3.5 h-3.5 mr-2" />
                Télécharger CV
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
