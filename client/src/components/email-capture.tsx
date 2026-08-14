import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Gift, Send, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/language-context";

interface Props {
  /** D'ou vient l'inscription, stocke tel quel en base : "resources", "footer"... */
  source?: string;
  compact?: boolean;
}

export function EmailCapture({ source = "site", compact = false }: Props) {
  const { lang } = useLanguage();
  const [email, setEmail] = useState("");
  const isFr = lang === "fr";

  const consentText = isFr
    ? "Ajoutez votre email pour bénéficier d'autres informations et produits gratuits."
    : "Add your email to get more information and free resources.";

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, consent_text: consentText }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Erreur");
      return res.json();
    },
  });

  if (isSuccess) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/5 p-4">
        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
        <p className="text-sm text-foreground">
          {isFr ? "C'est noté ! Vous recevrez les prochaines ressources." : "You're in! New resources are on the way."}
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-primary/20 bg-primary/5 ${compact ? "p-4" : "p-5"}`}>
      <div className="flex items-center gap-2 mb-2">
        <Gift className="w-4 h-4 text-primary shrink-0" />
        <p className="text-sm font-bold text-foreground">
          {isFr ? "Ressources gratuites" : "Free resources"}
        </p>
      </div>

      <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">{consentText}</p>

      <form
        onSubmit={(e) => { e.preventDefault(); if (email.trim() && !isPending) mutate(); }}
        className="flex flex-col sm:flex-row gap-2"
      >
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={isFr ? "votre@email.com" : "you@email.com"}
          className="h-10 text-sm bg-background border-border/60 flex-1"
          data-testid="input-subscribe-email"
        />
        <Button
          type="submit"
          disabled={isPending || !email.trim()}
          className="h-10 bg-nexalion hover:opacity-90 font-semibold text-sm shrink-0"
          data-testid="button-subscribe"
        >
          {isPending
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <><Send className="w-4 h-4 mr-1.5" />{isFr ? "Recevoir" : "Get it"}</>}
        </Button>
      </form>

      {isError && (
        <p className="text-xs text-red-500 font-medium mt-2">
          {isFr ? "Adresse invalide ou trop de tentatives. Réessayez." : "Invalid address or too many attempts."}
        </p>
      )}

      <p className="text-[11px] text-muted-foreground/60 mt-2.5">
        {isFr ? "Pas de spam. Désinscription sur simple demande." : "No spam. Unsubscribe anytime."}
      </p>
    </div>
  );
}
