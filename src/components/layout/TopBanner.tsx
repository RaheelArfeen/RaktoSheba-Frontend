// Thin strip above the header. Phase 2 turns it into a live emergency alert.
export default function TopBanner() {
  return (
    <div className="bg-maroon px-4 py-2 text-center text-[11px] font-semibold tracking-[.18em] text-[#f7d6ba] uppercase">
      <span className="mr-2 inline-block size-1.5 rounded-full bg-mint-strong align-middle" aria-hidden />
      A faster way to find a compatible blood donor
    </div>
  );
}
