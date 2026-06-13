import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Send, CheckCircle2, Loader2, User, Mail, MessageSquare, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/language-context";

interface FormData { name: string; email: string; subject: string; message: string; }
const EMPTY: FormData = { name: "", email: "", subject: "", message: "" };

async function submitContact(data: FormData) {
  const res = await fetch("/api/contact/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur lors de l'envoi.");
  return res.json();
}

interface Props {
  compact?: boolean;
}

export function ContactForm({ compact = false }: Props) {
  const { lang } = useLanguage();
  const [form, setForm] = useState<FormData>(EMPTY);

  const labels = {
    name:    lang === "fr" ? "Votre nom"    : "Your name",
    email:   lang === "fr" ? "Votre email"  : "Your email",
    subject: lang === "fr" ? "Sujet"        : "Subject",
    message: lang === "fr" ? "Votre message" : "Your message",
    send:    lang === "fr" ? "Envoyer le message" : "Send message",
    sent:    lang === "fr" ? "Message envoyé !" : "Message sent!",
    sentSub: lang === "fr" ? "Je vous répondrai sous 24h." : "I'll reply within 24h.",
    error:   lang === "fr" ? "Une erreur est survenue. Réessayez." : "Something went wrong. Please try again.",
  };

  const { mutate, isPending, isSuccess, isError, reset } = useMutation({
    mutationFn: submitContact,
    onSuccess: () => { setTimeout(() => { reset(); setForm(EMPTY); }, 6000); },
  });

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const canSubmit = form.name.trim() && form.email.trim() && form.message.trim();

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
        <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7 text-green-500" />
        </div>
        <p className="font-semibold text-foreground">{labels.sent}</p>
        <p className="text-sm text-muted-foreground">{labels.sentSub}</p>
      </div>
    );
  }

  const inputClass = "h-10 text-sm bg-background border-border/60 focus-visible:ring-primary/40";
  const fieldClass = "space-y-1.5";
  const labelClass = "text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5";

  return (
    <form
      onSubmit={e => { e.preventDefault(); if (canSubmit) mutate(form); }}
      className={`space-y-4 ${compact ? "" : ""}`}
    >
      <div className={compact ? "grid sm:grid-cols-2 gap-4" : "grid sm:grid-cols-2 gap-4"}>
        <div className={fieldClass}>
          <label className={labelClass}><User className="w-3 h-3" />{labels.name}</label>
          <Input value={form.name} onChange={set("name")} placeholder="" className={inputClass} data-testid="input-cf-name" />
        </div>
        <div className={fieldClass}>
          <label className={labelClass}><Mail className="w-3 h-3" />{labels.email}</label>
          <Input type="email" value={form.email} onChange={set("email")} placeholder="" className={inputClass} data-testid="input-cf-email" />
        </div>
      </div>

      <div className={fieldClass}>
        <label className={labelClass}><FileText className="w-3 h-3" />{labels.subject}</label>
        <Input value={form.subject} onChange={set("subject")} placeholder="" className={inputClass} data-testid="input-cf-subject" />
      </div>

      <div className={fieldClass}>
        <label className={labelClass}><MessageSquare className="w-3 h-3" />{labels.message}</label>
        <textarea
          value={form.message}
          onChange={set("message")}
          rows={compact ? 4 : 5}
          placeholder=""
          title={lang === "fr" ? "Votre message" : "Your message"}
          className="w-full rounded-md border border-border/60 bg-background px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
          data-testid="input-cf-message"
        />
      </div>

      {isError && (
        <p className="text-xs text-red-500 font-medium">{labels.error}</p>
      )}

      <Button
        type="submit"
        disabled={!canSubmit || isPending}
        className="w-full bg-nexalion hover:opacity-90 font-semibold text-sm h-10 shadow-sm"
        data-testid="button-cf-submit"
      >
        {isPending
          ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{lang === "fr" ? "Envoi…" : "Sending…"}</>
          : <><Send className="w-4 h-4 mr-2" />{labels.send}</>}
      </Button>
    </form>
  );
}
