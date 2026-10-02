import { useState, useEffect } from "react";
import ClientLayout from "@/components/layout/ClientLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  ShoppingBag,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Loader2,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Building,
  Lock,
  Layers,
  HelpCircle,
  X,
  AlertCircle,
  RefreshCw,
  Wallet,
  Activity,
  PlusCircle,
  Minus,
  Plus,
  Upload,
  Trash2,
  CheckCircle,
  QrCode
} from "lucide-react";
import { SiMeta, SiTelegram } from "react-icons/si";
import { apiFetch } from "@/lib/api";
import { MANUAL_PAYMENT_NETWORKS, PAYMENT_CONFIG } from "@/config/payment";
import { playSuccessChime } from "@/lib/audioAlerts";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

interface BmPackage {
  id: string;
  name: string;
  platform: string;
  price: number;
  category: "meta";
  badge: string;
  description: string;
  features: string[];
  stockReady: number;
}

interface BmOrder {
  id: number;
  orderId: string;
  userId: number;
  bmPackageId: string;
  bmPackageName: string;
  platform: string;
  quantity?: number;
  unitPrice?: string | null;
  price: string;
  currency: string;
  status: "PENDING_DELIVERY" | "DELIVERED" | "CANCELLED";
  inviteLink?: string | null;
  deliveryNotes?: string | null;
  deliveredAt?: string | null;
  createdAt: string;
}

const STATIC_CATALOG: BmPackage[] = [
  {
    id: "meta-bm3-business-manager",
    name: "Meta BM3 Business Manager",
    platform: "Meta Ads (Facebook & IG)",
    price: 3,
    category: "meta",
    badge: "BM3 Special",
    description: "Active BM3 Business Manager configured with 3 ad accounts limit capacity and direct admin invite.",
    features: [
      "3 Ad Account Creation Capacity (BM3)",
      "Direct Admin Role Invitation Link",
      "Pixel, Domain & Asset Sharing Ready",
      "Clean Compliance Trust Rating",
      "Rapid Replacement Protection SLA"
    ],
    stockReady: 25,
  },
  {
    id: "meta-standard-agency-bm",
    name: "Meta Standard Agency BM",
    platform: "Meta Ads (Facebook & IG)",
    price: 7,
    category: "meta",
    badge: "Starter Choice",
    description: "Active agency Business Manager ready for immediate campaign launch and pixel connection.",
    features: [
      "Immediate Campaign & Pixel Binding",
      "Clean Policy Trust Rating",
      "Direct Admin Role Invitation Link",
      "Rapid Replacement Protection SLA",
      "2FA & Security Guard Enabled"
    ],
    stockReady: 18,
  },
  {
    id: "meta-reinstated-active-bm",
    name: "Meta Reinstated Active BM",
    platform: "Meta Ads (Facebook & IG)",
    price: 9,
    category: "meta",
    badge: "Most Popular",
    description: "Reinstated high-trust Business Manager with warm compliance score and multi-account expansion readiness.",
    features: [
      "Multi-Ad Account Spawning (Up to 3-5 Lines)",
      "Reinstated Compliance Status (Zero Friction)",
      "Accelerated Ad Approval Velocity",
      "Direct Admin Role Invitation Link",
      "Immediate Replacement Guarantee"
    ],
    stockReady: 14,
  },
  {
    id: "meta-enterprise-unlimited-bm",
    name: "Meta Enterprise Unlimited BM",
    platform: "Meta Ads (Facebook & IG)",
    price: 12,
    category: "meta",
    badge: "Maximum Scale",
    description: "Enterprise tier Business Manager configured for uncapped daily spend and high-volume media buying.",
    features: [
      "High / Uncapped Daily Spend Limit Capacity",
      "Multi-Ad Account Creation Permissions",
      "Unlimited Pixel, Domain & CAPI Integrations",
      "Dedicated Escalation Route",
      "Instant Admin Role Invitation Link",
      "Full Replacement Protection SLA"
    ],
    stockReady: 9,
  }
];

