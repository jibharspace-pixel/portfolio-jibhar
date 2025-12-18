import { Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="py-8 border-t border-border bg-muted/30"
      data-testid="footer"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-serif font-bold text-sm">
              KJS
            </div>
            <span className="font-serif font-semibold text-foreground">
              Kroman Jibhar Samuel
            </span>
          </div>

          <p className="text-sm text-muted-foreground flex items-center gap-1">
            © {currentYear} - Fait avec
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            en Côte d'Ivoire
          </p>

          <p className="text-sm text-muted-foreground">
            Logisticien & Data Analyst
          </p>
        </div>
      </div>
    </footer>
  );
}
