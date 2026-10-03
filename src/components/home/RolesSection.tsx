import Link from "next/link";
import { ArrowRight, Building2, HandHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/shared/SectionHeading";

export default function RolesSection() {
  return (
    <section className="border-y border-ink/10 bg-cream py-24">
      <div className="page-container">
        <SectionHeading
          layout="split"
          eyebrow="One network, two ways to help"
          title="The right experience for your role."
          description="RaktoSheba is intentionally simple on both sides of the match—so people can focus on care, not coordination."
        />
        <div className="mt-14 grid gap-4 lg:grid-cols-2">
          <div className="group relative overflow-hidden rounded-[28px] bg-mint p-7 sm:p-9">
            <div className="absolute -top-12 -right-12 size-48 rounded-full border-[26px] border-mint-strong/70 transition-transform duration-300 group-hover:scale-110" />
            <div className="relative">
              <span className="grid size-12 place-items-center rounded-2xl bg-mint-strong text-forest">
                <HandHeart size={23} />
              </span>
              <p className="eyebrow mt-12 text-forest">For donors</p>
              <h3 className="mt-3 max-w-[350px] font-display text-4xl leading-[.96] tracking-[-.05em] text-forest-deep">
                Turn readiness into real impact.
              </h3>
              <p className="mt-5 max-w-[410px] leading-7 text-[#4a806c]">
                Keep your blood group and availability current, see only compatible requests, and accept when the moment
                is right for you.
              </p>
              <Button asChild variant="secondary" className="mt-7">
                <Link href="/register?role=donor">
                  Create donor profile <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-[28px] bg-blush p-7 sm:p-9">
            <div className="absolute -right-12 -bottom-16 size-52 rounded-full border-[30px] border-blush-deep/70 transition-transform duration-300 group-hover:scale-110" />
            <div className="relative">
              <span className="grid size-12 place-items-center rounded-2xl bg-blush-deep text-blood">
                <Building2 size={23} />
              </span>
              <p className="eyebrow mt-12 text-blood">For hospitals</p>
              <h3 className="mt-3 max-w-[350px] font-display text-4xl leading-[.96] tracking-[-.05em] text-blood-deep">
                Make the next step obvious.
              </h3>
              <p className="mt-5 max-w-[410px] leading-7 text-[#87584e]">
                Post the request once, follow verification, and see nearby compatible donors without chasing disconnected
                lists.
              </p>
              <Button asChild className="mt-7">
                <Link href="/register?role=hospital">
                  Register your hospital <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
