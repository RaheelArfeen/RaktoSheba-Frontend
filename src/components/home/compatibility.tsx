import { CalendarCheck, MapPin, Zap } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";

const highlights = [
  { group: "O−", label: "The universal donor", detail: "Can help every blood group in an emergency", tone: "bg-blush text-blood" },
  { group: "O+", label: "The everyday hero", detail: "One of the most requested types across the network", tone: "bg-mint text-forest" },
  { group: "AB+", label: "The universal recipient", detail: "Can receive from every ABO/Rh group", tone: "bg-sand text-sand-deep" },
  { group: "A− / B−", label: "The rare match", detail: "Small networks make every eligible donor count", tone: "bg-paper text-blood" },
];

export function CompatibilitySection() {
  return (
    <section id="compatibility" className="scroll-mt-24 bg-sand py-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <div className="max-w-[620px]">
            <Eyebrow className="mb-4 text-sand-deep">Matching, made legible</Eyebrow>
            <h2 className="font-display text-5xl leading-[1.08] tracking-[-.02em] sm:text-6xl">Compatibility is more than a dropdown.</h2>
          </div>
          <p className="max-w-[420px] leading-7 text-ink-muted">
            The matching engine looks at blood type, availability, donor eligibility and proximity together—so a “match” is actually
            useful.
          </p>
        </div>
        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((row) => (
            <div key={row.group} className="rounded-[23px] border border-ink/10 bg-cream/80 p-5 transition-all hover:-translate-y-1 hover:bg-cream">
              <div className={`grid size-14 place-items-center rounded-[18px] text-lg font-extrabold ${row.tone}`}>{row.group}</div>
              <h3 className="mt-5 text-sm font-extrabold">{row.label}</h3>
              <p className="mt-2 text-xs leading-5 text-ink-muted">{row.detail}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs font-bold text-ink-muted">
          <span className="flex items-center gap-2">
            <Zap size={15} className="text-blood" /> ABO/Rh compatibility engine
          </span>
          <span className="flex items-center gap-2">
            <MapPin size={15} className="text-forest" /> Nearby-first ranking
          </span>
          <span className="flex items-center gap-2">
            <CalendarCheck size={15} className="text-sand-deep" /> 90-day eligibility rule
          </span>
        </div>
      </Container>
    </section>
  );
}
