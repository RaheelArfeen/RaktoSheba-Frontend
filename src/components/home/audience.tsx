import { ArrowRight, Building2, HandHeart } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";

/** Donor and hospital entry points. */
export function AudienceSection() {
  return (
    <section className="border-y border-ink/10 bg-cream py-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <div className="max-w-[620px]">
            <Eyebrow className="mb-4">One network, two ways to help</Eyebrow>
            <h2 className="font-display text-4xl leading-[1.08] tracking-[-.02em] sm:text-5xl lg:text-6xl">The right experience for your role.</h2>
          </div>
          <p className="max-w-[420px] leading-7 text-ink-muted">
            RaktoSheba is intentionally simple on both sides of the match—so people can focus on care, not coordination.
          </p>
        </div>
        <div className="mt-14 grid gap-4 lg:grid-cols-2">
          <div className="group relative overflow-hidden rounded-[28px] bg-mint p-7 sm:p-9">
            <div className="absolute -top-12 -right-12 size-48 rounded-full border-[26px] border-mint-strong/70 transition-transform duration-300 group-hover:scale-110" />
            <div className="relative">
              <span className="grid size-12 place-items-center rounded-2xl bg-mint-strong text-forest">
                <HandHeart size={23} />
              </span>
              <Eyebrow className="mt-12 text-forest">For donors</Eyebrow>
              <h3 className="mt-3 max-w-[350px] font-display text-4xl leading-[1.08] tracking-[-.015em] text-forest-deep">Turn readiness into real impact.</h3>
              <p className="mt-5 max-w-[410px] leading-7 text-[#4a806c]">
                Keep your blood group and availability current, see only compatible requests, and accept when the moment is right
                for you.
              </p>
              <ButtonLink href="/auth/register?role=donor" variant="forest" className="mt-7">
                Create donor profile <ArrowRight />
              </ButtonLink>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-[28px] bg-blush p-7 sm:p-9">
            <div className="absolute -right-12 -bottom-16 size-52 rounded-full border-[30px] border-blush-deep/70 transition-transform duration-300 group-hover:scale-110" />
            <div className="relative">
              <span className="grid size-12 place-items-center rounded-2xl bg-blush-deep text-blood">
                <Building2 size={23} />
              </span>
              <Eyebrow className="mt-12">For hospitals</Eyebrow>
              <h3 className="mt-3 max-w-[350px] font-display text-4xl leading-[1.08] tracking-[-.015em] text-blood-deep">Make the next step obvious.</h3>
              <p className="mt-5 max-w-[410px] leading-7 text-[#87584e]">
                Post the request once, follow verification, and see nearby compatible donors without chasing disconnected lists.
              </p>
              <ButtonLink href="/auth/register?role=hospital" className="mt-7">
                Register your hospital <ArrowRight />
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
