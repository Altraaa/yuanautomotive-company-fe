"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { CtaButton } from "@/components/common/cta-button";

/**
 * Shares the edit-form's submitting state with the topbar Save button (which
 * lives outside the <form>), so the button can show a loading/disabled state.
 */
type ProductFormState = {
  submitting: boolean;
  setSubmitting: (v: boolean) => void;
};

const ProductFormContext = createContext<ProductFormState | null>(null);

export function useProductForm() {
  return useContext(ProductFormContext);
}

export function ProductFormProvider({ children }: { children: ReactNode }) {
  const [submitting, setSubmitting] = useState(false);
  return (
    <ProductFormContext.Provider value={{ submitting, setSubmitting }}>
      {children}
    </ProductFormContext.Provider>
  );
}

/** Topbar Save button — submits the form by id and reflects its pending state. */
export function ProductSaveButton({
  label,
  formId = "product-form",
}: {
  label: string;
  formId?: string;
}) {
  const ctx = useProductForm();
  return (
    <CtaButton type="submit" form={formId} disabled={ctx?.submitting}>
      <Check className="h-4 w-4" />
      {ctx?.submitting ? "Menyimpan…" : label}
    </CtaButton>
  );
}
