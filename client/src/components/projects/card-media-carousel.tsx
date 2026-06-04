import { useState, useCallback } from "react";
import {
  BarChart3, Image as ImageIcon, Play,
  ChevronLeft, ChevronRight, Layers, Eye,
} from "lucide-react";
import { CATEGORY_ICONS, CATEGORY_STYLES, DEFAULT_STYLE } from "@/lib/project-config";
import type { Project } from "@shared/schema";

interface Props {
  project: Project;
  onOpenDialog: () => void;
  viewLabel: string;
}

export function CardMediaCarousel({ project, onOpenDialog, viewLabel }: Props) {
  const [idx, setIdx] = useState(0);
  const [slideClass, setSlideClass] = useState("");
  const style = CATEGORY_STYLES[project.category] ?? DEFAULT_STYLE;
  const Icon = CATEGORY_ICONS[project.category] ?? BarChart3;
  const media = project.media ?? [];
  const count = media.length;

  const navigate = useCallback((dir: 1 | -1, e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideClass(dir === 1 ? "media-slide-right" : "media-slide-left");
    setIdx((i) => (i + dir + count) % count);
    setTimeout(() => setSlideClass(""), 300);
  }, [count]);

  const goTo = useCallback((i: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideClass(i > idx ? "media-slide-right" : "media-slide-left");
    setIdx(i);
    setTimeout(() => setSlideClass(""), 300);
  }, [idx]);

  if (count === 0) {
    return (
      <div
        className={`relative w-full aspect-video bg-gradient-to-br ${style.gradient} flex flex-col items-center justify-center overflow-hidden border-b border-border/40 cursor-pointer`}
        onClick={onOpenDialog}
      >
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/8 blur-2xl" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/8 blur-xl" />
        <Icon className={`w-14 h-14 ${style.iconColor} relative z-10 transition-transform duration-300 group-hover:scale-110`} />
        <div className="flex items-center gap-1.5 mt-3 relative z-10">
          <Layers className="w-3 h-3 text-muted-foreground/40" />
          <span className="text-[11px] text-muted-foreground/50 font-medium">Aucun média · Ajoutez via l'admin</span>
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 flex items-center justify-center transition-all duration-200">
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-2 bg-black/40 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
            <Eye className="w-3 h-3" /> {viewLabel}
          </div>
        </div>
      </div>
    );
  }

  const current = media[idx];

  return (
    <div
      className="relative w-full aspect-video overflow-hidden bg-black border-b border-border/40 group/carousel cursor-pointer"
      onClick={onOpenDialog}
    >
      <div key={`${project.id}-${idx}`} className={`w-full h-full ${slideClass}`}>
        {current.media_type === "image" ? (
          <img
            src={current.url}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover/carousel:scale-[1.03]"
          />
        ) : (
          <>
            <video src={current.url} className="w-full h-full object-cover" muted playsInline />
            <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg transition-transform duration-200 group-hover/carousel:scale-110">
                <Play className="w-5 h-5 text-foreground ml-0.5" />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

      {count > 1 && (
        <>
          <button
            onClick={(e) => navigate(-1, e)}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-150 opacity-0 group-hover/carousel:opacity-100 hover:scale-110 active:scale-95 z-20"
            aria-label="Précédent"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => navigate(1, e)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-150 opacity-0 group-hover/carousel:opacity-100 hover:scale-110 active:scale-95 z-20"
            aria-label="Suivant"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {count > 1 && (
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {media.map((_, i) => (
            <button
              key={i}
              onClick={(e) => goTo(i, e)}
              className={`h-1.5 rounded-full transition-all duration-250 ${
                i === idx ? "bg-white dot-active shadow-md" : "bg-white/50 w-1.5 hover:bg-white/80"
              }`}
              style={i === idx ? { width: "1.5rem" } : { width: "0.375rem" }}
              aria-label={`Média ${i + 1}`}
            />
          ))}
        </div>
      )}

      <span className={`absolute top-2.5 left-2.5 flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full font-semibold backdrop-blur-sm shadow-sm z-10 ${
        current.media_type === "image" ? "bg-white/88 text-blue-700" : "bg-white/88 text-purple-700"
      }`}>
        {current.media_type === "image" ? <ImageIcon className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
        {count > 1 ? `${idx + 1} / ${count}` : (current.media_type === "image" ? "Photo" : "Vidéo")}
      </span>

      <div className="absolute inset-0 bg-black/0 group-hover/carousel:bg-black/10 transition-all duration-200 pointer-events-none z-10" />
    </div>
  );
}
