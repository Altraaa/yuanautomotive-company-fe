"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { CtaButton } from "@/components/common/cta-button";

/**
 * Generic submitting-state bridge so a topbar Save button (rendered outside the
 * <form>) can submit a form by id and reflect its pending state. Reusable across
 * admin editors (blog, CMS, …).
 */
type FormSubmitState = {
  submitting: boolean;
  setSubmitting: (v: boolean) => void;
};

const FormSubmitContext = createContext<FormSubmitState | null>(null);

export function useFormSubmit() {
  return useContext(FormSubmitContext);
}

export function FormSubmitProvider({ children }: { children: ReactNode }) {
  const [submitting, setSubmitting] = useState(false);
  return (
    <FormSubmitContext.Provider value={{ submitting, setSubmitting }}>
      {children}
    </FormSubmitContext.Provider>
  );
}

export function FormSaveButton({
  label,
  pendingLabel = "Menyimpan…",
  formId,
}: {
  label: string;
  pendingLabel?: string;
  formId: string;
}) {
  const ctx = useFormSubmit();
  return (
    <CtaButton type="submit" form={formId} disabled={ctx?.submitting}>
      <Check className="h-4 w-4" />
      {ctx?.submitting ? pendingLabel : label}
    </CtaButton>
  );
}
