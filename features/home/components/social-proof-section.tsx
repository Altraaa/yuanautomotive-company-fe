import { TestimonialCard } from "@/components/common/testimonial-card";
import { PartnerStrip } from "@/components/common/partner-strip";
import { homePartners, homeTestimonial } from "@/features/home/data";

export function SocialProofSection() {
  return (
    <section className="bg-bg">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.3fr_1fr] md:items-center md:px-8 md:py-14">
        <TestimonialCard
          quote={homeTestimonial.quote}
          authorName={homeTestimonial.authorName}
          authorLocation={homeTestimonial.authorLocation}
          authorInitials={homeTestimonial.authorInitials}
        />
        <PartnerStrip
          label="Dipercaya oleh dealer resmi, bengkel umum & customer"
          partners={homePartners}
        />
      </div>
    </section>
  );
}
