import { Link } from "wouter";
import { ArrowRight, MapPin, Globe2 } from "lucide-react";
import { SiTelegram } from "react-icons/si";
import StarfieldFooter from "@/components/StarfieldFooter";

const TELEGRAM_URL = "https://t.me/RazrMarketing";

export default function Footer() {
  return (
    <footer className="relative bg-background border-t border-slate-200 overflow-hidden">
      <StarfieldFooter />
      <div className="container mx-auto px-4 py-14 md:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-6 uppercase">
                Stay Ahead of<br/>the Curve.
              </h2>
              <p className="text-muted-foreground text-lg max-w-md mb-8">
                Join our newsletter for weekly insights on Meta & Google policy changes, scaling strategies, and agency infrastructure.
              </p>
              <div className="flex items-center gap-2 max-w-md border-b border-slate-300 pb-2">
                <input
                  type="email"
                  placeholder="Email address"
                  className="bg-transparent border-none outline-none flex-1 text-slate-900 placeholder:text-muted-foreground"
                />
                <button className="text-slate-900 hover:text-emerald-600 transition-colors p-2">
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-6">
              <h4 className="text-slate-900 font-bold uppercase tracking-wider text-xs">Platform</h4>
              <Link href="/apply-agency" className="text-muted-foreground hover:text-emerald-600 transition-colors text-sm">Apply for Account</Link>
              <Link href="/features" className="text-muted-foreground hover:text-emerald-600 transition-colors text-sm">Features</Link>
              <Link href="/solutions" className="text-muted-foreground hover:text-emerald-600 transition-colors text-sm">Solutions</Link>
              <Link href="/how-it-works" className="text-muted-foreground hover:text-emerald-600 transition-colors text-sm">Process</Link>
              <Link href="/advertise" className="text-muted-foreground hover:text-emerald-600 transition-colors text-sm">Run Ads With Us</Link>
            </div>
            <div className="flex flex-col gap-6">
              <h4 className="text-slate-900 font-bold uppercase tracking-wider text-xs">Company</h4>
              <Link href="/about" className="text-muted-foreground hover:text-emerald-600 transition-colors text-sm">About Us</Link>
              <Link href="/contact" className="text-muted-foreground hover:text-emerald-600 transition-colors text-sm">Contact</Link>
              <Link href="/faq" className="text-muted-foreground hover:text-emerald-600 transition-colors text-sm">FAQ</Link>
            </div>
            <div className="flex flex-col gap-6 col-span-2 md:col-span-1">
              <h4 className="text-slate-900 font-bold uppercase tracking-wider text-xs">Legal</h4>
              <Link href="/privacy" className="text-muted-foreground hover:text-emerald-600 transition-colors text-sm">Privacy Policy</Link>
              <Link href="/refund" className="text-muted-foreground hover:text-emerald-600 transition-colors text-sm">Refund Policy</Link>
              <Link href="/terms" className="text-muted-foreground hover:text-emerald-600 transition-colors text-sm">Terms of Service</Link>
            </div>
          </div>
        </div>

          <div className="flex flex-col items-center border-t border-slate-200 pt-16">
            {/* Brand logo & Corporate Tagline */}
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/logo.png"
                alt="razr.marketing"
                style={{ height: 64, width: "auto" }}
                className="object-contain drop-shadow-md"
              />
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  razr<span className="text-orange-500">.marketing</span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 mt-1">
                  RAZR Global Media International Ltd · Hong Kong HQ
                </span>
              </div>
            </div>

            {/* Corporate Entity Compliance Box */}
            <div className="w-full max-w-4xl mx-auto rounded-2xl border border-slate-200 bg-slate-50/80 p-5 mb-8 text-center text-xs text-slate-600 space-y-2">
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                <span>RAZR Global Media International Limited</span>
                <span className="text-slate-300">|</span>
                <span className="text-emerald-700 font-mono">CR No. 3318942</span>
                <span className="text-slate-300">|</span>
                <span className="text-emerald-700 font-mono">BRN: 76192840-000-08-26-A</span>
              </div>
              <p className="text-[11px] text-slate-500 max-w-2xl mx-auto leading-relaxed">
                Registered Office: Level 19, Two International Finance Centre (Two IFC), 8 Finance Street, Central, Hong Kong SAR.
                Direct Tier-1 Agency Line-of-Credit allocation & programmatic infrastructure governed under Hong Kong SAR Commercial Ordinances.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-1 text-[10px] font-bold text-slate-600">
                <a href="mailto:billing@razr.marketing" className="hover:text-emerald-600 transition-colors">Finance: billing@razr.marketing</a>
                <span>·</span>
                <a href="mailto:compliance@razr.marketing" className="hover:text-emerald-600 transition-colors">Compliance: compliance@razr.marketing</a>
                <span>·</span>
                <a href="mailto:contact@razr.marketing" className="hover:text-emerald-600 transition-colors">General: contact@razr.marketing</a>
              </div>
            </div>

          <div className="w-full text-center">
            <h1 className="text-[9vw] md:text-[11vw] font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-slate-200 to-slate-100 select-none">
              razr.marketing
            </h1>
          </div>
          <div className="w-full flex flex-col md:flex-row justify-between items-center mt-8 text-xs font-medium tracking-widest text-muted-foreground uppercase gap-4">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary" /> Two IFC, Central, Hong Kong SAR · &copy; {new Date().getFullYear()} RAZR Global Media International Ltd.
            </span>
            <span className="inline-flex items-center gap-1.5 text-primary">
              <Globe2 className="w-3.5 h-3.5" /> DELIVERING WORLDWIDE · PERFORMANCE WITHOUT COMPROMISE
            </span>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-primary transition-colors"
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
