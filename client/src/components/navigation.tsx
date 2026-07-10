import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Download, Globe, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/lib/language-context";
import { DevisDialog } from "@/components/devis-dialog";
import { useQuery } from "@tanstack/react-query";

interface SiteContent { cv_url?: string; }


export function Navigation() {
  const { lang, setLang, t } = useLanguage();
  const { data: siteContent } = useQuery<SiteContent>({ queryKey: ["/api/site-content"] });
  const cvUrl = siteContent?.cv_url;
  const [isScrolled, setIsScrolled]         = useState(false);
  const [isMobileMenuOpen, setMobileOpen]   = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [location]                          = useLocation();
  const navRef                              = useRef<HTMLDivElement>(null);

  const navItems = [
    { label: t.nav.home,      href: "/" },
    { label: t.nav.projects,  href: "/projets" },
    { label: t.nav.blog,      href: "/blog" },
    { label: t.nav.resources, href: "/ressources" },
    { label: t.nav.about,     href: "/apropos" },
    { label: t.nav.contact,   href: "/contact" },
  ];

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
  }, [location, lang]);

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  const toggleLang = () => setLang(lang === "fr" ? "en" : "fr");

  return (
    <header
      className={`nav-header fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "nav-header--scrolled" : ""
      }`}
      data-testid="navigation-header"
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[60px] gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0" data-testid="link-logo">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-nexalion text-white font-serif font-bold text-xs shadow-sm select-none"
            >
              KJS
            </motion.div>
            <span className="hidden md:block font-serif font-semibold text-foreground tracking-tight text-[14px]">
              Kroman Jibhar Samuel
            </span>
          </Link>

          {/* Desktop nav */}
          <div ref={navRef} className="hidden lg:flex items-center gap-0.5 relative">
            <span
              className="nav-indicator absolute top-1 bottom-1 rounded-md bg-primary/8 pointer-events-none"
              style={{ left: indicatorStyle.left, width: indicatorStyle.width, opacity: indicatorStyle.opacity }}
            />
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <button
                  data-active={isActive(item.href) ? "true" : "false"}
                  className={`relative px-3.5 py-2 text-[13px] font-medium rounded-md transition-colors duration-150 z-10 ${
                    isActive(item.href)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`link-nav-${item.href === "/" ? "accueil" : item.href.replace("/", "")}`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span className="absolute bottom-0.5 left-3 right-3 h-[2px] bg-primary rounded-full nav-active-line" />
                  )}
                </button>
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Language toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 h-8 px-2.5 rounded-md border border-border/60 text-xs font-bold text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-150"
              data-testid="button-lang-toggle"
              aria-label="Switch language"
            >
              <Globe className="w-3 h-3 shrink-0" />
              <span>{lang === "fr" ? "EN" : "FR"}</span>
            </button>
            <ThemeToggle />
            <DevisDialog trigger={
              <Button
                size="sm"
                variant="outline"
                className="hidden sm:flex items-center gap-1.5 border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 font-medium text-[13px] h-8 px-3"
                data-testid="button-nav-devis"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{lang === "fr" ? "Devis" : "Quote"}</span>
              </Button>
            } />
            {cvUrl ? (
              <a href={cvUrl} download target="_blank" rel="noopener noreferrer">
                <Button
                  size="sm"
                  className="hidden sm:flex items-center gap-1.5 bg-nexalion hover:opacity-90 shadow-sm font-medium text-[13px] h-8 px-3"
                  data-testid="button-download-cv"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{t.nav.downloadCv}</span>
                  <span className="md:hidden">{t.nav.cv}</span>
                </Button>
              </a>
            ) : (
              <Button
                size="sm"
                disabled
                className="hidden sm:flex items-center gap-1.5 bg-nexalion opacity-50 shadow-sm font-medium text-[13px] h-8 px-3 cursor-not-allowed"
                data-testid="button-download-cv"
                title="Aucun CV chargé"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{t.nav.downloadCv}</span>
                <span className="md:hidden">{t.nav.cv}</span>
              </Button>
            )}
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

      {/* Mobile menu — slide-in panel from right */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden fixed top-0 right-0 bottom-0 z-50 w-[min(300px,85vw)] bg-background border-l border-border/60 shadow-2xl flex flex-col"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between px-6 h-[60px] border-b border-border/40 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-nexalion text-white font-serif font-bold text-xs flex items-center justify-center shadow-sm">KJS</div>
                  <span className="font-serif font-semibold text-foreground text-[13px]">Menu</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Nav items */}
              <nav className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-1">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link href={item.href}>
                      <button
                        type="button"
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-all duration-150 ${
                          isActive(item.href)
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                        data-active={isActive(item.href) ? "true" : "false"}
                        data-testid={`link-mobile-${item.href === "/" ? "accueil" : item.href.replace("/", "")}`}
                      >
                        <span className={`w-2 h-2 rounded-full shrink-0 transition-all duration-200 ${isActive(item.href) ? "bg-primary" : "bg-border"}`} />
                        <span className={isActive(item.href) ? "font-semibold" : ""}>{item.label}</span>
                        {isActive(item.href) && (
                          <ArrowRight className="w-3.5 h-3.5 ml-auto text-primary/60" />
                        )}
                      </button>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Panel footer */}
              <div className="px-4 pb-6 pt-4 border-t border-border/40 flex flex-col gap-2 shrink-0">
                {cvUrl ? (
                  <a href={cvUrl} download target="_blank" rel="noopener noreferrer" className="block">
                    <Button className="w-full bg-nexalion hover:opacity-90 font-medium text-sm" data-testid="button-mobile-download-cv">
                      <Download className="w-3.5 h-3.5 mr-2" />
                      {t.nav.downloadCv}
                    </Button>
                  </a>
                ) : (
                  <Button disabled className="w-full bg-nexalion opacity-50 font-medium text-sm" data-testid="button-mobile-download-cv">
                    <Download className="w-3.5 h-3.5 mr-2" />
                    {t.nav.downloadCv}
                  </Button>
                )}
                <button
                  type="button"
                  onClick={toggleLang}
                  className="flex items-center justify-center gap-2 h-9 rounded-lg border border-border/60 text-sm font-bold text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all"
                  data-testid="button-mobile-lang-toggle"
                >
                  <Globe className="w-3.5 h-3.5" />
                  {lang === "fr" ? "Passer en EN" : "Switch to FR"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
