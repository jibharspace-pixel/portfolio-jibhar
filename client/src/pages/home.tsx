import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { ServicesStrip } from "@/components/services-strip";
import { AboutPreview } from "@/components/about-preview";
import { ProjectsPreviewSection, BlogPreviewSection } from "@/components/home-previews";
import { QuoteSection } from "@/components/quote-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background bg-aurora-page text-foreground">
      <Navigation />
      <main>
        <HeroSection />

        {/* Tagline strip */}
        <div className="relative bg-primary overflow-hidden py-5 lg:py-6">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between gap-6">
            <div>
              <p className="text-white/60 text-[11px] font-semibold tracking-[0.18em] uppercase mb-0.5 select-none">
                Bienvenue sur ma page · Je suis Kroman Jibhar Samuel
              </p>
              <p className="font-sans font-black text-[1.35rem] sm:text-[1.75rem] lg:text-[2.1rem] tracking-tight text-white uppercase leading-none select-none">
                Logisticien &amp; Dev Full-Stack
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <span className="w-2 h-2 rounded-full bg-white/40" />
              <span className="w-2 h-2 rounded-full bg-white/25" />
              <span className="w-2 h-2 rounded-full bg-white/12" />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-px bg-black/10" />
        </div>

        <ServicesStrip />
        <AboutPreview />
        <ProjectsPreviewSection />
        <BlogPreviewSection />
        <QuoteSection />
      </main>
      <Footer />
    </div>
  );
}
