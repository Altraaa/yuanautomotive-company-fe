import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/site";

type FloatingWhatsAppProps = {
  message?: string;
};

/** Fixed WhatsApp "Chat Sales" pill from the comp (bottom-right). */
export function FloatingWhatsApp({ message }: FloatingWhatsAppProps) {
  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat Sales via WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-whatsapp px-4 py-3.5 shadow-lg shadow-black/50 transition-transform hover:scale-105"
    >
      <span className="grid h-5 w-5 place-items-center rounded-full bg-fg text-whatsapp">
        <MessageCircle className="h-3.5 w-3.5" />
      </span>
      <span className="font-sans text-[13px] font-bold text-fg">Chat Sales</span>
    </a>
  );
}
