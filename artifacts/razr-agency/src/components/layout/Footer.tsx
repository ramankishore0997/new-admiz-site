import { Link } from "wouter";
import { ArrowRight, MapPin, Globe2 } from "lucide-react";
import { SiTelegram } from "react-icons/si";
import StarfieldFooter from "@/components/StarfieldFooter";

const TELEGRAM_URL = "https://t.me/RazrMarketing";

export default function Footer() {
  return (
    <footer className="relative bg-black border-t border-zinc-800 overflow-hidden text-white">
      <StarfieldFooter />
      <div className="container mx-auto px-4 py-14 md:py-20 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-6 uppercase">
                Stay Ahead of<br/>
                <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                  the Curve.
                </span>
              </h2>
              <p className="text-zinc-400 text-lg max-w-md mb-8">
                Join our newsletter for weekly insights on Meta & Google policy changes, scaling strategies, and agency infrastructure.
              </p>
              <div className="flex items-center gap-2 max-w-md border-b border-zinc-800 pb-2">
                <input
                  type="email"
                  placeholder="Email address"
                  className="bg-transparent border-none outline-none flex-1 text-white placeholder:text-zinc-600"
                />
                <button className="text-cyan-400 hover:text-emerald-400 transition-colors p-2" aria-label="Subscribe to newsletter">
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-5">
              <h4 className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent font-black uppercase tracking-wider text-xs">Platform</h4>
              <Link href="/apply-agency" className="text-zinc-400 hover:text-cyan-300 transition-colors text-sm">Apply for Account</Link>
              <Link href="/features" className="text-zinc-400 hover:text-cyan-300 transition-colors text-sm">Features</Link>
              <Link href="/solutions" className="text-zinc-400 hover:text-cyan-300 transition-colors text-sm">Solutions</Link>
              <Link href="/how-it-works" className="text-zinc-400 hover:text-cyan-300 transition-colors text-sm">Process</Link>
              <Link href="/advertise" className="text-zinc-400 hover:text-cyan-300 transition-colors text-sm">Run Ads With Us</Link>
            </div>
            <div className="flex flex-col gap-5">
              <h4 className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent font-black uppercase tracking-wider text-xs">Company</h4>
              <Link href="/about" className="text-zinc-400 hover:text-emerald-300 transition-colors text-sm">About Us</Link>
              <Link href="/contact" className="text-zinc-400 hover:text-emerald-300 transition-colors text-sm">Contact</Link>
              <Link href="/faq" className="text-zinc-400 hover:text-emerald-300 transition-colors text-sm">FAQ</Link>
            </div>
            <div className="flex flex-col gap-5 col-span-2 md:col-span-1">
              <h4 className="bg-gradient-to-r from-pink-400 to-amber-400 bg-clip-text text-transparent font-black uppercase tracking-wider text-xs">Legal</h4>
              <Link href="/privacy" className="text-zinc-400 hover:text-amber-300 transition-colors text-sm">Privacy Policy</Link>
              <Link href="/refund" className="text-zinc-400 hover:text-amber-300 transition-colors text-sm">Refund Policy</Link>
              <Link href="/terms" className="text-zinc-400 hover:text-amber-300 transition-colors text-sm">Terms of Service</Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center border-t border-zinc-800/80 pt-16">
          {/* Brand logo & Corporate Tagline */}
          <div className="flex items-center gap-3 mb-6">
            <img
              src="/logo.png"
              alt="razr.marketing"
              style={{ height: 64, width: "auto" }}
              className="object-contain drop-shadow-md"
            />
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-black tracking-tight text-white">
                razr<span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">.marketing</span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 mt-1">
                RAZR Global Media International Ltd · United Kingdom HQ
              </span>
            </div>
          </div>

          {/* Corporate Entity Compliance Box */}
          <div className="w-full max-w-4xl mx-auto rounded-2xl border border-zinc-800 bg-[#060608] p-5 mb-8 text-center text-xs text-zinc-400 space-y-2">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] font-bold text-zinc-200 uppercase tracking-wider">
              <span>RAZR Global Media International Limited</span>
              <span className="text-zinc-700">|</span>
              <span className="text-violet-400 font-mono font-bold">Company No. 14829104</span>
              <span className="text-zinc-700">|</span>
              <span className="text-cyan-400 font-mono font-bold">Registered in England &amp; Wales</span>
            </div>
            <p className="text-[11px] text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Registered Office: 30 St Mary Axe (The Gherkin), City of London, London EC3A 8EP, United Kingdom.
              Direct Tier-1 Agency Line-of-Credit allocation &amp; programmatic infrastructure governed under United Kingdom Commercial Standards.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-1 text-[10px] font-bold text-zinc-400">
              <a href="mailto:billing@razr.marketing" className="hover:text-cyan-300 transition-colors">Finance: billing@razr.marketing</a>
              <span>·</span>
              <a href="mailto:compliance@razr.marketing" className="hover:text-violet-300 transition-colors">Compliance: compliance@razr.marketing</a>
              <span>·</span>
              <a href="mailto:contact@razr.marketing" className="hover:text-emerald-300 transition-colors">General: contact@razr.marketing</a>
            </div>
          </div>

          {/* Big Brand Statement */}
          <div className="w-full text-center relative py-6 my-2">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-3/4 h-32 bg-gradient-to-r from-violet-600/20 via-cyan-500/20 to-emerald-500/20 blur-3xl rounded-full" />
            </div>
            <h1 className="relative text-[7vw] sm:text-[7.5vw] md:text-[8vw] lg:text-[8.5vw] font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 select-none drop-shadow-[0_0_50px_rgba(139,92,246,0.35)] opacity-95 hover:opacity-100 transition-opacity px-2">
              razr.marketing
            </h1>
          </div>
          <div className="w-full flex flex-col md:flex-row justify-between items-center mt-8 text-xs font-medium tracking-widest text-zinc-500 uppercase gap-4">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-violet-400" /> 30 St Mary Axe, London, United Kingdom · &copy; {new Date().getFullYear()} RAZR Global Media International Ltd.
            </span>
            <span className="inline-flex items-center gap-1.5 text-cyan-400">
              <Globe2 className="w-3.5 h-3.5" /> DELIVERING WORLDWIDE · PERFORMANCE WITHOUT COMPROMISE
            </span>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#229ED9] hover:text-cyan-300 transition-colors"
            >
              <SiTelegram className="text-[#229ED9]" />
              @RAZRMARKETING
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
