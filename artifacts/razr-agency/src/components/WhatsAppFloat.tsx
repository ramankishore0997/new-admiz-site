import { SiTelegram } from "react-icons/si";

const TELEGRAM_URL = "https://t.me/RazrMarketing";

export default function WhatsAppFloat() {
  return (
    <a
      href={TELEGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on Telegram"
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[60] flex items-center justify-center gap-3 w-14 h-14 md:w-auto md:h-auto md:px-5 md:py-4 rounded-full bg-emerald-600 text-white font-bold uppercase tracking-widest text-sm shadow-[0_10px_40px_rgba(5,150,105,0.3)] hover:scale-105 hover:shadow-[0_15px_50px_rgba(5,150,105,0.45)] transition-all duration-300 group pb-[env(safe-area-inset-bottom)]"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <SiTelegram className="text-2xl group-hover:rotate-12 transition-transform" />
      <span className="hidden md:inline">Chat with us</span>
    </a>
  );
}
