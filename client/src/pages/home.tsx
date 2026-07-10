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
