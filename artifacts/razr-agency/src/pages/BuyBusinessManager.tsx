import { useState, useEffect } from "react";
import ClientLayout from "@/components/layout/ClientLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
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
  Plus
} from "lucide-react";
import { SiMeta } from "react-icons/si";
import { apiFetch } from "@/lib/api";

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

  const walletBalance = Number(user?.balance || 0);

  const handleOpenBuyModal = (pkg: BmPackage) => {
    setSelectedPackage(pkg);
    setSelectedQuantity(1);
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

      {/* Buy Confirmation Modal */}
      <AnimatePresence>
        {selectedPackage && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPackage(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 md:p-8 overflow-hidden shadow-2xl shadow-slate-200/60 z-10 space-y-5"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 to-teal-600" />
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wider mb-2">
                    <ShoppingBag className="w-3.5 h-3.5" /> Order Confirmation
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">
                    Confirm Business Manager Purchase
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5 font-medium">
                    {selectedPackage.name} · {selectedPackage.platform}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPackage(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* QUANTITY SELECTOR (1 to 500) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Select Quantity (1 to 500)
                  </label>
                  <span className="text-[11px] font-bold text-slate-500">
                    Unit Price: ${selectedPackage.price} USDT
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
                    className="flex-1 bg-white border border-slate-200 rounded-xl py-2 px-3 text-center text-base font-black font-mono text-slate-900 focus:outline-none focus:border-emerald-600 shadow-xs"
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

              {/* Package Summary Box */}
              {(() => {
                const totalPrice = Number((selectedPackage.price * selectedQuantity).toFixed(2));
                const isBalanceEnough = walletBalance >= totalPrice;

                return (
                  <>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3 text-xs">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-bold uppercase">Package:</span>
                        <span className="font-black text-slate-900 uppercase">{selectedPackage.name}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-bold uppercase">Quantity:</span>
                        <span className="font-black text-slate-900 font-mono">{selectedQuantity} Line(s)</span>
                      </div>
                      <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200">
                        <span className="text-slate-500 font-bold uppercase">Total Order Price:</span>
                        <span className="font-mono font-black text-emerald-700 text-base">${totalPrice} USDT</span>
                      </div>
                      <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200">
                        <span className="text-slate-500 font-bold uppercase">Your Available Balance:</span>
                        <span className={`font-mono font-bold ${isBalanceEnough ? "text-slate-900" : "text-red-600"}`}>
                          ${walletBalance.toFixed(2)} USDT
                        </span>
                      </div>
                    </div>

                    {!isBalanceEnough ? (
                      <div className="space-y-4">
                        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                          <div className="font-black uppercase flex items-center gap-1.5 text-amber-800">
                            <AlertCircle className="w-4 h-4" /> Insufficient Wallet Balance
                          </div>
                          <p>
                            You need <strong>${(totalPrice - walletBalance).toFixed(2)} USDT</strong> more to complete this order for {selectedQuantity} line(s). Top up your main wallet to complete purchase.
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setSelectedPackage(null)}
                            className="w-1/2 px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <Link href="/app/dashboard">
                            <a className="w-1/2 inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-600/25">
                              <PlusCircle className="w-4 h-4" /> Add Funds
                            </a>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                          <span className="font-bold">Instant Wallet Deduction:</span> ${totalPrice} USDT ({selectedQuantity}x @ ${selectedPackage.price}) will be deducted from your wallet balance.
                        </div>

                        <div className="flex items-center gap-3">
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
                            disabled={isPurchasing}
                            className="w-1/2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-600/25 transition-all cursor-pointer disabled:opacity-50"
                          >
                            {isPurchasing ? (
                              <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                            ) : (
                              `Confirm Buy (${selectedQuantity}x · $${totalPrice})`
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ClientLayout>
  );
}
