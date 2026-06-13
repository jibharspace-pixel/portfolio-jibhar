import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      data-testid="button-theme-toggle"
      aria-label="Basculer le thème"
      className="relative flex items-center gap-1.5 h-8 px-2.5 rounded-md border border-border/60 text-xs font-semibold text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-150 overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="dark"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-1.5"
          >
            <Sun className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Clair</span>
          </motion.span>
        ) : (
          <motion.span
            key="light"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-1.5"
          >
            <Moon className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Sombre</span>
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
