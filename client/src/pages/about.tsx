import { Navigation } from "@/components/navigation";
import { AboutSection } from "@/components/about-section";
import { Footer } from "@/components/footer";

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-20">
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
