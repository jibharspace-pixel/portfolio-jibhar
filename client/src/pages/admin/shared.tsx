import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export function AdminSkeleton() {
  return <div className="h-16 rounded-xl bg-muted/40 animate-pulse" />;
}

export function StatCard({
  label, value, icon: Icon, color = "text-primary", sub,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  sub?: string;
}) {
  return (
    <Card className="border border-border/60">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-1">{label}</p>
            <p className={`text-3xl font-bold font-serif ${color}`}>{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
          </div>
          <div className="w-10 h-10 rounded-xl bg-muted/60 border border-border/60 flex items-center justify-center">
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const API = {
  get: (url: string, pw: string) =>
    fetch(url, { headers: { "x-admin-password": pw } }).then(r => r.json()),
  post: (url: string, pw: string, body: unknown) =>
    fetch(url, { method: "POST", headers: { "Content-Type": "application/json", "x-admin-password": pw }, body: JSON.stringify(body) }),
  put: (url: string, pw: string, body: unknown) =>
    fetch(url, { method: "PUT", headers: { "Content-Type": "application/json", "x-admin-password": pw }, body: JSON.stringify(body) }),
  del: (url: string, pw: string) =>
    fetch(url, { method: "DELETE", headers: { "x-admin-password": pw } }),
};
