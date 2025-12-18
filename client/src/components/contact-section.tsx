import { useQuery } from "@tanstack/react-query";
import { Mail, Linkedin, MessageCircle, Github, Send, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ContactInfo } from "@shared/schema";

function ContactSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardContent className="p-6 text-center">
            <Skeleton className="mx-auto w-14 h-14 rounded-xl mb-4" />
            <Skeleton className="h-5 w-20 mx-auto mb-1" />
            <Skeleton className="h-4 w-32 mx-auto mb-2" />
            <Skeleton className="h-4 w-40 mx-auto" />
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
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      value: info.whatsapp,
      href: `https://wa.me/${info.whatsapp?.replace(/[^0-9]/g, "")}`,
      icon: MessageCircle,
      description: "Discutons directement",
    },
    {
      id: "github",
      label: "GitHub",
      value: "@kromanjibhar",
      href: info.github,
      icon: Github,
      description: "Voir mes projets",
    },
  ];

  return (
    <section
      id="contact"
      className="py-16 lg:py-24"
      data-testid="section-contact"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <Send className="w-3 h-3 mr-1" />
            Contact
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Travaillons ensemble
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Vous avez un projet en tête ? N'hésitez pas à me contacter pour
            discuter de vos besoins et trouver la meilleure solution.
          </p>
        </div>

        {isLoading ? (
          <ContactSkeleton />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Une erreur est survenue lors du chargement des informations de contact.</p>
          </div>
        ) : contactInfo ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {getContactMethods(contactInfo).map((method) => {
                const Icon = method.icon;
                return (
                  <Card
                    key={method.id}
                    className={`group overflow-visible hover-elevate active-elevate-2 transition-all duration-300 ${
                      method.primary
                        ? "sm:col-span-2 lg:col-span-1 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent"
                        : ""
                    }`}
                    data-testid={`card-contact-${method.id}`}
                  >
                    <CardContent className="p-6 text-center">
                      <a
                        href={method.href}
                        target={method.id !== "email" ? "_blank" : undefined}
                        rel={method.id !== "email" ? "noopener noreferrer" : undefined}
                        className="block"
                        data-testid={`link-contact-${method.id}`}
                      >
                        <div
                          className={`mx-auto w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105 ${
                            method.primary
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-lg mb-1">{method.label}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {method.description}
                        </p>
                        <p className="text-sm font-medium text-primary truncate">
                          {method.value}
                        </p>
                      </a>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-16 text-center">
              <Card className="max-w-xl mx-auto overflow-visible bg-gradient-to-br from-primary/5 to-accent/5">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">Côte d'Ivoire</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold mb-3">
                    Prêt à démarrer votre projet ?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Contactez-moi dès aujourd'hui pour une consultation gratuite et découvrez
                    comment je peux vous aider à atteindre vos objectifs.
                  </p>
                  <Button size="lg" asChild>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      data-testid="button-contact-cta"
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      Envoyez-moi un message
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
