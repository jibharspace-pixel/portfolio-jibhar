import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save, CheckCircle, Mail, Phone, Link2, AlignLeft, Briefcase, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { API } from "./shared";
import type { Service } from "@shared/schema";

interface ContactInfo { email: string; linkedin: string; whatsapp: string; github: string; }
interface SiteContent { hero_description: string; hero_highlights: string[]; about_quote: string; footer_tagline: string; stack_tags: string[]; }

function SectionCard({ icon: Icon, title, subtitle, children }: { icon: typeof Mail; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <Card className="border border-border/60">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border/60 bg-muted/20">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-sm text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <CardContent className="p-5 space-y-4">{children}</CardContent>
    </Card>
  );
}

function SaveBtn({ saving, saved, onSave, testId }: { saving: boolean; saved: boolean; onSave: () => void; testId: string }) {
  return (
    <div className="flex justify-end pt-1 border-t border-border/60">
      <Button onClick={onSave} disabled={saving} size="sm" className="bg-nexalion hover:opacity-90 font-medium" data-testid={testId}>
        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : saved ? <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-green-400" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
        {saved ? "Sauvegardé !" : "Enregistrer"}
      </Button>
    </div>
  );
}

export function InfosSection({ password }: { password: string }) {
  const qc = useQueryClient();
  const { data: contact, isLoading: loadingContact } = useQuery<ContactInfo>({ queryKey: ["/api/contact"] });
  const { data: content, isLoading: loadingContent } = useQuery<SiteContent>({ queryKey: ["/api/site-content"] });
  const { data: services, isLoading: loadingServices } = useQuery<Service[]>({ queryKey: ["/api/services"] });

  const [contactForm, setContactForm] = useState<ContactInfo | null>(null);
  const [contentForm, setContentForm] = useState<SiteContent | null>(null);
  const [servicesForm, setServicesForm] = useState<Service[] | null>(null);

  const [savingC, setSavingC] = useState(false); const [savedC, setSavedC] = useState(false);
  const [savingT, setSavingT] = useState(false); const [savedT, setSavedT] = useState(false);
  const [savingS, setSavingS] = useState(false); const [savedS, setSavedS] = useState(false);

  const cf = contactForm ?? contact ?? { email: "", linkedin: "", whatsapp: "", github: "" };
  const sf = contentForm ?? content ?? { hero_description: "", hero_highlights: ["", "", ""], about_quote: "", footer_tagline: "", stack_tags: [] };
  const svf = servicesForm ?? services ?? [];

  const flash = (set: (v: boolean) => void) => { set(true); setTimeout(() => set(false), 2500); };

  const saveContact = async () => {
    setSavingC(true);
    await API.put("/api/admin/contact", password, cf);
    qc.invalidateQueries({ queryKey: ["/api/contact"] });
    setSavingC(false); flash(setSavedC);
  };

  const saveContent = async () => {
    setSavingT(true);
    await API.put("/api/admin/site-content", password, { ...sf, hero_highlights: sf.hero_highlights.filter(h => h.trim()) });
    qc.invalidateQueries({ queryKey: ["/api/site-content"] });
    setSavingT(false); flash(setSavedT);
  };

  const saveServices = async () => {
    setSavingS(true);
    await API.put("/api/admin/services", password, { services: svf });
    qc.invalidateQueries({ queryKey: ["/api/services"] });
    setSavingS(false); flash(setSavedS);
  };

  const updateHighlight = (i: number, val: string) => {
    const h = [...(sf.hero_highlights ?? ["", "", ""])];
    h[i] = val;
    setContentForm(p => ({ ...(p ?? sf), hero_highlights: h }));
  };

  const addTag = () =>
    setContentForm(p => ({ ...(p ?? sf), stack_tags: [...(sf.stack_tags ?? []), ""] }));

  const updateTag = (i: number, val: string) => {
    const tags = [...(sf.stack_tags ?? [])];
    tags[i] = val;
    setContentForm(p => ({ ...(p ?? sf), stack_tags: tags }));
  };

  const removeTag = (i: number) =>
    setContentForm(p => ({ ...(p ?? sf), stack_tags: (sf.stack_tags ?? []).filter((_, idx) => idx !== i) }));

  const updateSvc = (idx: number, field: keyof Service, value: string) =>
    setServicesForm(svf.map((s, i) => i === idx ? { ...s, [field]: value } : s));

  const updateSvcFeature = (si: number, fi: number, val: string) =>
    setServicesForm(svf.map((s, i) => { if (i !== si) return s; const features = [...s.features]; features[fi] = val; return { ...s, features }; }));

  return (
    <div className="space-y-7">
      <div>
        <h2 className="font-serif text-xl font-bold text-foreground mb-1">Informations du site</h2>
        <p className="text-sm text-muted-foreground">Modifiez les coordonnées, textes et services affichés sur votre portfolio.</p>
      </div>

      <SectionCard icon={Mail} title="Coordonnées de contact" subtitle="Affichées dans la page Contact et le pied de page">
        {loadingContact ? (
          <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-9 bg-muted/40 rounded-md animate-pulse" />)}</div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-3">
              {([["email", "Email", Mail, "votre@email.com"], ["whatsapp", "WhatsApp", Phone, "+225 07 00 00 00 00"], ["linkedin", "LinkedIn (URL)", Link2, "https://linkedin.com/in/..."], ["github", "GitHub (URL)", Link2, "https://github.com/..."]] as const).map(([field, label, Icon, ph]) => (
                <div key={field}>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block flex items-center gap-1.5"><Icon className="w-3 h-3" />{label}</label>
                  <Input value={(cf as any)[field]} onChange={e => setContactForm(p => ({ ...(p ?? cf), [field]: e.target.value }))} placeholder={ph} className="h-9 text-sm" data-testid={`input-contact-${field}`} />
                </div>
              ))}
            </div>
            <SaveBtn saving={savingC} saved={savedC} onSave={saveContact} testId="button-save-contact" />
          </>
        )}
      </SectionCard>

      <SectionCard icon={AlignLeft} title="Textes de la page d'accueil" subtitle="Description principale et points forts affichés dans le hero">
        {loadingContent ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-9 bg-muted/40 rounded-md animate-pulse" />)}</div>
        ) : (
          <>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Description principale</label>
              <textarea value={sf.hero_description} onChange={e => setContentForm(p => ({ ...(p ?? sf), hero_description: e.target.value }))} rows={3}
                placeholder="Je conçois des solutions digitales..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                data-testid="input-hero-description" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Points forts (3 lignes)</label>
              <div className="space-y-2">
                {[0,1,2].map(i => (
                  <Input key={i} value={sf.hero_highlights?.[i] ?? ""} onChange={e => updateHighlight(i, e.target.value)} placeholder={`Point fort ${i + 1}`} className="h-9 text-sm" data-testid={`input-highlight-${i}`} />
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Citation (page À propos)</label>
              <Input value={sf.about_quote} onChange={e => setContentForm(p => ({ ...(p ?? sf), about_quote: e.target.value }))} placeholder="Autodidacte déterminé..." className="h-9 text-sm" data-testid="input-about-quote" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Texte du pied de page (footer)</label>
              <textarea value={sf.footer_tagline} onChange={e => setContentForm(p => ({ ...(p ?? sf), footer_tagline: e.target.value }))} rows={2}
                placeholder="Je conçois des solutions digitales sur mesure…"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                data-testid="input-footer-tagline" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Stack (badges de la barre admin)</label>
                <button type="button" onClick={addTag}
                  className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                  data-testid="button-add-stack-tag">
                  <Plus className="w-3.5 h-3.5" /> Ajouter
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(sf.stack_tags ?? []).map((tag, i) => (
                  <div key={i} className="flex items-center gap-1 bg-primary/8 border border-primary/15 rounded-md pl-2 pr-1 py-0.5">
                    <input
                      value={tag}
                      onChange={e => updateTag(i, e.target.value)}
                      className="text-xs font-medium text-primary bg-transparent outline-none w-24 min-w-0"
                      placeholder="React…"
                      data-testid={`input-stack-tag-${i}`}
                    />
                    <button type="button" onClick={() => removeTag(i)}
                      className="text-muted-foreground hover:text-red-500 transition-colors ml-0.5 shrink-0"
                      data-testid={`button-remove-stack-tag-${i}`}>
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {(sf.stack_tags ?? []).length === 0 && (
                  <p className="text-xs text-muted-foreground italic">Aucun badge — cliquez sur Ajouter.</p>
                )}
              </div>
            </div>
            <SaveBtn saving={savingT} saved={savedT} onSave={saveContent} testId="button-save-content" />
          </>
        )}
      </SectionCard>

      <SectionCard icon={Briefcase} title="Services proposés" subtitle="Cartes de services affichées sur la page d'accueil">
        {loadingServices ? (
          <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-28 bg-muted/40 rounded-xl animate-pulse" />)}</div>
        ) : (
          <>
            {svf.map((svc, idx) => (
              <div key={svc.id} className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Service {idx + 1}</span>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Titre</label>
                    <Input value={svc.title} onChange={e => updateSvc(idx, "title", e.target.value)} className="h-8 text-sm" data-testid={`input-service-title-${idx}`} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Description</label>
                    <Input value={svc.description} onChange={e => updateSvc(idx, "description", e.target.value)} className="h-8 text-sm" data-testid={`input-service-desc-${idx}`} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Fonctionnalités (3 éléments)</label>
                  <div className="flex gap-2">
                    {[0,1,2].map(fi => (
                      <Input key={fi} value={svc.features[fi] ?? ""} onChange={e => updateSvcFeature(idx, fi, e.target.value)} className="h-8 text-sm" placeholder={`Outil ${fi + 1}`} data-testid={`input-service-feature-${idx}-${fi}`} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <SaveBtn saving={savingS} saved={savedS} onSave={saveServices} testId="button-save-services" />
          </>
        )}
      </SectionCard>
    </div>
  );
}
