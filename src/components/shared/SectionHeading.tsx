import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** "split": title left, description right (wide screens). "stack": description under the title. */
  layout?: "split" | "stack";
  tone?: "light" | "dark";
  eyebrowClassName?: string;
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  layout = "stack",
  tone = "light",
  eyebrowClassName,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        layout === "split" ? "grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16" : "max-w-[560px]",
        className,
      )}
    >
      <div className={layout === "split" ? "max-w-[620px]" : undefined}>
        <p className={cn("eyebrow mb-4", tone === "dark" ? "text-mint-strong" : "text-blood", eyebrowClassName)}>{eyebrow}</p>
        <h2 className="font-display text-5xl leading-[.96] tracking-[-.06em] sm:text-6xl">{title}</h2>
      </div>
      {description && (
        <p
          className={cn(
            "leading-7",
            layout === "split" ? "max-w-[420px]" : "mt-6",
            tone === "dark" ? "text-[#f2d8ca]/80" : "text-ink-muted",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
