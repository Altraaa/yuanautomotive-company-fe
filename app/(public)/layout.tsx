import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingWhatsApp } from "@/components/common/floating-whatsapp";
import { CartSheet } from "@/features/preorder/components/cart-sheet";
import { ToastProvider } from "@/features/admin/components/toast";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <Header />
      <main>{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <CartSheet />
    </ToastProvider>
  );
}
