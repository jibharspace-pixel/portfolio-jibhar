import { useState } from "react";
import { FileText } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { ContactForm } from "@/components/contact-form";
import { useLanguage } from "@/lib/language-context";

interface Props {
  trigger: React.ReactNode;
}

export function DevisDialog({ trigger }: Props) {
  const [open, setOpen] = useState(false);
  const { lang } = useLanguage();

  return (
    <>
      <span onClick={() => setOpen(true)} className="cursor-pointer">
        {trigger}
      </span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-primary to-blue-400" />
          <div className="p-6">
            <DialogHeader className="mb-5">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-bold leading-tight">
                    {lang === "fr" ? "Demander un devis" : "Request a quote"}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                    {lang === "fr" ? "Réponse sous 24h · Consultation gratuite" : "Reply within 24h · Free consultation"}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <ContactForm compact />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
