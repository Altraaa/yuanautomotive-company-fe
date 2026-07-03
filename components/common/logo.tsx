import Link from "next/link";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  /** Compact = mark + single-line wordmark (footer). Default = stacked wordmark (header). */
  variant?: "default" | "compact";
};

/**
 * Brand mark: skewed red/gold "YD" tile + Chakra Petch italic wordmark.
 * Matches the comp's header/footer logo lockup.
 */
export function Logo({ className, variant = "default" }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-3", className)} aria-label={site.name}>
      <span className="grid h-10 w-10 -skew-x-[8deg] place-items-center bg-gradient-to-br from-red from-55% to-gold to-55% font-display text-[17px] font-bold text-fg">
        <span className="skew-x-[8deg]">YD</span>
      </span>
      {variant === "compact" ? (
        <span className="font-display text-sm font-bold italic tracking-wide text-fg">
          {site.name.toUpperCase()}
        </span>
      ) : (
        <span className="flex flex-col leading-tight">
          <span className="font-display text-[15px] font-bold italic tracking-wide text-red">
            {site.shortName.toUpperCase()}
          </span>
          <span className="font-display text-[15px] font-bold italic tracking-wide text-red">
            {site.tagline}
          </span>
        </span>
      )}
    </Link>
  );
}
