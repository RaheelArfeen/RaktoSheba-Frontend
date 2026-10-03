import { BLOOD_GROUPS, bloodGroupLabel, canDonate } from "@/lib/blood";

// Full donor → recipient chart, computed from the same rule the backend uses.
export default function CompatibilityMatrix() {
  return (
    <div className="relative overflow-x-auto rounded-[26px] border border-ink/10 bg-cream p-4 sm:p-6">
      <table className="w-full min-w-[560px] table-fixed border-collapse text-center">
        <caption className="sr-only">Blood compatibility: which donor groups can give to which recipients</caption>
        <thead>
          <tr>
            <th scope="col" className="w-28 p-2 text-left text-[10px] font-extrabold tracking-[.12em] text-ink-faint uppercase">
              Donor ↓ · Patient →
            </th>
            {BLOOD_GROUPS.map((g) => (
              <th key={g} scope="col" className="border-b border-ink/15 p-2 font-display text-xl font-normal">
                {bloodGroupLabel[g]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {BLOOD_GROUPS.map((donor) => (
            <tr key={donor} className="group">
              <th scope="row" className="border-r border-ink/15 p-2 text-left font-display text-xl font-normal group-hover:text-blood">
                {bloodGroupLabel[donor]}
              </th>
              {BLOOD_GROUPS.map((recipient) => {
                const ok = canDonate(donor, recipient);
                return (
                  <td key={recipient} className="border-b border-ink/5 py-3 group-hover:bg-paper">
                    <span className={`mx-auto block size-3 rounded-full ${ok ? "bg-blood" : "border border-ink/15"}`} aria-hidden />
                    <span className="sr-only">{ok ? "Compatible" : "Not compatible"}</span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 flex items-center gap-4 text-xs font-semibold text-ink-muted">
        <span className="flex items-center gap-1.5"><span className="size-3 rounded-full bg-blood" /> Can donate</span>
        <span className="flex items-center gap-1.5"><span className="size-3 rounded-full border border-ink/15" /> Not compatible</span>
      </p>
    </div>
  );
}
