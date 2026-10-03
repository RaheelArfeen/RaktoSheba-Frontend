import { Plus } from "lucide-react";
import { faqs } from "@/lib/content";

// Native <details> accordion: works without JavaScript and is keyboard accessible.
export default function FaqList({ limit }: { limit?: number }) {
  return (
    <div className="divide-y divide-ink/10 rounded-[26px] border border-ink/10 bg-cream px-6">
      {faqs.slice(0, limit).map(({ question, answer }) => (
        <details key={question} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-sm font-extrabold [&::-webkit-details-marker]:hidden">
            <span>{question}</span>
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-blush text-blood transition-transform group-open:rotate-45">
              <Plus size={15} />
            </span>
          </summary>
          <p className="max-w-[650px] pt-3 text-sm leading-6 text-ink-muted">{answer}</p>
        </details>
      ))}
    </div>
  );
}
