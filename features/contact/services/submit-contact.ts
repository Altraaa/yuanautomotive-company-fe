import type { ContactFormValues } from "@/features/contact/schema";

/**
 * submitContactLead — sends a contact lead to the backend.
 *
 * NOTE: The NestJS backend is not wired yet. When `NEXT_PUBLIC_API_URL` is set,
 * swap the mock below for:
 *
 *   import { apiClient } from "@/services/api";
 *   import { endpoints } from "@/lib/endpoint";
 *   return apiClient.post(endpoints.contacts.create, {
 *     name: values.name, phone: values.phone, email: values.email,
 *     vehicle_model: values.vehicleModel, message: values.message,
 *   });
 *
 * The mapper keeps UI (camelCase) → API (snake_case) separation intact.
 */
export async function submitContactLead(values: ContactFormValues): Promise<void> {
  // Simulate network latency for a realistic UX in the mock build.
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (!values.email || !values.name) {
    throw new Error("Data tidak lengkap.");
  }
  // Mock success — no-op until the backend endpoint is available.
}
