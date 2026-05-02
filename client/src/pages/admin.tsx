import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Lock, LogOut, Upload, Trash2, Image, Video,
  BarChart3, Globe, Cog, Brain, Eye, CheckCircle,
  X, AlertCircle, Loader2, ImagePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Project, MediaItem } from "@shared/schema";

const ADMIN_PASSWORD_KEY = "kjs_admin_password";

const categoryIcons: Record<string, typeof BarChart3> = {
  data: BarChart3, web: Globe, automation: Cog, ai: Brain,
};

const categoryColors: Record<string, string> = {
  data: "bg-blue-50 text-blue-700 border-blue-200",
  web: "bg-primary/8 text-primary border-primary/20",
  automation: "bg-amber-50 text-amber-700 border-amber-200",
  ai: "bg-purple-50 text-purple-700 border-purple-200",
};

const categoryLabels: Record<string, string> = {
  data: "Data & BI", web: "Web App", automation: "Automatisation", ai: "IA",
};

// ─── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (pw: string) => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    await new Promise((r) => setTimeout(r, 400));
    if (password === "nexalion2024" || password === (import.meta.env.VITE_ADMIN_PASSWORD ?? "nexalion2024")) {
      onLogin(password);
    } else {
      setError(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[hsl(216,20%,98%)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-nexalion shadow-lg mb-5">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Administration</h1>
          <p className="text-sm text-muted-foreground mt-1.5">Portfolio · Kroman Jibhar Samuel</p>
        </div>

        <Card className="border border-border/60 shadow-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">
                  Mot de passe
                </label>
                <Input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(false); }}
                  className={`h-11 ${error ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                  autoFocus
                  data-testid="input-admin-password"
                />
                {error && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Mot de passe incorrect
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={loading || !password}
                className="w-full h-11 bg-nexalion hover:opacity-90 font-semibold"
                data-testid="button-login"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                {loading ? "Vérification…" : "Accéder"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="text-center text-xs text-muted-foreground mt-5">
          Accès réservé à l'administrateur du portfolio
        </p>
      </div>
    </div>
  );
}

// ─── Media Thumbnail ──────────────────────────────────────────────────────────

function MediaThumb({ item, onDelete }: { item: MediaItem; onDelete: () => void }) {
  return (
    <div className="group relative rounded-lg overflow-hidden border border-border/60 aspect-video bg-muted/40">
      {item.media_type === "image" ? (
        <img src={item.url} alt="" className="w-full h-full object-cover" />
      ) : (
        <video src={item.url} className="w-full h-full object-cover" muted />
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
        <button
          onClick={onDelete}
          className="bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
          data-testid={`button-delete-media-${item.id}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="absolute top-1.5 left-1.5">
        <span className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded font-medium shadow-sm ${
          item.media_type === "image"
            ? "bg-white/90 text-blue-700"
            : "bg-white/90 text-purple-700"
        }`}>
          {item.media_type === "image" ? <Image className="w-3 h-3" /> : <Video className="w-3 h-3" />}
          {item.media_type === "image" ? "Photo" : "Vidéo"}
        </span>
      </div>
    </div>
  );
}

// ─── Upload Button ────────────────────────────────────────────────────────────

function UploadButton({
  projectId,
  password,
  accept,
  label,
  icon: Icon,
  variant,
  onSuccess,
}: {
  projectId: string;
  password: string;
  accept: string;
  label: string;
  icon: typeof Image;
  variant: "image" | "video";
  onSuccess: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file, file.name);
      const res = await fetch(`/api/admin/projects/${projectId}/upload`, {
        method: "POST",
        headers: { "x-admin-password": password },
        body: form,
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Erreur lors de l'upload");
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      onSuccess();
    } catch (e: any) {
      setError(e.message || "Erreur upload");
      setTimeout(() => setError(null), 3000);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const colorMap = {
    image: "hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50",
    video: "hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50",
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        data-testid={`input-upload-${variant}-${projectId}`}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-border/60 text-muted-foreground font-medium transition-all ${colorMap[variant]} disabled:opacity-50 disabled:cursor-not-allowed`}
        data-testid={`button-upload-${variant}-${projectId}`}
      >
        {uploading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : success ? (
          <CheckCircle className="w-3.5 h-3.5 text-green-500" />
        ) : (
          <Icon className="w-3.5 h-3.5" />
        )}
        {uploading ? "Upload…" : success ? "Ajouté !" : label}
      </button>
      {error && (
        <p className="text-xs text-red-500 col-span-full flex items-center gap-1">
          <X className="w-3 h-3" />
          {error}
        </p>
      )}
    </>
  );
}

// ─── Project Admin Card ────────────────────────────────────────────────────────

