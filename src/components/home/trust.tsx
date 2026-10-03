import { FileCheck2, LockKeyhole, ShieldCheck, Stethoscope } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";

const pillars = [
  { icon: FileCheck2, label: "Verified requests" },
  { icon: LockKeyhole, label: "Safe acceptance" },
  { icon: Stethoscope, label: "Care-led flow" },
];

export function TrustSection() {
  return (
    <section id="safety" className="scroll-mt-24 py-24">
      <Container>
        <div className="grid gap-10 rounded-[34px] bg-mint p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <Eyebrow className="mb-4 text-forest">Built for trust</Eyebrow>
            <h2 className="max-w-[650px] font-display text-3xl leading-[1.1] tracking-[-.015em] text-forest-deep sm:text-4xl">
              Good intentions deserve a good system.
            </h2>
            <p className="mt-5 max-w-[620px] leading-7 text-[#4a806c]">
              From hospital verification to 90-day donor eligibility and audit-ready status changes, RaktoSheba makes the safe path
              the easy path.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {pillars.map(({ icon: Icon, label }) => (
                <div key={label} className="rounded-2xl bg-white/40 p-4">
                  <Icon size={19} className="text-forest" />
                  <p className="mt-3 text-xs font-extrabold text-forest-deep">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid size-36 place-items-center rounded-full border border-forest/15 bg-mint-strong/70 text-forest shadow-inner">
            <ShieldCheck size={48} strokeWidth={1.5} />
          </div>
        </div>
      </Container>
    </section>
  );
}
