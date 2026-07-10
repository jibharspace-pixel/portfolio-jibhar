import { ScrollReveal } from "@/components/scroll-reveal";
import { ContactForm } from "@/components/contact-form";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/language-context";

export function QuoteSection() {
  const { lang } = useLanguage();
  return (
    <section className="py-14 sm:py-20 lg:py-24 relative overflow-hidden" data-testid="section-quote">
      <div className="absolute inset-0 bg-aurora-page opacity-60 pointer-events-none" />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-8 sm:mb-10">
          <Badge variant="secondary" className="mb-4 text-xs font-semibold px-3 py-1 rounded-full border border-primary/20 bg-primary/8 text-primary tracking-wide uppercase">
            {lang === "fr" ? "Devis gratuit" : "Free quote"}
          </Badge>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-3">
            {lang === "fr" ? "Un projet en tête ?" : "Have a project in mind?"}
          </h2>
          <div className="h-0.5 w-10 bg-primary rounded-full mx-auto mb-3" />
          <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            {lang === "fr"
              ? "Décrivez votre besoin en quelques lignes, je vous réponds sous 24h avec une proposition adaptée."
              : "Describe your need in a few lines, I'll reply within 24h with a tailored proposal."}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="rounded-2xl border border-border/60 bg-card/80 shadow-sm p-4 sm:p-6 lg:p-8">
            <ContactForm compact />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
