import { Logo } from "@/components/common/logo";
import { CtaButton } from "@/components/common/cta-button";
import { NavLinks } from "@/components/layout/nav-links";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CartButton } from "@/features/preorder/components/cart-button";
import { waLink } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-bg/95 backdrop-blur supports-[backdrop-filter]:bg-bg/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 md:px-8">
        <Logo />

        <div className="flex items-center gap-3 md:gap-6">
          <NavLinks />
          <CtaButton
            href={waLink()}
            target="_blank"
            rel="noopener"
            size="sm"
            className="hidden lg:inline-grid"
          >
            Chat Sales
          </CtaButton>
          <CartButton />
          <MobileNav />
        </div>
      </div>
      {/* red→gold hard-split accent border */}
      <div className="h-0.5 w-full bg-gradient-to-r from-red from-50% to-gold to-50%" />
    </header>
  );
}
