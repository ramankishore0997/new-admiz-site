import React from "react";

interface CardItem {
  title: string;
  desc: string;
  gradientFrom: string;
  gradientTo: string;
  linkText?: string;
  href?: string;
}

interface SkewCardsProps {
  cards?: CardItem[];
  containerClassName?: string;
}

const defaultCards: CardItem[] = [
  {
    title: "Meta Tier-1 Scale",
    desc: "Uncapped scaling brackets with direct whitelisted routing and zero daily budget throttling.",
    gradientFrom: "#ffbc00",
    gradientTo: "#ff0058",
    linkText: "Explore Lines",
    href: "/agency-accounts",
  },
  {
    title: "Google Premier MCC",
    desc: "Direct invoiced credit lines with 0% billing tax and high-priority search & YouTube auction allocation.",
    gradientFrom: "#03a9f4",
    gradientTo: "#ff0058",
    linkText: "Explore Lines",
    href: "/agency-accounts",
  },
  {
    title: "TikTok Worldwide",
    desc: "Instant access to 55+ Tier-1 countries with instant replacement protection and dedicated rep support.",
    gradientFrom: "#4dff03",
    gradientTo: "#00d0ff",
    linkText: "Explore Lines",
    href: "/agency-accounts",
  },
];

export default function SkewCards({
  cards = defaultCards,
  containerClassName = "",
}: SkewCardsProps) {
  return (
    <>
      <div className={`flex justify-center items-center flex-wrap py-10 bg-black min-h-[450px] ${containerClassName}`}>
        {cards.map(({ title, desc, gradientFrom, gradientTo, linkText = "Read More", href = "#" }, idx) => (
          <div
            key={idx}
            className="group relative w-[320px] h-[400px] m-[40px_30px] transition-all duration-500"
          >
            {/* Skewed gradient panels */}
            <span
              className="absolute top-0 left-[50px] w-1/2 h-full rounded-lg transform skew-x-[15deg] transition-all duration-500 group-hover:skew-x-0 group-hover:left-[20px] group-hover:w-[calc(100%-90px)]"
              style={{
                background: `linear-gradient(315deg, ${gradientFrom}, ${gradientTo})`,
              }}
            />
            <span
              className="absolute top-0 left-[50px] w-1/2 h-full rounded-lg transform skew-x-[15deg] blur-[30px] transition-all duration-500 group-hover:skew-x-0 group-hover:left-[20px] group-hover:w-[calc(100%-90px)]"
              style={{
                background: `linear-gradient(315deg, ${gradientFrom}, ${gradientTo})`,
              }}
            />

            {/* Animated blurs */}
            <span className="pointer-events-none absolute inset-0 z-10">
              <span className="absolute top-0 left-0 w-0 h-0 rounded-lg opacity-0 bg-[rgba(255,255,255,0.1)] backdrop-blur-[10px] shadow-[0_5px_15px_rgba(0,0,0,0.08)] transition-all duration-100 animate-blob group-hover:top-[-50px] group-hover:left-[50px] group-hover:w-[100px] group-hover:h-[100px] group-hover:opacity-100" />
              <span className="absolute bottom-0 right-0 w-0 h-0 rounded-lg opacity-0 bg-[rgba(255,255,255,0.1)] backdrop-blur-[10px] shadow-[0_5px_15px_rgba(0,0,0,0.08)] transition-all duration-500 animate-blob animation-delay-1000 group-hover:bottom-[-50px] group-hover:right-[50px] group-hover:w-[100px] group-hover:h-[100px] group-hover:opacity-100" />
            </span>

            {/* Content */}
            <div className="relative z-20 left-0 p-[20px_40px] bg-[rgba(10,10,15,0.85)] border border-zinc-800/80 backdrop-blur-[12px] shadow-2xl rounded-2xl text-white transition-all duration-500 group-hover:left-[-25px] group-hover:p-[50px_40px]">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-2 text-white">{title}</h2>
              <p className="text-sm text-zinc-300 leading-relaxed mb-6">{desc}</p>
              <a
                href={href}
                className="inline-block text-xs font-black uppercase tracking-wider text-black bg-white px-4 py-2.5 rounded-full hover:bg-[#ffcf4d] hover:border hover:border-[rgba(255,0,88,0.4)] hover:shadow-lg transition-all"
              >
                {linkText}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Tailwind custom utilities for animation and shadows */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translateY(10px); }
          50% { transform: translate(-10px); }
        }
        .animate-blob { animation: blob 2s ease-in-out infinite; }
        .animation-delay-1000 { animation-delay: -1s; }
      `}</style>
    </>
  );
}
export { SkewCards };
