import { useState } from "react";
import { Image as ImageIcon, Play, ChevronLeft, ChevronRight } from "lucide-react";
import type { MediaItem } from "@shared/schema";

interface Props {
  items: MediaItem[];
}

export function DialogMediaCarousel({ items }: Props) {
  const [idx, setIdx] = useState(0);
  const [slideClass, setSlideClass] = useState("");

  if (!items.length) return null;

  const current = items[idx];
  const count = items.length;

  const navigate = (dir: 1 | -1) => {
    setSlideClass(dir === 1 ? "media-slide-right" : "media-slide-left");
    setIdx((i) => (i + dir + count) % count);
    setTimeout(() => setSlideClass(""), 300);
  };

  return (
    <div className="space-y-3">
      <div className="relative rounded-xl overflow-hidden bg-black aspect-video shadow-md">
        <div key={`dialog-${idx}`} className={`w-full h-full ${slideClass}`}>
          {current.media_type === "image" ? (
            <img src={current.url} alt="" className="w-full h-full object-contain" />
          ) : (
            <video src={current.url} controls className="w-full h-full object-contain" />
          )}
        </div>

        <span className={`absolute top-3 left-3 flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold shadow backdrop-blur-sm z-10 ${
          current.media_type === "image" ? "bg-white/90 text-blue-700" : "bg-white/90 text-purple-700"
        }`}>
          {current.media_type === "image" ? <ImageIcon className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          {current.media_type === "image" ? "Photo" : "Vidéo"}
        </span>

        {count > 1 && (
          <span className="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full bg-black/55 text-white font-medium backdrop-blur-sm">
            {idx + 1} / {count}
          </span>
        )}

        {count > 1 && (
          <>
            <button onClick={() => navigate(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/45 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm hover:scale-110 active:scale-95">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => navigate(1)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/45 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm hover:scale-110 active:scale-95">
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  style={i === idx ? { width: "1.5rem" } : { width: "0.5rem" }}
                  className={`h-2 rounded-full transition-all duration-250 ${i === idx ? "bg-white shadow" : "bg-white/50 hover:bg-white/80"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {items.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setIdx(i)}
              className={`shrink-0 w-16 h-11 rounded-lg overflow-hidden border-2 transition-all ${
                i === idx ? "border-primary shadow-[0_0_0_2px_hsl(216,90%,40%,0.2)]" : "border-transparent opacity-50 hover:opacity-90"
              }`}
            >
              {item.media_type === "image" ? (
                <img src={item.url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Play className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
