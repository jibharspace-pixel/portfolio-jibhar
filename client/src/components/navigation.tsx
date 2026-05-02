import { useState, useEffect, useRef } from "react";
import { Menu, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link, useLocation } from "wouter";

const navItems = [
  { label: "Accueil",    href: "/" },
  { label: "Projets",    href: "/projets" },
  { label: "Blog",       href: "/blog" },
  { label: "Ressources", href: "/ressources" },
  { label: "À propos",   href: "/apropos" },
  { label: "Contact",    href: "/contact" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled]         = useState(false);
  const [isMobileMenuOpen, setMobileOpen]   = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [location]                          = useLocation();
  const navRef                              = useRef<HTMLDivElement>(null);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile on route change
  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);

  // Sliding indicator
  useEffect(() => {
    if (!navRef.current) return;
    const activeBtn = navRef.current.querySelector<HTMLButtonElement>("[data-active='true']");
    if (!activeBtn) {
      setIndicatorStyle((s) => ({ ...s, opacity: 0 }));
      return;
    }
    const navRect  = navRef.current.getBoundingClientRect();
    const btnRect  = activeBtn.getBoundingClientRect();
    setIndicatorStyle({
      left:    btnRect.left - navRect.left,
      width:   btnRect.width,
      opacity: 1,
    });
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
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-nexalion text-white font-serif font-bold text-sm shadow-sm select-none">
              KJS
            </div>
            <span className="hidden md:block font-serif font-semibold text-foreground tracking-tight text-[15px]">
              Kroman Jibhar Samuel
            </span>
          </Link>

          {/* Desktop nav — with sliding indicator */}
          <div ref={navRef} className="hidden lg:flex items-center gap-0.5 relative">
            {/* Sliding background pill */}
            <span
              className="absolute top-1 bottom-1 rounded-md bg-primary/8 pointer-events-none"
              style={{
                left:    indicatorStyle.left,
                width:   indicatorStyle.width,
                opacity: indicatorStyle.opacity,
                transition: "left 300ms cubic-bezier(0.34,1.2,0.64,1), width 250ms cubic-bezier(0.34,1.2,0.64,1), opacity 200ms ease",
              }}
            />
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <button
                  data-active={isActive(item.href) ? "true" : "false"}
                  className={`relative px-3.5 py-2 text-[13.5px] font-medium rounded-md transition-colors duration-150 z-10 ${
                    isActive(item.href)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`link-nav-${item.label
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, "")}`}
                >
                  {item.label}
                  {/* Active underline — grows from center */}
                  {isActive(item.href) && (
                    <span className="absolute bottom-0.5 left-3 right-3 h-[2px] bg-primary rounded-full nav-active-line" />
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
              onClick={() => setMobileOpen((o) => !o)}
              data-testid="button-mobile-menu"
            >
              <span className={`transition-all duration-200 ${isMobileMenuOpen ? "rotate-90 opacity-0 absolute" : "rotate-0 opacity-100"}`}>
                <Menu className="w-4 h-4" />
              </span>
              <span className={`transition-all duration-200 ${isMobileMenuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0 absolute"}`}>
                <X className="w-4 h-4" />
              </span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile menu — animated */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/97 dark:bg-background/97 backdrop-blur-xl border-b border-border shadow-lg mobile-menu-enter">
          <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col gap-0.5">
            {navItems.map((item, i) => (
              <Link key={item.href} href={item.href}>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-left transition-colors mobile-menu-item`}
                  style={{ animationDelay: `${i * 30}ms` }}
                  data-active={isActive(item.href) ? "true" : "false"}
                  data-testid={`link-mobile-${item.label
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, "")}`}
                >
                  {isActive(item.href) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  )}
                  <span className={isActive(item.href) ? "text-primary font-semibold" : "text-muted-foreground"}>
                    {item.label}
                  </span>
                </button>
              </Link>
            ))}
            <div className="pt-2 mt-1 border-t border-border">
              <Button
                className="w-full bg-nexalion hover:opacity-90 font-medium text-sm"
                data-testid="button-mobile-download-cv"
              >
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
