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
  const [activeFilter, setActiveFilter] = useState<string>("all");

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
    // If client has enough balance, default to wallet, else direct crypto
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
      // Fallback to static catalog
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

    // Auto refresh orders every 20s to catch newly delivered links
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
        description: `Order #${res.order?.orderId} placed. Admin team is verifying TXID and dispatching your invite link(s).`,
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
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-emerald-50 via-white to-slate-50 p-8 md:p-10 shadow-sm">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-3">
                <ShoppingBag className="w-3.5 h-3.5" /> Meta Portfolio Marketplace
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight text-slate-900">
                Buy Meta Agency Business Managers <span className="text-emerald-600">& Lines</span>
              </h1>
              <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
                Direct access to high-trust active & enterprise Meta Business Managers starting from $7 USDT. Instant admin invite link delivery with full replacement guarantee.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-left">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Available Wallet Balance</div>
                <div className="text-2xl font-black text-emerald-700 font-mono mt-0.5">
                  ${walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-slate-500 font-bold">USDT</span>
                </div>
              </div>

              <Link href="/app/dashboard">
                <a className="inline-flex items-center gap-2 px-5 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/25">
                  <Wallet className="w-4 h-4" /> Add Funds
                </a>
              </Link>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">
              Available Meta Business Manager Lines
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Choose your preferred tier ($7 – $12 USDT) to instantly claim your invitation link.</p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase">
            <SiMeta className="w-4 h-4 text-[#1877F2]" /> Meta Ads (Facebook & Instagram)
          </div>
        </div>

        {/* Catalog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCatalog.map((pkg) => {
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 p-6 flex flex-col justify-between hover:border-slate-300 hover:shadow-2xl transition-all"
              >
                <div className="space-y-4">
                  {/* Top header & badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                        {getPlatformIcon(pkg.category)}
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 text-base uppercase tracking-tight leading-snug">
                          {pkg.name}
                        </h3>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                          {pkg.platform}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <Sparkles className="w-3 h-3 text-emerald-600" /> {pkg.badge}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-slate-600 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {pkg.stockReady} Ready in Vault
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {pkg.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Included Line Specifications</div>
                    {pkg.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">One-Time Fee</div>
                    <div className="text-2xl font-black text-slate-900 font-mono">
                      ${pkg.price} <span className="text-xs text-slate-500 font-sans font-bold">USDT</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenBuyModal(pkg)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    Buy Business Manager <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* SECTION 2: MY PURCHASED BUSINESS MANAGERS / ORDERS */}
        <div className="space-y-6 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">
                My Purchased Business Managers & Delivery Vault
              </h2>
              <p className="text-xs text-slate-500">Track your line fulfillment status and access your active invite links.</p>
            </div>

            <button
              onClick={fetchMyOrders}
              className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-700 hover:text-emerald-800 uppercase cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Orders
            </button>
          </div>

          {isLoadingOrders ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            </div>
          ) : myOrders.length > 0 ? (
            <div className="space-y-4">
              {myOrders.map((order) => {
                const isDelivered = order.status === "DELIVERED";
                const qty = order.quantity || 1;
                return (
                  <div
                    key={order.id}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs font-black uppercase text-slate-900 tracking-wider">
                            {order.orderId}
                          </span>
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            isDelivered
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : order.status === "CANCELLED"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}>
                            {isDelivered ? "DELIVERED / ACTIVE" : order.status === "CANCELLED" ? "CANCELLED / REFUNDED" : "AWAITING ADMIN INVITE"}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            {qty} {qty === 1 ? "Line" : "Lines"}
                          </span>
                        </div>
                        <h3 className="text-base font-black text-slate-900 mt-1 uppercase">
                          {order.bmPackageName}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {order.platform} · Total: <strong className="text-slate-900 font-mono">${order.price} USDT</strong> {qty > 1 && `($${order.unitPrice || (Number(order.price) / qty).toFixed(0)}/line)`} · Ordered: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {isDelivered && order.inviteLink ? (
                          <a
                            href={order.inviteLink.split("\n")[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest transition-all shadow-md shadow-emerald-600/25"
                          >
                            Claim BM Invite <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: "8s" }} /> Dispatching Line (~15–30m)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Delivery content / Invite Box */}
                    {isDelivered && order.inviteLink ? (
                      <div className="space-y-3 pt-1">
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4 text-emerald-700" /> Business Manager Invitation Link{qty > 1 ? "s" : ""} ({qty} Lines)
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700">Admin Role Invitation</span>
                          </div>

                          <div className="space-y-2">
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                              {order.inviteLink.includes("\n") ? (
                                <textarea
                                  readOnly
                                  rows={Math.min(6, order.inviteLink.split("\n").length + 1)}
                                  value={order.inviteLink}
                                  className="w-full bg-white border border-emerald-200 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-900 outline-none select-all resize-y"
                                />
                              ) : (
                                <input
                                  type="text"
                                  readOnly
                                  value={order.inviteLink}
                                  className="flex-1 bg-white border border-emerald-200 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-900 outline-none select-all"
                                />
                              )}
                              <button
                                onClick={() => handleCopy(order.inviteLink || "", "BM Invite Link(s)")}
                                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shrink-0 shadow-xs"
                              >
                                <Copy className="w-3.5 h-3.5" /> Copy All
                              </button>
                            </div>
                          </div>

                          {order.deliveryNotes && (
                            <div className="text-xs text-emerald-950 font-medium bg-white/80 p-3 rounded-xl border border-emerald-100">
                              <strong>Setup Notes from Admin:</strong> {order.deliveryNotes}
                            </div>
                          )}
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-center justify-between text-xs">
                          <span className="text-slate-600 text-[11px]">
                            Need custom pixel transfer or dedicated onboarding assistance?
                          </span>
                          <Link href="/app/support">
                            <a className="text-[11px] font-black uppercase text-emerald-700 hover:underline">
                              Open VIP Support
                            </a>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-slate-700">
                          <Activity className="w-4 h-4 text-emerald-600" />
                          <span>Admin operations team has received your order for {qty} Business Manager line(s) and is generating your dedicated invite links. They will automatically appear here once dispatched.</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-700">No Business Manager Orders Yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
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
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-2xl shadow-slate-900/20 z-10 space-y-6"
            >
              <div className="sticky -top-6 -mt-6 -mx-6 md:-mx-8 px-6 md:px-8 pt-6 pb-4 bg-white/95 backdrop-blur-md border-b border-slate-100 z-20 flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                    <ShoppingBag className="w-3.5 h-3.5" /> Order Checkout
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">
                    {selectedPackage.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedPackage.platform} · ${selectedPackage.price} USDT / line
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPackage(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* QUANTITY SELECTOR (1 to 500) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Order Quantity (1 to 500 lines)
                  </label>
                  <span className="text-[11px] font-bold text-slate-500 font-mono">
                    Unit: ${selectedPackage.price} USDT
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold transition-colors cursor-pointer shadow-xs"
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
                    className="flex-1 bg-white border border-slate-200 rounded-xl py-2 px-3 text-center text-lg font-black font-mono text-slate-900 focus:outline-none focus:border-emerald-600 shadow-xs"
                  />

                  <button
                    type="button"
                    onClick={() => setSelectedQuantity((q) => Math.min(500, q + 1))}
                    className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Presets Chips */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">Quick:</span>
                  {[1, 5, 10, 25, 50, 100, 500].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setSelectedQuantity(preset)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
                        selectedQuantity === preset
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
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
                    <div className="flex items-center justify-between bg-slate-100 p-1 rounded-2xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("WALLET")}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          paymentMethod === "WALLET"
                            ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Wallet Balance</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                          isBalanceEnough ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
                        }`}>
                          ${walletBalance.toFixed(2)}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("DIRECT_CRYPTO")}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          paymentMethod === "DIRECT_CRYPTO"
                            ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Direct Crypto Pay</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase">
                          No Deposit
                        </span>
                      </button>
                    </div>

                    {/* Total Amount Indicator */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border border-emerald-200/80 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
                          Total Order Price
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {selectedQuantity} line(s) × ${selectedPackage.price} USDT
                        </div>
                      </div>
                      <div className="text-2xl md:text-3xl font-black text-emerald-800 font-mono tabular-nums">
                        ${totalPrice.toFixed(2)} <span className="text-xs font-bold text-emerald-600">USDT</span>
                      </div>
                    </div>

                    {/* METHOD 1: WALLET PAYMENT */}
                    {paymentMethod === "WALLET" && (
                      <div className="space-y-4 pt-1">
                        {isBalanceEnough ? (
                          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 space-y-1.5">
                            <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Sufficient Available Balance
                            </div>
                            <p className="text-slate-600">
                              <strong>${totalPrice.toFixed(2)} USDT</strong> will be deducted instantly from your central wallet balance.
                            </p>
                          </div>
                        ) : (
                          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-3">
                            <div className="font-black uppercase flex items-center gap-1.5 text-amber-800">
                              <AlertCircle className="w-4 h-4" /> Insufficient Wallet Balance
                            </div>
                            <p className="text-slate-600">
                              Your wallet has <strong>${walletBalance.toFixed(2)} USDT</strong>. You need <strong>${(totalPrice - walletBalance).toFixed(2)} USDT</strong> more to pay via wallet.
                            </p>
                            <button
                              type="button"
                              onClick={() => setPaymentMethod("DIRECT_CRYPTO")}
                              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Zap className="w-3.5 h-3.5" /> Pay Directly with Crypto ($ {totalPrice.toFixed(2)} USDT)
                            </button>
                          </div>
                        )}

                        <div className="flex items-center gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setSelectedPackage(null)}
                            className="w-1/2 px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleConfirmPurchase}
                            disabled={!isBalanceEnough || isPurchasing}
                            className="w-1/2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-600/25 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <div className="p-3.5 rounded-2xl bg-slate-900 text-white space-y-1">
                          <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5" /> Direct BM Line Clearance
                          </div>
                          <p className="text-xs text-slate-300">
                            Transfer exact amount <strong>${totalPrice.toFixed(2)} USDT</strong> directly. No general wallet loading required.
                          </p>
                        </div>

                        {/* Network Selector */}
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-wider text-slate-700">
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
                                      ? "border-emerald-600 bg-emerald-50/70 shadow-xs"
                                      : "border-slate-200 bg-white hover:border-slate-300"
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-black uppercase text-slate-900">
                                      {net.name}
                                    </span>
                                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-500 uppercase mt-0.5 block">
                                    {net.badge}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* QR Code & Receiving Address */}
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                          <div className="p-2.5 bg-white rounded-xl border border-slate-200 shrink-0 shadow-2xs">
                            <QRCodeSVG
                              value={selectedNetwork.address}
                              size={110}
                              level="M"
                              includeMargin={false}
                            />
                          </div>

                          <div className="space-y-2 flex-1 min-w-0 text-left w-full">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                                Receiving {selectedNetwork.badge} Address
                              </span>
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                                Exact: ${totalPrice.toFixed(2)} USDT
                              </span>
                            </div>

                            <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-xs text-slate-900 break-all select-all">
                              {selectedNetwork.address}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleCopy(selectedNetwork.address, `${selectedNetwork.badge} Address`)}
                              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                            >
                              <Copy className="w-3.5 h-3.5" /> Copy Receiving Address
                            </button>
                          </div>
                        </div>

                        {/* TXID Input with Paste from Clipboard */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                              2. Transaction Hash (TXID) <span className="text-red-500">*</span>
                            </label>
                            <button
                              type="button"
                              onClick={handlePasteFromClipboard}
                              className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-700 hover:text-emerald-800 cursor-pointer"
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
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-600 shadow-xs"
                          />
                        </div>

                        {/* Screenshot Upload */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                            3. Payment Confirmation Screenshot <span className="text-red-500">*</span>
                          </label>

                          {screenshotBase64 ? (
                            <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <img
                                  src={screenshotBase64}
                                  alt="Proof"
                                  className="w-10 h-10 object-cover rounded-lg border border-emerald-200 shrink-0"
                                />
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-slate-900 truncate">
                                    {screenshotFileName || "screenshot.png"}
                                  </div>
                                  <div className="text-[10px] text-emerald-700 font-semibold">
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
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl bg-slate-50/60 hover:bg-emerald-50/20 transition-all cursor-pointer">
                              <Upload className="w-6 h-6 text-slate-400 mb-1.5" />
                              <span className="text-xs font-bold text-slate-700">Click to upload payment receipt</span>
                              <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG or WEBP (Max 5MB)</span>
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
                          <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                            4. Note for Administration (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., Telegram @username or special instruction"
                            value={paymentNote}
                            onChange={(e) => setPaymentNote(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 shadow-xs"
                          />
                        </div>

                        {directPaymentError && (
                          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{directPaymentError}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setSelectedPackage(null)}
                            className="w-1/3 px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmittingDirect || !txHash || !screenshotBase64}
                            className="w-2/3 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-600/25 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
