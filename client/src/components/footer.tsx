import { Link } from "wouter";
import { Mail, Linkedin, MessageCircle, Github, ExternalLink, ArrowUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface ContactInfo { email: string; linkedin: string; whatsapp: string; github: string; }
interface SiteContent { footer_tagline: string; }

const NAV_LINKS = [
  { label: "Accueil",    href: "/" },
  { label: "Projets",    href: "/projets" },
  { label: "Blog",       href: "/blog" },
  { label: "Ressources", href: "/ressources" },
  { label: "À propos",   href: "/apropos" },
  { label: "Contact",    href: "/contact" },
];

const TECH_STACK = ["React", "TypeScript", "Tailwind CSS", "Rust · Axum"];

function whatsappHref(raw: string) {
  if (raw.startsWith("http")) return raw;
  const digits = raw.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "#";
}

export function Footer() {
  const { data: contact } = useQuery<ContactInfo>({ queryKey: ["/api/contact"] });
  const { data: content } = useQuery<SiteContent>({ queryKey: ["/api/site-content"] });

  const email    = contact?.email    ?? "jibharkroman@gmail.com";
  const linkedin = contact?.linkedin ?? "https://linkedin.com/in/kroman-jibhar-samuel";
  const whatsapp = contact?.whatsapp ?? "+225 0700000000";
  const github   = contact?.github   ?? "https://github.com/kromanjibhar";
  const tagline  = content?.footer_tagline ?? "Je conçois des solutions digitales sur mesure — dashboards, apps web et automatisations — pour transformer vos données en décisions.";

  const socialLinks = [
    { label: "LinkedIn",  icon: Linkedin,       href: linkedin,              color: "hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40" },
    { label: "GitHub",    icon: Github,          href: github,               color: "hover:text-foreground hover:bg-muted" },
    { label: "WhatsApp",  icon: MessageCircle,   href: whatsappHref(whatsapp), color: "hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950/40" },
    { label: "Email",     icon: Mail,            href: `mailto:${email}`,   color: "hover:text-primary hover:bg-primary/10" },
  ];

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-muted/20" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-nexalion text-white font-serif font-bold text-sm shadow-md">
                KJS
              </div>
              <div>
                <p className="font-serif font-bold text-base text-foreground leading-tight">Kroman Jibhar Samuel</p>
                <p className="text-xs text-muted-foreground">Logisticien & Data Analyst</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-5">
              {tagline}
            </p>
            <div className="flex items-center gap-2">
              {socialLinks.map(({ label, icon: Icon, href, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-8 h-8 rounded-lg border border-border/60 flex items-center justify-center text-muted-foreground transition-all duration-150 ${color}`}
                  data-testid={`link-footer-${label.toLowerCase()}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-bold text-foreground uppercase tracking-widest mb-4">Navigation</p>
            <ul className="space-y-2.5">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href}>
                    <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                      {label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Stack */}
          <div>
            <p className="text-xs font-bold text-foreground uppercase tracking-widest mb-4">Contact</p>
            <ul className="space-y-2.5 mb-7">
              <li>
                <a href={`mailto:${email}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {email}
                </a>
              </li>
              <li>
                <a href="https://nexalion.store" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                  nexalion.store
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li className="text-sm text-muted-foreground">Abidjan, Côte d'Ivoire</li>
            </ul>

            <p className="text-xs font-bold text-foreground uppercase tracking-widest mb-3">Stack</p>
            <div className="flex flex-wrap gap-1.5">
              {TECH_STACK.map((name) => (
                <span key={name} className="text-[11px] font-mono text-muted-foreground bg-muted/60 border border-border/60 px-2 py-0.5 rounded">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            © {year} Kroman Jibhar Samuel · Tous droits réservés
          </p>
          <button
            onClick={scrollTop}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
            data-testid="button-back-to-top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            Retour en haut
          </button>
        </div>
      </div>
    </footer>
  );
}