export default function BuyBusinessManager() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();

  const [catalog, setCatalog] = useState<BmPackage[]>(STATIC_CATALOG);
  const [myOrders, setMyOrders] = useState<BmOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  // Buy Modal State
  const [selectedPackage, setSelectedPackage] = useState<BmPackage | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"WALLET" | "DIRECT_CRYPTO">("WALLET");

  // Direct Crypto Payment State
  const [selectedNetwork, setSelectedNetwork] = useState(MANUAL_PAYMENT_NETWORKS[0]);
  const [txHash, setTxHash] = useState("");
  const [screenshotBase64, setScreenshotBase64] = useState<string | null>(null);
  const [screenshotFileName, setScreenshotFileName] = useState<string>("");
  const [paymentNote, setPaymentNote] = useState("");
  const [isSubmittingDirect, setIsSubmittingDirect] = useState(false);
  const [directPaymentError, setDirectPaymentError] = useState("");

  const walletBalance = Number(user?.balance || 0);

  const handleOpenBuyModal = (pkg: BmPackage) => {
    setSelectedPackage(pkg);
    setSelectedQuantity(1);
    if (walletBalance >= pkg.price) {
      setPaymentMethod("WALLET");
    } else {
      setPaymentMethod("DIRECT_CRYPTO");
    }
    setTxHash("");
    setScreenshotBase64(null);
    setScreenshotFileName("");
    setPaymentNote("");
    setDirectPaymentError("");
    setSelectedNetwork(MANUAL_PAYMENT_NETWORKS[0]);
  };

  const fetchCatalog = async () => {
    try {
      const data = await apiFetch<BmPackage[]>("/api/bm-orders/catalog");
      if (data && data.length > 0) setCatalog(data);
    } catch {
      // Fallback
    }
  };

  const fetchMyOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const data = await apiFetch<BmOrder[]>("/api/bm-orders/my");
      setMyOrders(data || []);
    } catch {
      setMyOrders([]);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
    fetchMyOrders();

    const interval = setInterval(() => {
      apiFetch<BmOrder[]>("/api/bm-orders/my")
        .then((data) => setMyOrders(data || []))
        .catch(() => {});
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`,
    });
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setTxHash(text.trim());
        toast({
          title: "Pasted from Clipboard",
          description: "Transaction hash pasted into field.",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Clipboard Access Denied",
        description: "Please paste your TXID manually into the box.",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please upload a PNG, JPG, or WEBP screenshot.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File Too Large",
        description: "Screenshot size must be smaller than 5MB.",
      });
      return;
    }

    setScreenshotFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedPackage) return;

    const safeQty = Math.max(1, Math.min(500, selectedQuantity || 1));
    const totalPrice = Number((selectedPackage.price * safeQty).toFixed(2));

    if (walletBalance < totalPrice) {
      toast({
        variant: "destructive",
        title: "Insufficient Balance",
        description: `Your available balance is $${walletBalance.toFixed(2)} USDT. Required: $${totalPrice.toFixed(2)} USDT (${safeQty}x @ $${selectedPackage.price}).`,
      });
      return;
    }

    setIsPurchasing(true);
    try {
      const res = await apiFetch<any>("/api/bm-orders/buy", {
        method: "POST",
        body: JSON.stringify({ packageId: selectedPackage.id, quantity: safeQty }),
      });

      playSuccessChime();
      toast({
        title: "Order Placed Successfully! 🎯",
        description: `Order #${res.order?.orderId} for ${safeQty} line(s) placed. Admin team is dispatching your invite link(s).`,
      });

      setSelectedPackage(null);
      setSelectedQuantity(1);
      await refreshUser();
      await fetchMyOrders();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Purchase Failed",
        description: err.message || "Failed to process BM purchase.",
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleSubmitDirectPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;

    const safeQty = Math.max(1, Math.min(500, selectedQuantity || 1));
    const cleanHash = txHash.trim();
    const isTron = selectedNetwork.id === "tron";
    const TX_REGEX = isTron ? /^[a-fA-F0-9]{64}$/ : /^0x[a-fA-F0-9]{64}$/;

    if (!cleanHash || !TX_REGEX.test(cleanHash)) {
      toast({
        variant: "destructive",
        title: "Invalid TXID Format",
        description: isTron
          ? "Please enter a valid 64-character hex Transaction Hash (Tron format)."
          : "Please enter a valid EVM 66-character hex Transaction Hash starting with 0x.",
      });
      return;
    }

    if (!screenshotBase64) {
      toast({
        variant: "destructive",
        title: "Screenshot Required",
        description: "Please upload your payment confirmation screenshot.",
      });
      return;
    }

    setIsSubmittingDirect(true);
    setDirectPaymentError("");

    try {
      const res = await apiFetch<any>("/api/bm-orders/buy-direct", {
        method: "POST",
        body: JSON.stringify({
          packageId: selectedPackage.id,
          quantity: safeQty,
          network: selectedNetwork.id,
          txHash: cleanHash,
          screenshotUrl: screenshotBase64,
          note: paymentNote.trim(),
        }),
      });

      playSuccessChime();
      toast({
        title: "Direct Payment Submitted! 🎯",
        description: `Order #${res.order?.orderId} placed. Admin team is confirming TXID and dispatching your invite link(s).`,
      });

      setSelectedPackage(null);
      setSelectedQuantity(1);
      setTxHash("");
      setScreenshotBase64(null);
      setScreenshotFileName("");
      setPaymentNote("");
      await refreshUser();
      await fetchMyOrders();
    } catch (err: any) {
      setDirectPaymentError(err.message || "Failed to submit direct payment.");
    } finally {
      setIsSubmittingDirect(false);
    }
  };

  const filteredCatalog = catalog;

  const getPlatformIcon = (_cat: string) => {
    return <SiMeta className="w-5 h-5 text-[#1877F2]" />;
  };

  return (
    <ClientLayout>
      <div className="space-y-10">
        {/* Header Hero Banner */}
        <SpotlightCard tone="violet-cyan" className="p-8 md:p-10 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-cyan-300 text-xs font-bold uppercase tracking-widest mb-3">
                <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" /> Meta Portfolio Marketplace
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white">
                Buy Meta Agency Business Managers <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">& Lines</span>
              </h1>
              <p className="text-sm text-zinc-400 mt-2 max-w-2xl leading-relaxed">
                Direct access to high-trust active & enterprise Meta Business Managers starting from $7 USDT. Instant admin invite link delivery with full replacement guarantee.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-sm text-left">
                <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Available Wallet Balance</div>
                <div className="text-2xl font-black text-cyan-400 font-mono mt-0.5">
                  ${walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-zinc-500 font-bold">USDT</span>
                </div>
              </div>

              <Link href="/app/dashboard">
                <span className="inline-flex items-center gap-2 px-5 py-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 hover:scale-[1.02] text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-violet-600/25 cursor-pointer">
                  <Wallet className="w-4 h-4" /> Add Funds
                </span>
              </Link>
            </div>
          </div>
        </SpotlightCard>

        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-white">
              <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">Available Meta Business Manager Lines</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">Choose your preferred tier ($7 – $12 USDT) to instantly claim your invitation link.</p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#060608] border border-zinc-800 text-zinc-300 text-xs font-bold uppercase">
            <SiMeta className="w-4 h-4 text-violet-400" /> Meta Ads (Facebook & Instagram)
          </div>
        </div>

        {/* Catalog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCatalog.map((pkg) => {
            return (
              <SpotlightCard
                key={pkg.id}
                tone="cyber"
                className="p-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top header & badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0">
                        {getPlatformIcon(pkg.category)}
                      </div>
                      <div>
                        <h3 className="font-black text-white text-base uppercase tracking-tight leading-snug">
                          {pkg.name}
                        </h3>
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-0.5">
                          {pkg.platform}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                      <Sparkles className="w-3 h-3 text-cyan-400" /> {pkg.badge}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-zinc-300 bg-zinc-950 px-2 py-0.5 rounded-full border border-zinc-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> {pkg.stockReady} Ready in Vault
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                    {pkg.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2 pt-2 border-t border-zinc-800">
                    <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Included Line Specifications</div>
                    {pkg.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="pt-6 mt-6 border-t border-zinc-800 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">One-Time Fee</div>
                    <div className="text-2xl font-black text-white font-mono">
                      ${pkg.price} <span className="text-xs text-zinc-400 font-sans font-bold">USDT</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenBuyModal(pkg)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 hover:scale-[1.02] text-white text-xs font-black uppercase tracking-widest transition-all shadow-md shadow-violet-600/25 cursor-pointer"
                  >
                    Buy Business Manager <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </SpotlightCard>
            );
          })}
        </div>

        {/* SECTION 2: MY PURCHASED BUSINESS MANAGERS / ORDERS */}
        <div className="space-y-6 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-3">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white">
                <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">My Purchased Business Managers & Delivery Vault</span>
              </h2>
              <p className="text-xs text-zinc-400">Track your line fulfillment status and access your active invite links.</p>
            </div>

            <button
              onClick={fetchMyOrders}
              className="inline-flex items-center gap-1.5 text-xs font-black text-cyan-400 hover:text-cyan-300 uppercase cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Orders
            </button>
          </div>

          {isLoadingOrders ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
          ) : myOrders.length > 0 ? (
            <div className="space-y-4">
              {myOrders.map((order) => {
                const isDelivered = order.status === "DELIVERED";
                const qty = order.quantity || 1;
                return (
                  <SpotlightCard
                    key={order.id}
                    tone="violet-cyan"
                    className="p-6 space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs font-black uppercase text-white tracking-wider">
                            {order.orderId}
                          </span>
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            isDelivered
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : order.status === "CANCELLED"
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}>
                            {isDelivered ? "DELIVERED / ACTIVE" : order.status === "CANCELLED" ? "CANCELLED / REFUNDED" : "AWAITING ADMIN INVITE"}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-black text-zinc-300 border border-zinc-800">
                            {qty} {qty === 1 ? "Line" : "Lines"}
                          </span>
                        </div>
                        <h3 className="text-base font-black text-white mt-1 uppercase">
                          {order.bmPackageName}
                        </h3>
                        <p className="text-xs text-zinc-400">
                          {order.platform} · Total: <strong className="text-white font-mono">${order.price} USDT</strong> {qty > 1 && `($${order.unitPrice || (Number(order.price) / qty).toFixed(0)}/line)`} · Ordered: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {isDelivered && order.inviteLink ? (
                          <a
                            href={order.inviteLink.split("\n")[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white text-xs font-black uppercase tracking-widest transition-all shadow-md shadow-violet-600/25"
                          >
                            Claim BM Invite <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: "8s" }} /> Dispatching Line (~15–30m)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Delivery content / Invite Box */}
                    {isDelivered && order.inviteLink ? (
                      <div className="space-y-3 pt-1">
                        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4 text-cyan-400" /> Business Manager Invitation Link{qty > 1 ? "s" : ""} ({qty} Lines)
                            </span>
                            <span className="text-[10px] font-bold text-cyan-400">Admin Role Invitation</span>
                          </div>

                          <div className="space-y-2">
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                              {order.inviteLink.includes("\n") ? (
                                <textarea
                                  readOnly
                                  rows={Math.min(6, order.inviteLink.split("\n").length + 1)}
                                  value={order.inviteLink}
                                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white outline-none select-all resize-y"
                                />
                              ) : (
                                <input
                                  type="text"
                                  readOnly
                                  value={order.inviteLink}
                                  className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white outline-none select-all"
                                />
                              )}
                              <button
                                onClick={() => handleCopy(order.inviteLink || "", "BM Invite Link(s)")}
                                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shrink-0 shadow-xs"
                              >
                                <Copy className="w-3.5 h-3.5" /> Copy All
                              </button>
                            </div>
                          </div>

                          {order.deliveryNotes && (
                            <div className="text-xs text-zinc-300 font-medium bg-black p-3 rounded-xl border border-zinc-800">
                              <strong className="text-cyan-400">Setup Notes from Admin:</strong> {order.deliveryNotes}
                            </div>
                          )}
                        </div>

                        <div className="rounded-xl border border-zinc-800 bg-[#060608] p-3 flex items-center justify-between text-xs">
                          <span className="text-zinc-400 text-[11px]">
                            Need custom pixel transfer or dedicated onboarding assistance?
                          </span>
                          <Link href="/app/support">
                            <span className="text-[11px] font-black uppercase text-cyan-400 hover:underline cursor-pointer">
                              Open VIP Support
                            </span>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-zinc-800 bg-[#060608] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-zinc-300">
                          <Activity className="w-4 h-4 text-cyan-400" />
                          <span>Admin operations team has received your order for {qty} Business Manager line(s) and is generating your dedicated invite links. They will automatically appear here once dispatched.</span>
                        </div>
                      </div>
                    )}
                  </SpotlightCard>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-zinc-800 rounded-3xl bg-[#060608]">
              <ShoppingBag className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-sm font-black uppercase tracking-wider text-zinc-300">No Business Manager Orders Yet</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                Explore the catalog above to purchase and deploy your high-trust Business Manager lines.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Buy Confirmation Modal (Wallet & Direct Crypto Checkout) */}
      <AnimatePresence>
        {selectedPackage && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPackage(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-zinc-800 bg-[#060608] p-6 md:p-8 shadow-2xl z-10 space-y-6"
            >
              <div className="sticky -top-6 -mt-6 -mx-6 md:-mx-8 px-6 md:px-8 pt-6 pb-4 bg-[#060608]/95 backdrop-blur-md border-b border-zinc-800 z-20 flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-950/60 border border-violet-500/30 text-cyan-300 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" /> Order Checkout
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-white">
                    {selectedPackage.name}
                  </h3>
                  <p className="text-xs text-zinc-400 font-medium">
                    {selectedPackage.platform} · ${selectedPackage.price} USDT / line
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPackage(null)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* QUANTITY SELECTOR (1 to 500) */}
              <div className="p-4 rounded-2xl bg-black border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-300">
                    Order Quantity (1 to 500 lines)
                  </label>
                  <span className="text-[11px] font-bold text-zinc-400 font-mono">
                    Unit: ${selectedPackage.price} USDT
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:bg-zinc-800 font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={selectedQuantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!Number.isNaN(val)) {
                        setSelectedQuantity(Math.max(1, Math.min(500, val)));
                      } else if (e.target.value === "") {
                        setSelectedQuantity(1);
                      }
                    }}
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-center text-lg font-black font-mono text-white focus:outline-none focus:border-cyan-500 shadow-xs"
                  />

                  <button
                    type="button"
                    onClick={() => setSelectedQuantity((q) => Math.min(500, q + 1))}
                    className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:bg-zinc-800 font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Presets Chips */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mr-1">Quick:</span>
                  {[1, 5, 10, 25, 50, 100, 500].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setSelectedQuantity(preset)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
                        selectedQuantity === preset
                          ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-black shadow-xs"
                          : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-white"
                      }`}
                    >
                      {preset}x
                    </button>
                  ))}
                </div>
              </div>

              {/* DUAL PAYMENT METHOD SELECTOR TABS */}
              {(() => {
                const totalPrice = Number((selectedPackage.price * selectedQuantity).toFixed(2));
                const isBalanceEnough = walletBalance >= totalPrice;

                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-black p-1 rounded-2xl border border-zinc-800">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("WALLET")}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          paymentMethod === "WALLET"
                            ? "bg-zinc-900 text-white shadow-sm border border-zinc-700"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        <Wallet className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Wallet Balance</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                          isBalanceEnough ? "bg-cyan-500/10 text-cyan-400" : "bg-zinc-800 text-zinc-400"
                        }`}>
                          ${walletBalance.toFixed(2)}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("DIRECT_CRYPTO")}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          paymentMethod === "DIRECT_CRYPTO"
                            ? "bg-zinc-900 text-white shadow-sm border border-zinc-700"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Direct Crypto Pay</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 font-bold uppercase">
                          No Deposit
                        </span>
                      </button>
                    </div>

                    {/* Total Amount Indicator */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/40 via-black to-black border border-violet-500/20 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                          Total Order Price
                        </div>
                        <div className="text-xs text-zinc-400 mt-0.5">
                          {selectedQuantity} line(s) × ${selectedPackage.price} USDT
                        </div>
                      </div>
                      <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent font-mono tabular-nums">
                        ${totalPrice.toFixed(2)} <span className="text-xs font-bold text-zinc-400">USDT</span>
                      </div>
                    </div>

                    {/* METHOD 1: WALLET PAYMENT */}
                    {paymentMethod === "WALLET" && (
                      <div className="space-y-4 pt-1">
                        {isBalanceEnough ? (
                          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-zinc-300 space-y-1.5">
                            <div className="font-bold flex items-center gap-1.5 text-cyan-400">
                              <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Sufficient Available Balance
                            </div>
                            <p className="text-zinc-400">
                              <strong className="text-white">${totalPrice.toFixed(2)} USDT</strong> will be deducted instantly from your central wallet balance.
                            </p>
                          </div>
                        ) : (
                          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-3">
                            <div className="font-black uppercase flex items-center gap-1.5 text-amber-400">
                              <AlertCircle className="w-4 h-4" /> Insufficient Wallet Balance
                            </div>
                            <p className="text-zinc-300">
                              Your wallet has <strong className="text-white">${walletBalance.toFixed(2)} USDT</strong>. You need <strong className="text-white">${(totalPrice - walletBalance).toFixed(2)} USDT</strong> more to pay via wallet.
                            </p>
                            <button
                              type="button"
                              onClick={() => setPaymentMethod("DIRECT_CRYPTO")}
                              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white text-xs font-black uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Zap className="w-3.5 h-3.5" /> Pay Directly with Crypto (${totalPrice.toFixed(2)} USDT)
                            </button>
                          </div>
                        )}

                        <div className="flex items-center gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setSelectedPackage(null)}
                            className="w-1/2 px-4 py-3 rounded-xl border border-zinc-800 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleConfirmPurchase}
                            disabled={!isBalanceEnough || isPurchasing}
                            className="w-1/2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-violet-600/25 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isPurchasing ? (
                              <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                            ) : (
                              `Confirm Buy ($${totalPrice.toFixed(2)})`
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* METHOD 2: DIRECT CRYPTO PAYMENT */}
                    {paymentMethod === "DIRECT_CRYPTO" && (
                      <form onSubmit={handleSubmitDirectPurchase} className="space-y-5 pt-1">
                        <div className="p-3.5 rounded-2xl bg-black border border-zinc-800 text-white space-y-1">
                          <div className="text-[10px] font-black uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5" /> Direct BM Line Clearance
                          </div>
                          <p className="text-xs text-zinc-400">
                            Transfer exact amount <strong className="text-white">${totalPrice.toFixed(2)} USDT</strong> directly. No general wallet loading required.
                          </p>
                        </div>

                        {/* Network Selector */}
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-wider text-zinc-300">
                            1. Select USDT Transfer Network
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {MANUAL_PAYMENT_NETWORKS.map((net) => {
                              const isSelected = selectedNetwork.id === net.id;
                              return (
                                <button
                                  key={net.id}
                                  type="button"
                                  onClick={() => setSelectedNetwork(net)}
                                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                    isSelected
                                      ? "border-cyan-500 bg-cyan-500/10 shadow-xs"
                                      : "border-zinc-800 bg-[#060608] hover:border-zinc-700"
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-black uppercase text-white">
                                      {net.name}
                                    </span>
                                    {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                                  </div>
                                  <span className="text-[10px] font-bold text-zinc-400 uppercase mt-0.5 block">
                                    {net.badge}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* QR Code & Receiving Address */}
                        <div className="p-4 rounded-2xl bg-[#060608] border border-zinc-800 flex flex-col sm:flex-row items-center gap-4">
                          <div className="p-2.5 bg-white rounded-xl border border-zinc-700 shrink-0 shadow-2xs">
                            <QRCodeSVG
                              value={selectedNetwork.address}
                              size={110}
                              level="M"
                              includeMargin={false}
                            />
                          </div>

                          <div className="space-y-2 flex-1 min-w-0 text-left w-full">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                                Receiving {selectedNetwork.badge} Address
                              </span>
                              <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                                Exact: ${totalPrice.toFixed(2)} USDT
                              </span>
                            </div>

                            <div className="p-2.5 bg-black rounded-xl border border-zinc-800 font-mono text-xs text-cyan-400 break-all select-all">
                              {selectedNetwork.address}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleCopy(selectedNetwork.address, `${selectedNetwork.badge} Address`)}
                              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                            >
                              <Copy className="w-3.5 h-3.5" /> Copy Receiving Address
                            </button>
                          </div>
                        </div>

                        {/* TXID Input with Paste from Clipboard */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-black uppercase tracking-wider text-zinc-300">
                              2. Transaction Hash (TXID) <span className="text-rose-400">*</span>
                            </label>
                            <button
                              type="button"
                              onClick={handlePasteFromClipboard}
                              className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-cyan-400 hover:text-cyan-300 cursor-pointer"
                            >
                              <Copy className="w-3 h-3" /> Paste from Clipboard
                            </button>
                          </div>
                          <input
                            type="text"
                            required
                            placeholder={selectedNetwork.id === "tron" ? "64-character Tron Transaction Hash" : "0x... 66-character EVM Hash"}
                            value={txHash}
                            onChange={(e) => setTxHash(e.target.value)}
                            className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500 shadow-xs"
                          />
                        </div>

                        {/* Screenshot Upload */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-black uppercase tracking-wider text-zinc-300">
                            3. Payment Confirmation Screenshot <span className="text-rose-400">*</span>
                          </label>

                          {screenshotBase64 ? (
                            <div className="p-3 rounded-xl border border-cyan-500/20 bg-cyan-500/10 flex items-center justify-between">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <img
                                  src={screenshotBase64}
                                  alt="Proof"
                                  className="w-10 h-10 object-cover rounded-lg border border-zinc-800 shrink-0"
                                />
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-white truncate">
                                    {screenshotFileName || "screenshot.png"}
                                  </div>
                                  <div className="text-[10px] text-cyan-400 font-semibold">
                                    Screenshot loaded ready
                                  </div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setScreenshotBase64(null);
                                  setScreenshotFileName("");
                                }}
                                className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded-lg cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-zinc-800 hover:border-cyan-500 rounded-2xl bg-black hover:bg-zinc-950 transition-all cursor-pointer">
                              <Upload className="w-6 h-6 text-zinc-400 mb-1.5" />
                              <span className="text-xs font-bold text-zinc-300">Click to upload payment receipt</span>
                              <span className="text-[10px] text-zinc-500 mt-0.5">PNG, JPG or WEBP (Max 5MB)</span>
                              <input
                                type="file"
                                accept="image/png,image/jpeg,image/jpg,image/webp"
                                onChange={handleFileChange}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>

                        {/* Optional Note */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-black uppercase tracking-wider text-zinc-300">
                            4. Note for Administration (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., Telegram @username or special instruction"
                            value={paymentNote}
                            onChange={(e) => setPaymentNote(e.target.value)}
                            className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500 shadow-xs"
                          />
                        </div>

                        {directPaymentError && (
                          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{directPaymentError}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setSelectedPackage(null)}
                            className="w-1/3 px-4 py-3 rounded-xl border border-zinc-800 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmittingDirect || !txHash || !screenshotBase64}
                            className="w-2/3 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-violet-600/25 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSubmittingDirect ? (
                              <><Loader2 className="w-4 h-4 animate-spin" /> Submitting Proof...</>
                            ) : (
                              `Submit Direct Payment ($${totalPrice.toFixed(2)})`
                            )}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ClientLayout>
  );
}
