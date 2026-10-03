// Title block at the top of inner public pages.
export default function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-ink/10">
      <div className="absolute -top-24 -right-24 -z-10 size-[380px] rounded-full bg-mint/40 blur-3xl" />
      <div className="page-container py-14 sm:py-16">
        <p className="eyebrow text-blood">{eyebrow}</p>
        <h1 className="mt-4 max-w-[820px] font-display text-5xl leading-[.95] tracking-[-.06em] sm:text-6xl">{title}</h1>
        {description && <p className="mt-5 max-w-[620px] text-[17px] leading-8 text-ink-muted">{description}</p>}
        {children}
      </div>
    </section>
  );
}
