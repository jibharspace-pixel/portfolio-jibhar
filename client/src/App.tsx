import { Switch, Route, useLocation } from "wouter";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/lib/language-context";
import Home from "@/pages/home";
import Projects from "@/pages/projects";
import Blog from "@/pages/blog";
import BlogPostPage from "@/pages/blog-post";
import Resources from "@/pages/resources";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

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
    const clear = () => { if (timerRef.current) clearTimeout(timerRef.current); };
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

// ── Page transition variants ──────────────────────────────────────────────────
const pageVariants = {
  initial: (dir: 'forward' | 'back') => ({
    opacity: 0,
    x: dir === 'forward' ? 48 : -48,
  }),
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
  },
  exit: (dir: 'forward' | 'back') => ({
    opacity: 0,
    x: dir === 'forward' ? -48 : 48,
    transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
  }),
};

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
      prevLocation.current = location;
      setTrigger((t) => t + 1);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location]);

  return (
    <>
      <ProgressBar trigger={trigger} />
      <AnimatePresence mode="wait" custom={navDir}>
        <motion.div
          key={location}
          custom={navDir}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ willChange: "transform, opacity" }}
        >
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/projets" component={Projects} />
            <Route path="/blog" component={Blog} />
            <Route path="/blog/:slug">
              {(params: Record<string, string>) => <BlogPostPage slug={params.slug} />}
            </Route>
            <Route path="/ressources" component={Resources} />
            <Route path="/apropos" component={About} />
            <Route path="/contact" component={Contact} />
            <Route path="/admin" component={Admin} />
            <Route component={NotFound} />
          </Switch>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <AnimatedRouter />
          </TooltipProvider>
        </QueryClientProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
