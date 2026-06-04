import { Navigation } from "@/components/navigation";
import { AboutSection } from "@/components/about-section";
import { Footer } from "@/components/footer";

export default function About() {
  return (
    <div className="min-h-screen bg-background bg-aurora-page text-foreground">
      <Navigation />
      <main className="pt-14 sm:pt-16 lg:pt-20">
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
