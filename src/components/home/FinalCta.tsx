import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FinalCta() {
  return (
    <section className="page-container pb-24">
      <div className="relative overflow-hidden rounded-[34px] bg-blood px-8 py-14 text-center text-cream sm:px-12 sm:py-20">
        <div className="absolute -top-28 -right-20 size-80 rounded-full border-[40px] border-white/10" />
        <div className="absolute -bottom-40 left-10 size-72 rounded-full border-[35px] border-white/10" />
        <p className="eyebrow relative text-[#f4c8b1]">Your next good day starts here</p>
        <h2 className="relative mx-auto mt-5 max-w-[680px] font-display text-5xl leading-[.95] tracking-[-.06em] sm:text-6xl">
          Be the reason someone gets home.
        </h2>
        <Link
          href="/register"
          className="relative mt-9 inline-flex items-center gap-3 rounded-full bg-cream px-6 py-4 text-sm font-extrabold text-blood shadow-lg transition-all hover:-translate-y-1 active:scale-[.98]"
        >
          Join RaktoSheba <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}