function ProjectAdminCard({
  project,
  password,
  onRefresh,
}: {
  project: Project;
  password: string;
  onRefresh: () => void;
}) {
  const Icon = categoryIcons[project.category] ?? BarChart3;
  const colorClass = categoryColors[project.category] ?? "";
  const mediaItems = project.media ?? [];

  const handleDelete = async (mediaId: string) => {
    try {
      await fetch(`/api/admin/media/${mediaId}`, {
        method: "DELETE",
        headers: { "x-admin-password": password },
      });
      onRefresh();
    } catch (_) {}
  };

  return (
    <Card className="border border-border/60 overflow-hidden" data-testid={`card-admin-${project.id}`}>
      {/* Card header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border/60 bg-muted/20">
        <div className="w-9 h-9 rounded-lg bg-muted/60 border border-border/60 flex items-center justify-center shrink-0">
          <Icon className="w-4.5 h-4.5 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-foreground truncate">{project.title}</h3>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{project.description}</p>
        </div>
        <Badge variant="outline" className={`shrink-0 text-xs font-medium rounded-md border ${colorClass}`}>
          {categoryLabels[project.category]}
        </Badge>
      </div>

      <CardContent className="p-5 space-y-4">
        {/* Medias gallery */}
        {mediaItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {mediaItems.map((item) => (
              <MediaThumb key={item.id} item={item} onDelete={() => handleDelete(item.id)} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-border/60 bg-muted/20 py-6 flex flex-col items-center gap-2 text-center">
            <ImagePlus className="w-7 h-7 text-muted-foreground/50" />
            <p className="text-xs text-muted-foreground">Aucun média · Ajoutez une photo ou vidéo</p>
          </div>
        )}

        {/* Upload controls */}
        <div className="flex flex-wrap gap-2">
          <UploadButton
            projectId={project.id}
            password={password}
            accept="image/*"
            label="Ajouter photo"
            icon={Image}
            variant="image"
            onSuccess={onRefresh}
          />
          <UploadButton
            projectId={project.id}
            password={password}
            accept="video/*"
            label="Ajouter vidéo"
            icon={Video}
            variant="video"
            onSuccess={onRefresh}
          />
          {mediaItems.length > 0 && (
            <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
              <Eye className="w-3.5 h-3.5" />
              {mediaItems.length} fichier{mediaItems.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

function AdminDashboard({
  password,
  onLogout,
}: {
  password: string;
  onLogout: () => void;
}) {
  const qc = useQueryClient();
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["/api/projects"] });

  const totalMedia = projects?.reduce((n, p) => n + (p.media?.length ?? 0), 0) ?? 0;

  return (
    <div className="min-h-screen bg-[hsl(216,20%,98%)]">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-border/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-nexalion flex items-center justify-center text-white font-bold text-xs font-serif shadow-sm">
              KJS
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-foreground">Administration</span>
              <span className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                · Gestion des médias
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 border border-border/60 rounded-full px-3 py-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              Authentifié
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={onLogout}
              className="border-border/60 text-muted-foreground hover:text-foreground text-xs font-medium"
              data-testid="button-logout"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground">Gestion des médias</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Ajoutez des photos et vidéos à chaque projet de votre portfolio.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="bg-white border border-border/60 rounded-xl px-4 py-3 text-center shadow-sm">
                <p className="text-xl font-bold text-foreground font-serif">{projects?.length ?? "—"}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Projets</p>
              </div>
              <div className="bg-white border border-border/60 rounded-xl px-4 py-3 text-center shadow-sm">
                <p className="text-xl font-bold text-primary font-serif">{totalMedia}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Médias</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 bg-primary/5 border border-primary/15 rounded-xl px-4 py-3 mb-8 text-sm text-primary">
          <Upload className="w-4 h-4 mt-0.5 shrink-0" />
          <p>
            <span className="font-semibold">Comment ça marche ·</span>{" "}
            Cliquez sur <strong>Ajouter photo</strong> ou <strong>Ajouter vidéo</strong> sous chaque projet.
            Les médias s'affichent automatiquement sur la carte publique du portfolio.
          </p>
        </div>

        {/* Projects grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-muted/40 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {projects?.map((project) => (
              <ProjectAdminCard
                key={project.id}
                project={project}
                password={password}
                onRefresh={refresh}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// ─── Page Root ────────────────────────────────────────────────────────────────

export default function Admin() {
  const [password, setPassword] = useState<string | null>(() =>
    sessionStorage.getItem(ADMIN_PASSWORD_KEY)
  );

  const handleLogin = (pw: string) => {
    sessionStorage.setItem(ADMIN_PASSWORD_KEY, pw);
    setPassword(pw);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
    setPassword(null);
  };

  if (!password) return <LoginScreen onLogin={handleLogin} />;
  return <AdminDashboard password={password} onLogout={handleLogout} />;
}
