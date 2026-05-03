import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ── Skeleton ─────────────────────────────────────────────────────────────────
export function AdminSkeleton({ rows = 1 }: { rows?: number }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 rounded-xl bg-muted/50 animate-pulse" />
      ))}
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
export function StatCard({
  label, value, icon: Icon, color = "text-primary", sub, accent = "from-primary to-blue-400",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <Card className="border border-border/60 overflow-hidden relative">
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${accent}`} />
      <CardContent className="p-5 pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wide">{label}</p>
            <p className={`text-[2rem] font-bold font-serif leading-none ${color}`}>{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-1.5">{sub}</p>}
          </div>
          <div className="w-10 h-10 rounded-xl bg-muted/60 border border-border/60 flex items-center justify-center shrink-0">
            <Icon className={`w-4.5 h-4.5 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ConfirmDelete({
  trigger,
  title = "Confirmer la suppression",
  description = "Cette action est irréversible.",
  onConfirm,
  loading = false,
}: {
  trigger: React.ReactNode;
  title?: string;
  description?: string;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleConfirm = async () => {
    setBusy(true);
    await onConfirm();
    setBusy(false);
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy || loading}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => { e.preventDefault(); handleConfirm(); }}
            disabled={busy || loading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {(busy || loading) ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Trash2 className="w-3.5 h-3.5 mr-1.5" />}
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const API = {
  get:  (url: string, pw: string) =>
    fetch(url, { headers: { "x-admin-password": pw } }).then(r => r.json()),
  post: (url: string, pw: string, body: unknown) =>
    fetch(url, { method: "POST", headers: { "Content-Type": "application/json", "x-admin-password": pw }, body: JSON.stringify(body) }),
  put:  (url: string, pw: string, body: unknown) =>
    fetch(url, { method: "PUT",  headers: { "Content-Type": "application/json", "x-admin-password": pw }, body: JSON.stringify(body) }),
  del:  (url: string, pw: string) =>
    fetch(url, { method: "DELETE", headers: { "x-admin-password": pw } }),
};

export function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="pb-1">
      <h2 className="font-serif text-xl font-bold text-foreground">{title}</h2>
      {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">{label}</label>
      {children}
    </div>
  );
}
