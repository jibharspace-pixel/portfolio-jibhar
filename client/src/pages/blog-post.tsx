import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, Clock, Calendar, Tag, Eye, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import type { BlogPost } from "@shared/schema";

const categoryColors: Record<string, string> = {
  logistique: "bg-blue-50 text-blue-700 border-blue-200",
  automatisation: "bg-amber-50 text-amber-700 border-amber-200",
  data: "bg-primary/8 text-primary border-primary/20",
  ia: "bg-purple-50 text-purple-700 border-purple-200",
  web: "bg-green-50 text-green-700 border-green-200",
};

const categoryGradients: Record<string, string> = {
  logistique: "from-blue-500 to-blue-600",
  automatisation: "from-amber-500 to-orange-500",
  data: "from-primary to-blue-500",
  ia: "from-purple-500 to-violet-600",
  web: "from-green-500 to-emerald-600",
};

function renderContent(content: string) {
  return content.split("\n\n").map((block, i) => {
    if (block.startsWith("## ")) {
      return <h2 key={i} className="font-serif text-xl font-bold text-foreground mt-8 mb-3">{block.slice(3)}</h2>;
    }
    if (block.startsWith("### ")) {
      return <h3 key={i} className="font-serif text-lg font-semibold text-foreground mt-6 mb-2">{block.slice(4)}</h3>;
    }
    if (block.startsWith("```")) {
      const code = block.replace(/^```\w*\n?/, "").replace(/```$/, "");
      return (
        <pre key={i} className="bg-muted/60 border border-border/60 rounded-xl p-4 overflow-x-auto text-xs font-mono text-foreground my-4">
          <code>{code}</code>
        </pre>
      );
    }
    if (block.match(/^\d+\.\s/)) {
      const items = block.split("\n").filter(Boolean);
      return (
        <ol key={i} className="list-decimal list-inside space-y-1.5 my-4 text-[15px] leading-relaxed text-foreground/90">
          {items.map((item, j) => <li key={j}>{item.replace(/^\d+\.\s/, "")}</li>)}
        </ol>
      );
    }
    return (
      <p key={i} className="text-[15px] leading-[1.8] text-foreground/85 my-3">{block}</p>
    );
  });
}

export default function BlogPostPage({ slug }: { slug: string }) {
  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ["/api/blog", slug],
    queryFn: () => fetch(`/api/blog/${slug}`).then(r => { if (!r.ok) throw new Error("Not found"); return r.json(); }),
  });

  const gradient = post ? (categoryGradients[post.category] ?? "from-primary to-blue-500") : "from-primary to-blue-500";
  const colorClass = post ? (categoryColors[post.category] ?? "") : "";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-16">
        {isLoading ? (
          <div className="max-w-3xl mx-auto px-6 py-16 space-y-4">
            <Skeleton className="h-8 w-48 mb-8" />
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : error || !post ? (
          <div className="max-w-3xl mx-auto px-6 py-24 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Article introuvable</h2>
            <p className="text-muted-foreground mb-6">Cet article n'existe pas ou a été supprimé.</p>
            <Link href="/blog">
              <button className="flex items-center gap-2 text-primary font-medium mx-auto hover:underline">
                <ArrowLeft className="w-4 h-4" /> Retour au blog
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Hero cover */}
            <div className={`relative h-56 sm:h-72 bg-gradient-to-br ${gradient} overflow-hidden`}>
              <div className="absolute inset-0 bg-grid opacity-10" />
              <BookOpen className="absolute right-16 top-1/2 -translate-y-1/2 w-32 h-32 text-white/10" />
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
            </div>

            <article className="max-w-3xl mx-auto px-6 lg:px-8 pb-24 -mt-6 relative">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
                <Link href="/"><span className="hover:text-primary cursor-pointer">Accueil</span></Link>
                <span>/</span>
                <Link href="/blog"><span className="hover:text-primary cursor-pointer">Blog</span></Link>
                <span>/</span>
                <span className="text-foreground truncate max-w-[200px]">{post.title}</span>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <Badge variant="outline" className={`text-xs font-medium rounded-md border ${colorClass}`}>
                  {post.category}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />{post.read_time} min de lecture
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />{post.created_at}
                </span>
                {(post.view_count ?? 0) > 0 && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Eye className="w-3 h-3" />{post.view_count} vues
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight mb-4">
                {post.title}
              </h1>
              <p className="text-muted-foreground text-base leading-relaxed mb-8 pb-8 border-b border-border/60">
                {post.excerpt}
              </p>

              {/* Content */}
              <div className="prose-container">
                {renderContent(post.content)}
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mt-10 pt-6 border-t border-border/60 flex items-center gap-2 flex-wrap">
                  <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                  {post.tags.map(tag => (
                    <span key={tag} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Back link */}
              <div className="mt-10">
                <Link href="/blog">
                  <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
                    <ArrowLeft className="w-4 h-4" />
                    Retour au blog
                  </button>
                </Link>
              </div>
            </article>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
