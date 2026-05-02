import { useQuery } from "@tanstack/react-query";
import { Mail, Linkedin, MessageCircle, Github, Send, MapPin, ArrowRight } from "lucide-react";
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
            <Skeleton className="w-10 h-10 rounded-lg mb-4" />
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-3 w-32 mb-1" />
            <Skeleton className="h-3 w-28" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

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
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      value: "Kroman Jibhar Samuel",
      href: info.linkedin,
      icon: Linkedin,
      description: "Connectons-nous",
      primary: false,
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      value: info.whatsapp,
      href: `https://wa.me/${info.whatsapp?.replace(/[^0-9]/g, "")}`,
      icon: MessageCircle,
      description: "Discutons directement",
      primary: false,
    },
    {
      id: "github",
      label: "GitHub",
      value: "@kromanjibhar",
      href: info.github,
      icon: Github,
      description: "Voir mes projets",
      primary: false,
    },
  ];

  return (
    <section id="contact" className="py-20 lg:py-28 relative overflow-hidden" data-testid="section-contact">
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">

        {/* Header */}
        <div className="mb-14">
          <Badge variant="secondary" className="mb-4 text-xs font-semibold px-3 py-1 rounded-full border border-primary/20 bg-primary/8 text-primary tracking-wide uppercase">
            Contact
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Travaillons ensemble
          </h2>
          <div className="h-0.5 w-12 bg-primary rounded-full mb-4" />
          <p className="text-muted-foreground text-base max-w-xl leading-relaxed">
            Vous avez un projet en tête ? Contactez-moi pour discuter de vos besoins
            et trouver la meilleure solution.
          </p>
        </div>

        {isLoading ? (
          <ContactSkeleton />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">Une erreur est survenue lors du chargement.</p>
          </div>
        ) : contactInfo ? (
          <div className="space-y-12">
            {/* Contact cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
                      className={`border h-full transition-all duration-200 group-hover:border-primary/30 group-hover:shadow-md group-hover:-translate-y-0.5 ${
                        method.primary
                          ? "border-primary/25 bg-primary/5"
                          : "border-border/60"
                      }`}
                      data-testid={`card-contact-${method.id}`}
                    >
                      <CardContent className="p-6 flex flex-col gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          method.primary
                            ? "bg-nexalion text-white"
                            : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                        } transition-colors`}>
                          <Icon className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-foreground">{method.label}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">{method.description}</p>
                        </div>
                        <p className="text-xs font-medium text-primary truncate">{method.value}</p>
                        <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors mt-auto">
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
            <div className="relative overflow-hidden rounded-2xl bg-nexalion p-8 lg:p-10 text-white shadow-xl">
              <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
              <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-100">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">Côte d'Ivoire</span>
                  </div>
                  <h3 className="font-serif text-2xl lg:text-3xl font-bold text-white">
                    Prêt à démarrer votre projet ?
                  </h3>
                  <p className="text-blue-100 text-sm leading-relaxed max-w-lg">
                    Consultation gratuite pour comprendre vos besoins et vous proposer la solution adaptée.
                  </p>
                </div>
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-blue-50 font-semibold text-sm shrink-0 shadow-sm transition-all hover:-translate-y-0.5"
                  asChild
                >
                  <a href={`mailto:${contactInfo.email}`} data-testid="button-contact-cta">
                    <Mail className="w-4 h-4 mr-2" />
                    Envoyez-moi un message
                  </a>
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
