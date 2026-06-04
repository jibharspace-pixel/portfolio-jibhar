import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { QuoteSection } from "@/components/quote-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background bg-aurora-page text-foreground">
      <Navigation />
      <main>
        <HeroSection />
        <QuoteSection />
      </main>
      <Footer />
    </div>
  );
}
