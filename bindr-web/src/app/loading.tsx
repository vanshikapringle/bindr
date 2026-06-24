export default function Loading() {
  const SvgLines = () => (
    <svg viewBox="0 0 90 120" fill="currentColor">
      <rect x="10" y="20" width="70" height="4" rx="2" />
      <rect x="10" y="35" width="70" height="4" rx="2" />
      <rect x="10" y="50" width="70" height="4" rx="2" />
      <rect x="10" y="65" width="70" height="4" rx="2" />
      <rect x="10" y="80" width="70" height="4" rx="2" />
      <rect x="10" y="95" width="40" height="4" rx="2" />
    </svg>
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--background)]">
      <div className="loader">
        <div>
          <ul>
            <li><SvgLines /></li>
            <li><SvgLines /></li>
            <li><SvgLines /></li>
            <li><SvgLines /></li>
            <li><SvgLines /></li>
          </ul>
        </div>
        <span className="font-serif">Loading Bindr...</span>
      </div>
    </div>
  );
}
