import { useState, useRef } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Loader2, Save, CheckCircle, Mail, Phone, AlignLeft, Briefcase, Plus, X, Video, Image as ImageIcon, FileText, Upload, Trash2, Download } from "lucide-react";
import { LinkedInIcon, WhatsAppIcon, GithubIcon, UpworkIcon, GmailIcon, ChariowIcon } from "@/components/brand-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { API } from "./shared";
import type { Service } from "@shared/schema";

interface ContactInfo { email: string; linkedin: string; whatsapp: string; github: string; upwork?: string; chariow?: string; }
interface SiteContent { hero_description: string; hero_highlights: string[]; about_quote: string; footer_tagline: string; stack_tags: string[]; cv_url?: string; }

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
  const cvInputRef = useRef<HTMLInputElement>(null);

  const uploadCv = useMutation({
    mutationFn: async (file: File) => {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload-cv", {
        method: "POST", headers: { "x-admin-password": password }, body: fd,
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Erreur upload");
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/site-content"] }),
  });

  const deleteCv = useMutation({
    mutationFn: async () => {
      await fetch("/api/admin/cv", { method: "DELETE", headers: { "x-admin-password": password } });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/site-content"] }),
  });

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

  const updateSvcVideo = (si: number, vi: number, val: string) =>
    setServicesForm(svf.map((s, i) => { if (i !== si) return s; const videos = [...(s.videos ?? ["", ""])]; videos[vi] = val; return { ...s, videos }; }));

  const updateSvcPhoto = (si: number, pi: number, val: string) =>
    setServicesForm(svf.map((s, i) => { if (i !== si) return s; const photos = [...(s.photos ?? Array(6).fill(""))]; photos[pi] = val; return { ...s, photos }; }));

  return (
    <div className="space-y-7">
      <div>
        <h2 className="font-serif text-xl font-bold text-foreground mb-1">Informations du site</h2>
        <p className="text-sm text-muted-foreground">Modifiez les coordonnées, textes et services affichés sur votre portfolio.</p>
      </div>

      <SectionCard icon={Mail} title="Coordonnées de contact" subtitle="Affichées dans la page Contact et le pied de page">
        {loadingContact ? (
          <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-9 bg-muted/40 rounded-md animate-pulse" />)}</div>
        ) : (
          <>
            <div className="space-y-3">
              {([
                { field: "email",    label: "Email",            Icon: () => <GmailIcon className="w-4 h-4" />,    bg: "bg-[#EA4335]/10",  ph: "votre@gmail.com",                         type: "email" },
                { field: "whatsapp", label: "WhatsApp",         Icon: () => <WhatsAppIcon className="w-4 h-4" />, bg: "bg-[#25D366]/10",  ph: "+225 07 00 00 00 00",                     type: "tel"   },
                { field: "linkedin", label: "LinkedIn",         Icon: () => <LinkedInIcon className="w-4 h-4" />, bg: "bg-[#0A66C2]/10",  ph: "https://linkedin.com/in/votre-profil",    type: "url"   },
                { field: "github",   label: "GitHub",           Icon: () => <GithubIcon className="w-4 h-4" />,   bg: "bg-muted/60",      ph: "https://github.com/votre-pseudo",         type: "url"   },
                { field: "upwork",   label: "Upwork",           Icon: () => <UpworkIcon className="w-4 h-4" />,   bg: "bg-[#14a800]/10",  ph: "https://www.upwork.com/freelancers/...",  type: "url"   },
                { field: "chariow",  label: "Chariow / Nexalion Digital Store", Icon: () => <ChariowIcon className="w-4 h-4" />, bg: "bg-[#FAFAE8]",    ph: "https://apdzoviz.mychariow.shop",                  type: "url"   },
              ] as const).map(({ field, label, Icon, bg, ph, type }) => (
                <div key={field} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                    <Icon />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">{label}</label>
                    <Input
                      type={type}
                      value={cf[field] ?? ""}
                      onChange={e => setContactForm(p => ({ ...(p ?? cf), [field]: e.target.value }))}
                      placeholder={ph}
                      className="h-8 text-sm"
                      data-testid={`input-contact-${field}`}
                    />
                  </div>
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
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Points forts (5 lignes)</label>
              <div className="space-y-2">
                {[0,1,2,3,4].map(i => (
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
            <SaveBtn saving={savingT} saved={savedT} onSave={saveContent} testId="button-save-content" />
          </>
        )}
      </SectionCard>

      <SectionCard icon={FileText} title="Curriculum Vitae" subtitle="Fichier téléchargeable depuis le bouton CV du site (PDF, DOC, DOCX — max 10 Mo)">
        <div className="space-y-3">
          {sf.cv_url ? (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800/40 px-4 py-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-green-700 dark:text-green-400">CV chargé</p>
                  <p className="text-xs text-green-600/70 dark:text-green-500/70 truncate">{sf.cv_url}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={sf.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-medium text-green-700 dark:text-green-400 hover:underline"
                >
                  <Download className="w-3.5 h-3.5" />
                  Voir
                </a>
                <button
                  type="button"
                  onClick={() => deleteCv.mutate()}
                  className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
                  aria-label="Supprimer le CV"
                >
                  {deleteCv.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 px-4 py-5 text-center">
              <FileText className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Aucun CV chargé — le bouton "Télécharger CV" sera inactif.</p>
            </div>
          )}
          <input
            ref={cvInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            title="Choisir le fichier CV"
            aria-label="Choisir le fichier CV"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) uploadCv.mutate(file);
              e.target.value = "";
            }}
          />
          <Button
            type="button"
            onClick={() => cvInputRef.current?.click()}
            disabled={uploadCv.isPending}
            size="sm"
            className="w-full bg-nexalion hover:opacity-90 font-medium"
            data-testid="button-upload-cv"
          >
            {uploadCv.isPending
              ? <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />Chargement…</>
              : <><Upload className="w-3.5 h-3.5 mr-1.5" />{sf.cv_url ? "Remplacer le CV" : "Charger le CV"}</>}
          </Button>
          {uploadCv.isError && (
            <p className="text-xs text-red-500 font-medium">{(uploadCv.error as Error).message}</p>
          )}
        </div>
      </SectionCard>

      <SectionCard icon={Briefcase} title="Services proposés" subtitle="Cartes de services affichées sur la page d'accueil">
        {loadingServices ? (
          <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-28 bg-muted/40 rounded-xl animate-pulse" />)}</div>
        ) : (
          <>
            {svf.map((svc, idx) => (
              <div key={svc.id} className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-4">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Service {idx + 1}</span>

                {/* Titre */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Titre</label>
                  <Input value={svc.title} onChange={e => updateSvc(idx, "title", e.target.value)} className="h-8 text-sm" data-testid={`input-service-title-${idx}`} />
                </div>

                {/* Description courte */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Description courte</label>
                  <Input value={svc.description} onChange={e => updateSvc(idx, "description", e.target.value)} className="h-8 text-sm" placeholder="Résumé affiché sous le titre…" data-testid={`input-service-desc-${idx}`} />
                </div>

                {/* Description longue */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Description détaillée</label>
                  <textarea
                    value={svc.long_description ?? ""}
                    onChange={e => updateSvc(idx, "long_description", e.target.value)}
                    rows={4}
                    placeholder="Décrivez en détail ce service, son contexte, ses bénéfices…"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    data-testid={`input-service-longdesc-${idx}`}
                  />
                </div>

                {/* Features */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Fonctionnalités (3 éléments)</label>
                  <div className="flex gap-2">
                    {[0,1,2].map(fi => (
                      <Input key={fi} value={svc.features[fi] ?? ""} onChange={e => updateSvcFeature(idx, fi, e.target.value)} className="h-8 text-sm" placeholder={`Outil ${fi + 1}`} data-testid={`input-service-feature-${idx}-${fi}`} />
                    ))}
                  </div>
                </div>

                {/* Vidéos (max 2) */}
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Video className="w-3.5 h-3.5 text-muted-foreground" />
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Vidéos (max 2 — URL embed ou directe)</label>
                  </div>
                  <div className="space-y-2">
                    {[0, 1].map(vi => (
                      <Input
                        key={vi}
                        value={(svc.videos ?? [])[vi] ?? ""}
                        onChange={e => updateSvcVideo(idx, vi, e.target.value)}
                        className="h-8 text-sm font-mono"
                        placeholder={`URL vidéo ${vi + 1}`}
                        data-testid={`input-service-video-${idx}-${vi}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Photos (max 6) */}
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-muted-foreground" />
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Photos (max 6 — URL image)</label>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Array.from({ length: 6 }, (_, pi) => (
                      <div key={pi} className="space-y-1">
                        <Input
                          value={(svc.photos ?? [])[pi] ?? ""}
                          onChange={e => updateSvcPhoto(idx, pi, e.target.value)}
                          className="h-8 text-xs font-mono"
                          placeholder={`Photo ${pi + 1}`}
                          data-testid={`input-service-photo-${idx}-${pi}`}
                        />
                        {(svc.photos ?? [])[pi] && (
                          <img
                            src={(svc.photos ?? [])[pi]}
                            alt={`Aperçu photo ${pi + 1}`}
                            className="w-full h-16 object-cover rounded-md border border-border/60"
                            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                        )}
                      </div>
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
