import { Navigation } from "@/components/navigation";
import { ProjectsSection } from "@/components/projects";
import { Footer } from "@/components/footer";

export default function Projects() {
  return (
    <div className="min-h-screen bg-background bg-aurora-page text-foreground">
      <Navigation />
      <main className="pt-14 sm:pt-16 lg:pt-20">
        <ProjectsSection />
      </main>
      <Footer />
    </div>
  );
}
