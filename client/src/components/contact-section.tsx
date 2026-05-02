import { useQuery } from "@tanstack/react-query";
import { Mail, Linkedin, MessageCircle, Github, MapPin, ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ContactInfo } from "@shared/schema";

function ContactSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="border border-border/60">
          <CardContent className="p-6">
            <Skeleton className="w-10 h-10 rounded-xl mb-4" />
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-3 w-32 mb-1" />
            <Skeleton className="h-3 w-28" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

const perks = [
  "Consultation gratuite pour évaluer votre projet",
  "Réponse sous 24h garantie",
  "Devis personnalisé sans engagement",
];

export function ContactSection() {
  const { data: contactInfo, isLoading, error } = useQuery<ContactInfo>({
    queryKey: ["/api/contact"],
  });

  const getContactMethods = (info: ContactInfo) => [
    {
      id: "email",
      label: "Email",
      value: info.email,
      href: `mailto:${info.email}`,
      icon: Mail,
      description: "Envoyez-moi un email",
      primary: true,
      bg: "bg-nexalion",
      hoverBorder: "hover:border-blue-300/60",
      hoverGlow: "hover:shadow-[0_8px_30px_hsl(216,90%,40%,0.15)]",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      value: "Kroman Jibhar Samuel",
      href: info.linkedin,
      icon: Linkedin,
      description: "Connectons-nous",
      primary: false,
      bg: "bg-blue-600",
      hoverBorder: "hover:border-blue-300/60",
      hoverGlow: "hover:shadow-[0_8px_24px_hsl(220,80%,55%,0.14)]",
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      value: info.whatsapp,
      href: `https://wa.me/${info.whatsapp?.replace(/[^0-9]/g, "")}`,
      icon: MessageCircle,
      description: "Message direct",
      primary: false,
      bg: "bg-green-500",
      hoverBorder: "hover:border-green-300/60",
      hoverGlow: "hover:shadow-[0_8px_24px_hsl(145,65%,42%,0.14)]",
    },
    {
      id: "github",
      label: "GitHub",
      value: "@kromanjibhar",
      href: info.github,
      icon: Github,
      description: "Voir mes projets",
      primary: false,
      bg: "bg-gray-900",
      hoverBorder: "hover:border-gray-400/50",
      hoverGlow: "hover:shadow-[0_8px_24px_hsl(0,0%,10%,0.12)]",
    },
  ];

  return (
    <section id="contact" className="py-20 lg:py-28 relative overflow-hidden" data-testid="section-contact">
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
      <div className="section-blob w-96 h-96 bg-primary/6 bottom-0 left-0 animate-glow-pulse" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">

        {/* ── Header ──────────────────────────────── */}
        <div className="mb-14">
          <Badge variant="secondary" className="mb-4 text-xs font-semibold px-3 py-1 rounded-full border border-primary/20 bg-primary/8 text-primary tracking-wide uppercase">
            Contact
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Travaillons ensemble
          </h2>
          <div className="h-0.5 w-12 bg-primary rounded-full mb-4" />
          <p className="text-muted-foreground text-base max-w-xl leading-relaxed">
            Vous avez un projet en tête ? Choisissez le canal qui vous convient le mieux.
          </p>
        </div>

        {isLoading ? (
          <ContactSkeleton />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">Impossible de charger les informations de contact.</p>
          </div>
        ) : contactInfo ? (
          <div className="space-y-10">
            {/* Contact cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {getContactMethods(contactInfo).map((method) => {
                const Icon = method.icon;
                return (
                  <a
                    key={method.id}
                    href={method.href}
                    target={method.id !== "email" ? "_blank" : undefined}
                    rel={method.id !== "email" ? "noopener noreferrer" : undefined}
                    data-testid={`link-contact-${method.id}`}
                    className="group block"
                  >
                    <Card
                      className={`border h-full transition-all duration-300 group-hover:-translate-y-1 ${method.hoverGlow} ${method.hoverBorder} ${
                        method.primary ? "border-primary/25 bg-primary/5" : "border-border/60"
                      }`}
                      data-testid={`card-contact-${method.id}`}
                    >
                      <CardContent className="p-5 flex flex-col gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${method.bg} text-white shadow-sm transition-transform duration-200 group-hover:scale-110`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-foreground">{method.label}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">{method.description}</p>
                        </div>
                        <p className="text-xs font-semibold text-primary truncate">{method.value}</p>
                        <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors mt-auto">
                          <span>Ouvrir</span>
                          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                );
              })}
            </div>

            {/* CTA banner */}
            <div className="relative overflow-hidden rounded-2xl bg-nexalion text-white shadow-[0_8px_40px_hsl(216,90%,40%,0.30)]">
              <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/8 rounded-full blur-3xl" />
              <div className="absolute -bottom-16 -left-10 w-48 h-48 bg-white/6 rounded-full blur-2xl" />

              <div className="relative p-8 lg:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-100">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">Abidjan, Côte d'Ivoire · Remote worldwide</span>
                  </div>
                  <h3 className="font-serif text-2xl lg:text-3xl font-bold text-white leading-tight">
                    Prêt à démarrer votre projet ?
                  </h3>
                  <ul className="space-y-1.5 mt-2">
                    {perks.map(p => (
                      <li key={p} className="flex items-center gap-2 text-sm text-blue-100">
                        <CheckCircle2 className="w-4 h-4 text-white/70 shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-blue-50 font-bold text-sm shadow-lg transition-all hover:-translate-y-0.5"
                    asChild
                  >
                    <a href={`mailto:${contactInfo.email}`} data-testid="button-contact-cta">
                      <Mail className="w-4 h-4 mr-2" />
                      Envoyez un message
                    </a>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 font-semibold text-sm"
                    asChild
                  >
                    <a href={`https://wa.me/${contactInfo.whatsapp?.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
