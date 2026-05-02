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

function ProgressBar({ trigger }: { trigger: number }) {
  const [visible, setVisible] = useState(false);
  const keyRef = useRef(0);

  useEffect(() => {
    if (trigger === 0) return;
    keyRef.current += 1;
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 10);
    const t2 = setTimeout(() => setVisible(false), 600);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [trigger]);

  if (!visible) return null;
  return <div key={keyRef.current} className="page-progress-bar" />;
}

function AnimatedRouter() {
  const [location] = useLocation();
  const [trigger, setTrigger] = useState(0);
  const prevLocation = useRef(location);

  useEffect(() => {
    if (location !== prevLocation.current) {
      prevLocation.current = location;
      setTrigger(t => t + 1);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location]);

  return (
    <>
      <ProgressBar trigger={trigger} />
      <div key={location} className="page-enter">
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

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="portfolio-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <AnimatedRouter />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
