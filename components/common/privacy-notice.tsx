import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type PrivacyNoticeProps = {
  /** Lead sentence before the "Kebijakan Privasi" link. */
  lead?: string;
  /** Trailing text after the link. */
  trail?: string;
  className?: string;
};

/**
 * PrivacyNotice — a compact, on-brand reminder linking to the privacy policy.
 * Dropped near data-entry points (contact form, pre-order, cart) so visitors
 * know their data is handled per UU PDP before they submit.
 */
export function PrivacyNotice({
  lead = "Dengan mengirim data ini, Anda menyetujui ",
  trail = " kami sesuai UU PDP.",
  className,
}: PrivacyNoticeProps) {
  return (
    <p
      className={cn(
        "flex items-start gap-2 font-sans text-[11.5px] leading-relaxed text-fg-subtle",
        className
      )}
    >
      <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
      <span>
        {lead}
        <Link
          href="/kebijakan-privasi"
          className="font-semibold text-gold underline-offset-2 hover:underline"
        >
          Kebijakan Privasi
        </Link>
        {trail}
      </span>
    </p>
  );
}
