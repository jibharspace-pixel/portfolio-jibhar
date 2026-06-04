import { useQuery } from "@tanstack/react-query";
import { MapPin, ArrowRight, CheckCircle2, Send, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollReveal } from "@/components/scroll-reveal";
import { useLanguage } from "@/lib/language-context";
import { ContactForm } from "@/components/contact-form";
import { LinkedInIcon, WhatsAppIcon, GithubIcon, UpworkIcon, GmailIcon, ChariowIcon } from "@/components/brand-icons";
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

export function ContactSection() {
  const { t, lang } = useLanguage();
  const { data: contactInfo, isLoading, error } = useQuery<ContactInfo>({
    queryKey: ["/api/contact"],
  });

  const getContactMethods = (info: ContactInfo) => [
    {
      id: "email",
      label: "Email",
      value: info.email,
      href: `mailto:${info.email}`,
      Icon: () => <GmailIcon className="w-5 h-5" />,
      description: t.contact.methods.email,
      primary: true,
      bg: "bg-white border border-gray-200",
      hoverBorder: "hover:border-red-200/60",
      hoverGlow: "hover:shadow-[0_8px_30px_rgba(234,67,53,0.15)]",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      value: "Kroman Jibhar Samuel",
      href: info.linkedin,
      Icon: () => <LinkedInIcon className="w-5 h-5" />,
      description: t.contact.methods.linkedin,
      primary: false,
      bg: "bg-[#0A66C2]",
      hoverBorder: "hover:border-blue-400/60",
      hoverGlow: "hover:shadow-[0_8px_24px_rgba(10,102,194,0.20)]",
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      value: info.whatsapp,
      href: `https://wa.me/${info.whatsapp?.replace(/[^0-9]/g, "")}`,
      Icon: () => <WhatsAppIcon className="w-5 h-5" />,
      description: t.contact.methods.whatsapp,
      primary: false,
      bg: "bg-[#25D366]",
      hoverBorder: "hover:border-green-400/60",
      hoverGlow: "hover:shadow-[0_8px_24px_rgba(37,211,102,0.20)]",
    },
    {
      id: "github",
      label: "GitHub",
      value: "@kromanjibhar",
      href: info.github,
      Icon: () => <GithubIcon className="w-5 h-5" />,
      description: t.contact.methods.github,
      primary: false,
      bg: "bg-[#181717]",
      hoverBorder: "hover:border-gray-400/50",
      hoverGlow: "hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)]",
    },
    {
      id: "upwork",
      label: "Upwork",
      value: "Kroman Jibhar Samuel",
      href: info.upwork ?? "#",
      Icon: () => <UpworkIcon className="w-5 h-5" />,
      description: lang === "fr" ? "Collaborer via Upwork" : "Collaborate via Upwork",
      primary: false,
      bg: "bg-[#14a800]",
      hoverBorder: "hover:border-green-500/60",
      hoverGlow: "hover:shadow-[0_8px_24px_rgba(20,168,0,0.20)]",
    },
    {
      id: "chariow",
      label: "Nexalion Digital Store",
      value: "apdzoviz.mychariow.shop",
      href: info.chariow ?? "https://apdzoviz.mychariow.shop",
      Icon: () => <ChariowIcon className="w-6 h-6" />,
      description: lang === "fr" ? "Boutique digitale — produits & templates" : "Digital store — products & templates",
      primary: false,
      bg: "bg-[#FAFAE8] border-2 border-[#e8e8cc]",
      hoverBorder: "hover:border-yellow-400/60",
      hoverGlow: "hover:shadow-[0_8px_24px_rgba(245,197,24,0.22)]",
    },
  ];

  return (
    <section id="contact" className="py-20 lg:py-28 relative overflow-hidden" data-testid="section-contact">
      <div className="section-blob w-96 h-96 bg-primary/6 bottom-0 left-0 animate-glow-pulse" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">

        {/* ── Header ──────────────────────────────── */}
        <ScrollReveal className="mb-14">
          <Badge variant="secondary" className="mb-4 text-xs font-semibold px-3 py-1 rounded-full border border-primary/20 bg-primary/8 text-primary tracking-wide uppercase">
            {t.contact.badge}
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            {t.contact.title}
          </h2>
          <div className="h-0.5 w-12 bg-primary rounded-full mb-4" />
          <p className="text-muted-foreground text-base max-w-xl leading-relaxed">
            {t.contact.subtitle}
          </p>
        </ScrollReveal>

        {isLoading ? (
          <ContactSkeleton />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">{t.contact.errorLoading}</p>
          </div>
        ) : contactInfo ? (
          <div className="space-y-10">
            {/* Contact cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
              {getContactMethods(contactInfo).map((method, i) => {
                const { Icon } = method;

                /* ── Carte spéciale Chariow ── */
                if (method.id === "chariow") {
                  return (
                    <ScrollReveal key={method.id} delay={i * 100} className="sm:col-span-2 lg:col-span-1">
                      <a
                        href={method.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block h-full"
                        data-testid="link-contact-chariow"
                      >
                        <Card className="border border-[#e8e8cc] h-full transition-all duration-300 group-hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(245,197,24,0.25)] hover:border-yellow-400/50 bg-[#FAFAE8]">
                          <CardContent className="p-0 flex flex-col">
                            {/* Zone logo rectangulaire pleine largeur */}
                            <div className="w-full flex items-center justify-center gap-3 px-5 py-5 bg-[#FAFAE8] rounded-t-xl border-b border-[#e8e8cc]">
                              <ChariowIcon className="w-12 h-12 shrink-0" />
                              <span className="text-[1.6rem] font-extrabold tracking-tight text-[#1a1a1a] leading-none">
                                chariow
                              </span>
                            </div>
                            {/* Infos */}
                            <div className="p-4 flex flex-col gap-2">
                              <p className="text-xs text-muted-foreground leading-snug">{method.description}</p>
                              <p className="text-xs font-semibold text-[#b08c00]">Nexalion Digital Store</p>
                              <div className="flex items-center gap-1 text-xs font-semibold text-[#b08c00] group-hover:gap-2 transition-all mt-auto">
                                <span>{t.contact.open}</span>
                                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </a>
                    </ScrollReveal>
                  );
                }

                return (
                  <ScrollReveal key={method.id} delay={i * 100}>
                    <a
                      href={method.href}
                      target={method.id !== "email" ? "_blank" : undefined}
                      rel={method.id !== "email" ? "noopener noreferrer" : undefined}
                      data-testid={`link-contact-${method.id}`}
                      className="group block h-full"
                    >
                      <Card
                        className={`border h-full transition-all duration-300 group-hover:-translate-y-1 ${method.hoverGlow} ${method.hoverBorder} ${
                          method.primary ? "border-primary/25 bg-primary/5" : "border-border/60"
                        }`}
                        data-testid={`card-contact-${method.id}`}
                      >
                        <CardContent className="p-5 flex flex-col gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${method.bg} text-white shadow-sm transition-transform duration-200 group-hover:scale-110`}>
                            <Icon />
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-foreground">{method.label}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">{method.description}</p>
                          </div>
                          <p className="text-xs font-semibold text-primary truncate">{method.value}</p>
                          <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors mt-auto">
                            <span>{t.contact.open}</span>
                            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  </ScrollReveal>
                );
              })}
            </div>

            {/* Contact form */}
            <ScrollReveal>
              <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
                <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border/60 bg-muted/20">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Send className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {lang === "en" ? "Send a message" : "Envoyer un message"}
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <ContactForm />
                </div>
              </div>
            </ScrollReveal>

            {/* CTA banner */}
            <ScrollReveal>
              <div className="rounded-2xl bg-nexalion text-white shadow-[0_8px_40px_hsl(216,90%,40%,0.22)] overflow-hidden">
                <div className="p-5 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 sm:gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-white/60">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-xs font-medium tracking-wide">{t.contact.location}</span>
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
                      {t.contact.bannerTitle}
                    </h3>
                    <ul className="space-y-2">
                      {t.contact.perks.map(p => (
                        <li key={p} className="flex items-center gap-2.5 text-sm text-white/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/50 shrink-0" />
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
                        {lang === "fr" ? "Envoyer un mail" : "Send an email"}
                      </a>
                    </Button>
                    <Button
                      size="lg"
                      className="bg-[#25D366] hover:bg-[#20b558] text-white font-semibold text-sm shadow-[0_4px_16px_rgba(37,211,102,0.35)] transition-all hover:-translate-y-0.5"
                      asChild
                    >
                      <a href={`https://wa.me/${contactInfo.whatsapp?.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer">
                        <WhatsAppIcon className="w-4 h-4 mr-2" />
                        WhatsApp
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        ) : null}
      </div>
    </section>
  );
}
