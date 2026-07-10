import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FileSpreadsheet, FileText, Database, FileCode,
  Download, Package, ArrowDownToLine,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { useLanguage } from "@/lib/language-context";
import type { FreeFile } from "@shared/schema";

const fileTypeIcons: Record<string, typeof FileText> = {
  xlsx: FileSpreadsheet, xlsm: FileSpreadsheet,
  pdf: FileText,
  pbix: Database,
  py: FileCode, js: FileCode, ts: FileCode,
};

const fileTypeColors: Record<string, string> = {
  xlsx: "bg-green-50 text-green-700 border-green-200",
  xlsm: "bg-green-50 text-green-700 border-green-200",
  pdf: "bg-red-50 text-red-700 border-red-200",
  pbix: "bg-amber-50 text-amber-700 border-amber-200",
  py: "bg-blue-50 text-blue-700 border-blue-200",
};

function ResourceSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {[1,2,3,4].map(i => (
        <div key={i} className="rounded-2xl border border-border/60 p-5">
          <Skeleton className="h-10 w-10 rounded-xl mb-4" />
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-2/3 mb-4" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}

function ResourceCard({ file, downloadLabel }: { file: FreeFile; downloadLabel: string }) {
  const [downloading, setDownloading] = useState(false);
  const qc = useQueryClient();
  const Icon = fileTypeIcons[file.file_type] ?? Package;
  const typeColor = fileTypeColors[file.file_type] ?? "bg-muted text-muted-foreground border-border";

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await fetch(`/api/files/${file.id}/download`, { method: "POST" });
      qc.invalidateQueries({ queryKey: ["/api/files"] });
      if (file.file_url && file.file_url !== "#") {
        window.open(file.file_url, "_blank");
      }
    } catch (_) {}
    setDownloading(false);
  };

  return (
    <div
      className="group rounded-2xl border border-border/60 p-5 bg-card card-interactive hover:border-primary/30 hover:shadow-[0_16px_48px_hsl(216,90%,40%,0.12)] flex flex-col"
      data-testid={`card-resource-${file.id}`}
    >
      {/* Icon */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-muted/60 border border-border/60 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-primary/8 group-hover:border-primary/20 group-hover:shadow-[0_4px_16px_hsl(216,90%,40%,0.14)]">
          <Icon className="w-5 h-5 text-muted-foreground transition-colors duration-200 group-hover:text-primary" />
        </div>
        <Badge variant="outline" className={`text-xs font-semibold rounded-md border uppercase ${typeColor}`}>
          .{file.file_type}
        </Badge>
      </div>

      {/* Content */}
      <h3 className="font-semibold text-sm text-foreground leading-snug mb-2 group-hover:text-foreground/90 transition-colors duration-200">{file.title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-3">
        {file.description}
      </p>

      {/* Tags */}
      {file.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {file.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[11px] bg-muted text-muted-foreground px-2 py-0.5 rounded font-medium transition-colors duration-150 group-hover:bg-primary/6 group-hover:text-foreground/70">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/60">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ArrowDownToLine className="w-3.5 h-3.5" />
          {file.download_count}
        </span>
        <Button
          size="sm"
          onClick={handleDownload}
          disabled={downloading}
          className="btn-primary-lift bg-nexalion text-xs h-8 px-3 font-medium"
          data-testid={`button-download-${file.id}`}
        >
          {downloading
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <Download className="w-3.5 h-3.5 mr-1" />}
          {downloading ? "…" : downloadLabel}
        </Button>
      </div>
    </div>
  );
}

export default function Resources() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event_type: "pageview", path: "/ressources" }) }).catch(() => {});
  }, []);

  const { data: files, isLoading } = useQuery<FreeFile[]>({ queryKey: ["/api/files"] });

  const filtered = filter === "all" ? files : files?.filter(f => f.category === filter);
  const totalDownloads = files?.reduce((s, f) => s + f.download_count, 0) ?? 0;

  return (
    <div className="min-h-screen bg-background bg-aurora-page">
      <Navigation />

      <main className="pt-16">
        {/* Hero */}
        <section className="relative py-14 sm:py-20 overflow-hidden">
          <div className="absolute -top-24 left-0 w-96 h-96 bg-primary/6 rounded-full blur-[100px] pointer-events-none animate-glow-pulse" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-400/4 rounded-full blur-[80px] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
            <ScrollReveal>
              <Badge variant="secondary" className="mb-4 text-xs font-semibold px-3 py-1 rounded-full border border-primary/20 bg-primary/8 text-primary tracking-wide uppercase">
                {t.resources.badge}
              </Badge>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                {t.resources.title}
              </h1>
              <div className="h-0.5 w-12 bg-gradient-to-r from-primary to-blue-400 rounded-full mb-4 animate-reveal-line" />
              <p className="text-muted-foreground max-w-xl leading-relaxed mb-8">
                {t.resources.subtitle}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">{files?.length ?? "—"} {t.resources.resources}</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <ArrowDownToLine className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">{totalDownloads}+ {t.resources.downloads}</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Filters */}
        <ScrollReveal delay={80}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-8">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
              {t.resources.filters.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border whitespace-nowrap shrink-0 ${
                    filter === key
                      ? "bg-primary text-white border-primary shadow-sm scale-[1.02]"
                      : "border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-muted/50"
                  }`}
                  data-testid={`filter-resource-${key}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Grid */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
          {isLoading ? (
            <ResourceSkeleton />
          ) : !files?.length ? (
            /* Aucune ressource en base → Bientôt disponible */
            <ScrollReveal>
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-primary/8 border border-primary/20 flex items-center justify-center mx-auto">
                    <Package className="w-9 h-9 text-primary/50" />
                  </div>
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                  Bientôt disponible
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                  Des templates Excel, dashboards Power BI, guides PDF et macros VBA arrivent très prochainement — gratuitement.
                </p>
                <div className="flex items-center gap-2 mt-5 px-4 py-2 rounded-full border border-primary/20 bg-primary/5">
                  <span className="relative flex w-2 h-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-50" />
                    <span className="relative inline-flex rounded-full w-2 h-2 bg-primary" />
                  </span>
                  <span className="text-xs font-semibold text-primary">En préparation</span>
                </div>
              </div>
            </ScrollReveal>
          ) : !filtered?.length ? (
            /* Ressources existent mais pas dans ce filtre */
            <div className="text-center py-20">
              <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">{t.resources.empty}</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((f, i) => (
                <ScrollReveal key={f.id} delay={i * 70}>
                  <ResourceCard file={f} downloadLabel={t.resources.downloadBtn} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
