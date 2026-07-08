import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingWhatsApp } from "@/components/common/floating-whatsapp";
import { CartSheet } from "@/features/preorder/components/cart-sheet";
import { Toaster } from "@/components/ui/sonner";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <CartSheet />
      <Toaster />
    </>
  );
}
