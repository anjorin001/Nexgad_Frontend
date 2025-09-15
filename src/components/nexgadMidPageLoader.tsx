import React from "react";

type LoaderProps = {
  size?: number; 
  thickness?: number; 
  color?: string;
  label?: string | null;
  className?: string;
  fullScreen?: boolean; 
  inline?: boolean; 
};

const DEFAULT_COLOR = "#1B3C53"; 

export default function Loader({
  size = 32,
  thickness = 3,
  color = DEFAULT_COLOR,
  label = "Loading…",
  className = "",
  fullScreen = false,
  inline = true,
}: LoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center justify-center ${fullScreen ? "min-h-screen" : ""} ${inline ? "" : ""} ${className}`}
    >
      {label !== null && <span className="sr-only">{label}</span>}

    
      <svg
        className="animate-spin"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* subtle track */}
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth={thickness}
          fill="none"
          opacity="0.12"
        />
        {/* animated arc */}
        <path
          d="M22 12a10 10 0 00-10-10"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
