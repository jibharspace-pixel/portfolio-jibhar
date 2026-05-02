import { ExternalLink } from "lucide-react";

const techStack = ["React", "TypeScript", "Tailwind CSS", "Rust · Axum"];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-muted/30" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">

          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-nexalion text-white font-serif font-bold text-xs shadow-sm">
              KJS
            </div>
            <div>
              <p className="font-serif font-semibold text-sm text-foreground leading-tight">Kroman Jibhar Samuel</p>
              <p className="text-xs text-muted-foreground">Logisticien & Data Analyst</p>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            © {currentYear} Kroman Jibhar Samuel · All rights reserved
          </p>

          {/* Tech stack */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {techStack.map((tech, i) => (
              <span key={tech} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-border">·</span>}
                <span className="text-xs text-muted-foreground font-mono">{tech}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
