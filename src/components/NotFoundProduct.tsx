type Props = {
  message?: string;
  onResetFilters?: () => void;
  className?: string;
};

export default function NotFoundListings({
  message = "No products match your filters.",
  onResetFilters,
  className = "",
}: Props) {
  return (
    <div
      className={`w-full flex flex-col items-center justify-center p-6 sm:p-12 bg-white rounded-2xl border border-[#CBDCEB] ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="max-w-xl text-center">
        <div className="mx-auto w-48 h-48 flex items-center justify-center mb-6">
          <svg
            width="192"
            height="192"
            viewBox="0 0 192 192"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <rect width="192" height="192" rx="24" fill="#F8FAFC" />
            <g transform="translate(36 36)">
              <rect
                x="0"
                y="0"
                width="120"
                height="80"
                rx="10"
                fill="#E6EEF4"
              />
              <rect x="8" y="12" width="56" height="8" rx="4" fill="#CBDCEB" />
              <rect x="8" y="28" width="104" height="8" rx="4" fill="#CBDCEB" />
              <circle cx="90" cy="62" r="10" fill="#CBDCEB" />
              <path
                d="M12 96 L48 64 L84 96"
                stroke="#456882"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </div>

        <h2 className="text-2xl sm:text-3xl font-semibold text-[#1B3C53] mb-2">
          Nothing found
        </h2>

        <p className="text-sm sm:text-base text-[#456882]/90 mb-6">
          {message} Try adjusting or clearing some filters to broaden your
          results.
        </p>

        <div className="flex gap-3 flex-col sm:flex-row items-center justify-center mb-6">
          <button
            onClick={() => onResetFilters?.()}
            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2 rounded-lg shadow-sm border border-[#CBDCEB] bg-white text-[#1B3C53] hover:bg-[#F6F9FB] transition-colors duration-150"
            aria-label="Clear filters"
          >
            Clear filters
          </button>
        </div>

        <p className="mt-6 text-xs text-[#456882]/60">
          Tip: Try reseting filters
        </p>
      </div>
    </div>
  );
}
