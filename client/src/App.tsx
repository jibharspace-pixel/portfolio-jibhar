import { Switch, Route, useLocation } from "wouter";
import { useEffect, useRef, useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "@/pages/home";
import Projects from "@/pages/projects";
import Blog from "@/pages/blog";
import BlogPostPage from "@/pages/blog-post";
import Resources from "@/pages/resources";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

// ── Navigation order for direction detection ───────────────────────────────────
const PAGE_ORDER = ['/', '/projets', '/blog', '/ressources', '/apropos', '/contact', '/admin'];

function getPageBase(path: string) {
  const segs = path.split('/').filter(Boolean);
  return segs.length === 0 ? '/' : '/' + segs[0];
}

function getNavDir(from: string, to: string): 'forward' | 'back' {
  const fi = PAGE_ORDER.indexOf(getPageBase(from));
  const ti = PAGE_ORDER.indexOf(getPageBase(to));
  if (fi === -1 || ti === -1) return 'forward';
  return ti >= fi ? 'forward' : 'back';
}

// ── Top progress bar ──────────────────────────────────────────────────────────
function ProgressBar({ trigger }: { trigger: number }) {
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (trigger === 0) return;
    const clear = () => timerRef.current && clearTimeout(timerRef.current);
    clear();
    setPhase("running");
    timerRef.current = setTimeout(() => {
      setPhase("done");
      timerRef.current = setTimeout(() => setPhase("idle"), 380);
    }, 480);
    return clear;
  }, [trigger]);

  if (phase === "idle") return null;

  return (
    <div
      className={`page-progress-bar ${phase === "done" ? "page-progress-bar--done" : ""}`}
      key={trigger}
    />
  );
}

// ── View Transitions interceptor ─────────────────────────────────────────────
function ViewTransitionNavigator() {
  const [location, setLocation] = useLocation();
  const locationRef = useRef(location);

  useEffect(() => { locationRef.current = location; }, [location]);

  useEffect(() => {
    const supportsVT = "startViewTransition" in document;
    if (!supportsVT) return;

    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (
        !href ||
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#")
      ) return;

      e.preventDefault();
      const dir = getNavDir(locationRef.current, href);
      document.documentElement.dataset.navDir = dir;

      (document as any).startViewTransition(() => {
        setLocation(href);
        window.scrollTo({ top: 0, behavior: "instant" });
      });
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, [setLocation]);

  return null;
}

// ── Animated page router ──────────────────────────────────────────────────────
function AnimatedRouter() {
  const [location] = useLocation();
  const [trigger, setTrigger] = useState(0);
  const [navDir, setNavDir] = useState<'forward' | 'back'>('forward');
  const prevLocation = useRef(location);

  useEffect(() => {
    if (location !== prevLocation.current) {
      const dir = getNavDir(prevLocation.current, location);
      setNavDir(dir);
      document.documentElement.dataset.navDir = dir;
      prevLocation.current = location;
      setTrigger((t) => t + 1);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location]);

  return (
    <>
      <ProgressBar trigger={trigger} />
      <div key={location} className={`page-enter page-enter-${navDir}`}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/projets" component={Projects} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug">
            {(params) => <BlogPostPage slug={(params as any).slug} />}
          </Route>
          <Route path="/ressources" component={Resources} />
          <Route path="/apropos" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="portfolio-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <ViewTransitionNavigator />
          <AnimatedRouter />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
