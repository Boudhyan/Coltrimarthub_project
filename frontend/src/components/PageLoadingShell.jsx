import Loader from "./Loader";

/**
 * Full-area loading overlay: blocks interaction while `loading` is true.
 * Use for initial data fetch on admin pages.
 */
export default function PageLoadingShell({ loading, children, minHeight = "min-h-[280px]" }) {
  return (
    <div className={`relative ${minHeight}`}>
      {loading && (
        <div
          className="absolute inset-0 z-30 flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-[1px]"
          aria-busy="true"
          aria-live="polite"
        >
          <Loader size={40} className="text-neutral-900" />
        </div>
      )}
      <div className={loading ? "pointer-events-none select-none opacity-40" : ""}>
        {children}
      </div>
    </div>
  );
}
