export default function Home() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-[1280px] flex-col justify-center px-5 py-20 sm:px-8 lg:px-10">
      <p className="eyebrow text-blood">Blood, when it matters</p>
      <h1 className="animate-rise mt-6 max-w-[680px] font-display text-[clamp(3.5rem,7vw,6.7rem)] leading-[.91] tracking-[-.065em]">
        One small act.
        <br />
        <span className="text-blood">A whole life</span> ahead.
      </h1>
      <p className="mt-7 max-w-[520px] text-[17px] leading-8 text-ink-muted">
        RaktoSheba connects hospitals with compatible, nearby donors—so emergency requests move with clarity, care, and
        less waiting.
      </p>
    </section>
  );
}
