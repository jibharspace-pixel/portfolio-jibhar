import { Mail } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ContactForm } from "@/components/contact-form";
import { useLanguage } from "@/lib/language-context";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactDialog({ open, onOpenChange }: Props) {
  const { lang } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif text-xl">
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-primary" />
            </span>
            {lang === "fr" ? "Me contacter" : "Get in touch"}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {lang === "fr"
              ? "Décrivez votre besoin, je vous réponds sous 24h."
              : "Tell me about your project, I'll reply within 24h."}
          </DialogDescription>
        </DialogHeader>

        <div className="pt-1">
          <ContactForm compact />
        </div>
      </DialogContent>
    </Dialog>
  );
}
