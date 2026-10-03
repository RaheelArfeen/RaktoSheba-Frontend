import type { Metadata } from "next";
import { Ban, Building2, ClipboardList, HeartHandshake, Users } from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { adminApi } from "@/lib/admin";
import { requestStatusLabel } from "@/lib/emergency";
import { getSession } from "@/lib/session";
import type { RequestStatus } from "@/types";

export const metadata: Metadata = { title: "Admin dashboard" };

export default async function AdminDashboard() {
  const session = (await getSession())!;
  const a = await adminApi.analytics(session.accessToken);

  const cards = [
    { icon: Users, label: "Donors", value: a.donors.total, note: `${a.donors.available} available now`, tone: "bg-mint text-forest" },
    { icon: Building2, label: "Hospitals", value: a.hospitals.total, note: `${a.hospitals.verified} verified`, tone: "bg-blush text-blood" },
    { icon: HeartHandshake, label: "Donations", value: a.donationsCompleted, note: "completed", tone: "bg-sand text-sand-deep" },
    { icon: Ban, label: "Banned users", value: a.bannedUsers, note: "accounts blocked", tone: "bg-linen text-ink-muted" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <Eyebrow>Admin workspace</Eyebrow>
        <h1 className="mt-2 font-display text-5xl tracking-[-.05em]">The network, at a glance.</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ icon: Icon, label, value, note, tone }) => (
          <div key={label} className="rounded-[24px] border border-ink/10 bg-cream p-6">
            <span className={`grid size-10 place-items-center rounded-xl ${tone}`}>
              <Icon size={18} />
            </span>
            <p className="mt-4 text-sm font-bold text-ink-muted">{label}</p>
            <p className="mt-1 font-display text-4xl tracking-[-.04em]">{value}</p>
            <p className="mt-1 text-xs font-semibold text-ink-faint">{note}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[24px] border border-ink/10 bg-cream p-6">
        <div className="flex items-center gap-2">
          <ClipboardList size={18} className="text-blood" />
          <p className="font-extrabold">Requests by status · {a.requests.total} total</p>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-5">
          {(Object.keys(a.requests.byStatus) as RequestStatus[]).map((status) => (
            <div key={status} className="rounded-2xl bg-paper p-4">
              <p className="font-display text-3xl">{a.requests.byStatus[status]}</p>
              <p className="mt-1 text-xs font-bold text-ink-muted">{requestStatusLabel[status]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
