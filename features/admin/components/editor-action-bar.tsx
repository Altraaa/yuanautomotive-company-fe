"use client";

import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { CtaButton } from "@/components/common/cta-button";
import { useFormSubmit } from "./form-submit-context";

/**
 * EditorActionBar — sticky footer with Batal + Simpan for full-page admin
 * editors (product, blog, news, faq). Stays pinned to the bottom of the viewport
 * so a long form can be saved without scrolling back up to the topbar.
 *
 * - Simpan submits the form by id (via the `form` attribute) and reflects the
 *   shared submitting state from `FormSubmitContext`.
 * - Batal steps back one history entry (`router.back()`, i.e. -1) so the user
 *   returns to wherever they came from — e.g. product table page 2 — instead of
 *   a hardcoded list/detail route.
 */
type EditorActionBarProps = {
  /** Id of the <form> this bar submits. */
  formId: string;
  saveLabel: string;
  pendingLabel?: string;
  cancelLabel?: string;
};

export function EditorActionBar({
  formId,
  saveLabel,
  pendingLabel = "Menyimpan…",
  cancelLabel = "Batal",
}: EditorActionBarProps) {
  const router = useRouter();
  const ctx = useFormSubmit();
  const submitting = ctx?.submitting ?? false;

  return (
    <div className="sticky bottom-0 z-30 flex gap-3 border-t border-border bg-bg/95 px-4 py-3 backdrop-blur md:justify-end md:px-8">
      <CtaButton
        type="button"
        variant="outline"
        size="sm"
        onClick={() => router.back()}
        disabled={submitting}
        className="flex-1 md:flex-none"
      >
        <X className="h-4 w-4" />
        {cancelLabel}
      </CtaButton>
      <CtaButton
        type="submit"
        form={formId}
        size="sm"
        disabled={submitting}
        className="flex-1 md:flex-none"
      >
        <Check className="h-4 w-4" />
        {submitting ? pendingLabel : saveLabel}
      </CtaButton>
    </div>
  );
}
