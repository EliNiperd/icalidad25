import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showSubtitle?: boolean;
  inverted?: boolean;
}

export function BrandLogo({
  className,
  iconClassName,
  textClassName,
  showSubtitle = false,
  inverted = false,
}: BrandLogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-3 select-none", className)}>
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl shadow-sm",
          inverted
            ? "bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-sm"
            : "bg-primary-600 text-white",
          iconClassName
        )}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-6"
          aria-hidden="true"
        >
          <path
            d="M16 3L5 7.5V15.5C5 22.3 9.7 28.4 16 30C22.3 28.4 27 22.3 27 15.5V7.5L16 3Z"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path
            d="M11.2 16.2L14.5 19.5L21 12.8"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <span
          className={cn(
            "text-xl font-bold tracking-tight leading-none",
            inverted ? "text-white" : "text-text-primary",
            textClassName
          )}
        >
          iCalidad
        </span>
        {showSubtitle && (
          <span
            className={cn(
              "mt-1 text-xs font-medium tracking-wide",
              inverted ? "text-white/80" : "text-text-secondary"
            )}
          >
            Sistema de Gestión de Calidad
          </span>
        )}
      </div>
    </div>
  );
}
