import { Navigation } from "@/components/navigation";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background bg-aurora-page text-foreground">
      <Navigation />
      <main className="pt-14 sm:pt-16 lg:pt-20">
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
