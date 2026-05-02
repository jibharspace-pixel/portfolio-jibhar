import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Clock, Calendar, Tag, ArrowRight, BookOpen, Search } from "lucide-react";
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

const filters = [
  { key: "all", label: "Tous" },
  { key: "logistique", label: "Logistique" },
  { key: "data", label: "Data & BI" },
  { key: "automatisation", label: "Automatisation" },
  { key: "ia", label: "IA" },
];

function BlogSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1,2,3,4,5,6].map(i => (
        <div key={i} className="rounded-2xl border border-border/60 overflow-hidden">
          <Skeleton className="h-40" />
          <div className="p-5">
            <Skeleton className="h-4 w-20 mb-3" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  const gradient = categoryGradients[post.category] ?? "from-primary to-blue-500";
  const colorClass = categoryColors[post.category] ?? "bg-muted text-muted-foreground";

  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`}>
        <article
          className="group cursor-pointer rounded-2xl border border-border/60 overflow-hidden hover:border-primary/30 hover:shadow-[0_8px_40px_hsl(216,90%,40%,0.12)] transition-all duration-300 hover:-translate-y-1 md:col-span-2 lg:col-span-3 grid md:grid-cols-2"
          data-testid={`card-blog-${post.id}`}
        >
          {/* Cover */}
          <div className={`relative h-52 md:h-auto bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
            <BookOpen className="w-20 h-20 text-white/20" />
            <div className="absolute top-4 left-4">
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
                À la une
              </span>
            </div>
          </div>
          {/* Content */}
          <div className="p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className={`text-xs font-medium rounded-md border ${colorClass}`}>
                  {post.category}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />{post.read_time} min
                </span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-foreground leading-tight mb-3 group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
            </div>
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/60">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {post.created_at}
              </span>
              <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                Lire l'article
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`}>
      <article
        className="group cursor-pointer rounded-2xl border border-border/60 overflow-hidden hover:border-primary/30 hover:shadow-[0_8px_30px_hsl(216,90%,40%,0.12)] transition-all duration-300 hover:-translate-y-1"
        data-testid={`card-blog-${post.id}`}
      >
        {/* Cover */}
        <div className={`h-36 bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}>
          <BookOpen className="w-12 h-12 text-white/25" />
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        {/* Content */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2.5">
            <Badge variant="outline" className={`text-xs font-medium rounded-md border ${colorClass}`}>
              {post.category}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />{post.read_time} min
            </span>
          </div>
          <h3 className="font-serif font-bold text-foreground leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />{post.created_at}
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-primary">
              Lire <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function Blog() {
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event_type: "pageview", path: "/blog" }) }).catch(() => {});
  }, []);

  const { data: posts, isLoading } = useQuery<BlogPost[]>({ queryKey: ["/api/blog"] });

  const filtered = filter === "all" ? posts : posts?.filter(p => p.category === filter);
  const [featured, ...rest] = filtered ?? [];

  return (
    <div className="min-h-screen bg-background bg-aurora-page">
      <Navigation />

      <main className="pt-16">
        {/* Hero */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute -top-24 right-0 w-80 h-80 bg-primary/8 rounded-full blur-[80px] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
            <Badge variant="secondary" className="mb-4 text-xs font-semibold px-3 py-1 rounded-full border border-primary/20 bg-primary/8 text-primary tracking-wide uppercase">
              Blog
            </Badge>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Articles & Insights
            </h1>
            <div className="h-0.5 w-12 bg-primary rounded-full mb-4" />
            <p className="text-muted-foreground max-w-xl leading-relaxed">
              Explorez mes articles sur la logistique, l'analyse de données, l'automatisation et l'intelligence artificielle.
            </p>
          </div>
        </section>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-6">
          <div className="flex flex-wrap gap-2">
            {filters.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all border ${
                  filter === key
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-muted/50"
                }`}
                data-testid={`filter-blog-${key}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Posts grid */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
          {isLoading ? <BlogSkeleton /> : !filtered?.length ? (
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun article dans cette catégorie.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured && <BlogCard post={featured} featured />}
              {rest.map(p => <BlogCard key={p.id} post={p} />)}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
