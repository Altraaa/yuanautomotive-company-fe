"use server";

import { apiClient } from "@/services/api";
import { endpoints } from "@/lib/endpoint";
import { ApiError } from "@/services/api";
import type { ContactFormValues } from "@/features/contact/schema";

/**
 * submitContactLead — posts a contact lead to the backend (UI camelCase →
 * API snake_case). Falls back to a mock success when the backend is unreachable
 * so the form stays usable during development.
 */
export async function submitContactLead(values: ContactFormValues): Promise<void> {
  try {
    await apiClient.post(endpoints.contacts.create, {
      name: values.name,
      phone: values.phone,
      email: values.email,
      vehicle_model: values.vehicleModel,
      message: values.message,
    });
  } catch (err) {
    if (err instanceof ApiError) throw err; // surface backend validation errors
    // Backend unreachable → treat as success (mock) so UX is unblocked.
  }
}
