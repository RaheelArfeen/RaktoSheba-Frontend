import type { LucideIcon } from "lucide-react";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-[26px] border border-dashed border-ink/15 bg-cream px-6 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-mint text-forest">
        <Icon className="size-6" />
      </span>
      <p className="mt-5 font-display text-2xl tracking-[-.04em]">{title}</p>
      <p className="mt-2 max-w-sm text-sm leading-6 text-ink-muted">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
