import { useEffect, useRef } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { captureAttribution } from "@/lib/utm";
import { trackViewContent, trackLead, trackSubscribe } from "@/lib/pixel";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoadingScreen from "@/components/LoadingScreen";
import StickyUrgencyBar from "@/components/StickyUrgencyBar";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import CursorGlow from "@/components/effects/CursorGlow";
import NoiseTexture from "@/components/effects/NoiseTexture";
import AmbientLights from "@/components/effects/AmbientLights";

import Home from "@/pages/Home";
import Features from "@/pages/Features";
import Solutions from "@/pages/Solutions";
import AgencyAccounts from "@/pages/AgencyAccounts";
import HowItWorks from "@/pages/HowItWorks";
import About from "@/pages/About";
import Faq from "@/pages/Faq";
import Contact from "@/pages/Contact";
import Advertise from "@/pages/Advertise";
import Privacy from "@/pages/Privacy";
import Refund from "@/pages/Refund";
import Terms from "@/pages/Terms";
import ApplyAgencyAccount from "@/pages/ApplyAgencyAccount";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import ForgotPassword from "@/pages/ForgotPassword";

import ClientDashboard from "@/pages/ClientDashboard";
import ClientApplication from "@/pages/ClientApplication";
import ClientDocuments from "@/pages/ClientDocuments";
import ClientNotifications from "@/pages/ClientNotifications";
import ClientSupport from "@/pages/ClientSupport";
import ClientSettings from "@/pages/ClientSettings";

import AdminLogin from "@/pages/AdminLogin";
import AdminApplications from "@/pages/AdminApplications";
import AdminAccounts from "@/pages/AdminAccounts";
import AdminDocuments from "@/pages/AdminDocuments";
import AdminUsers from "@/pages/AdminUsers";
import AdminSupport from "@/pages/AdminSupport";
import AdminNotifications from "@/pages/AdminNotifications";
import AdminSettings from "@/pages/AdminSettings";
import AdminAuditLog from "@/pages/AdminAuditLog";
import AdminPayments from "@/pages/AdminPayments";
import AdminLiveChat from "@/pages/AdminLiveChat";

import { AuthProvider, useAuth } from "@/hooks/useAuth";
import ChatWidget from "@/components/chat/ChatWidget";
import NotFound from "@/pages/not-found";
import { Loader2 } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const queryClient = new QueryClient();

function ProtectedRoute({ path, component: Component, role }: { path: string; component: React.ComponentType; role?: string }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        setLocation(role === "ADMIN" ? "/admin/login" : "/login");
      } else if (role === "ADMIN" && !["SUPER_ADMIN", "ADMIN", "REVIEWER", "SUPPORT"].includes(user.role)) {
        setLocation("/login");
      }
    }
  }, [user, isLoading, role]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) return null;
  if (role === "ADMIN" && !["SUPER_ADMIN", "ADMIN", "REVIEWER", "SUPPORT"].includes(user.role)) return null;

  return <Component />;
}

function Router() {
  const [location, setLocation] = useLocation();
  const firstRoute = useRef(true);
  useEffect(() => {
    // Skip initial route — index.html pixel already fires PageView on load
    if (firstRoute.current) {
      firstRoute.current = false;
      return;
    }
    trackViewContent({ path: location });
  }, [location]);

  const isAppOrAdmin = location.startsWith("/app") || location.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-white">
      {!isAppOrAdmin && <Navbar />}
      <main className="flex-1 relative z-10">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/features" component={Features} />
          <Route path="/solutions" component={Solutions} />
          <Route path="/agency-accounts" component={AgencyAccounts} />
          <Route path="/how-it-works" component={HowItWorks} />
          <Route path="/about" component={About} />
          <Route path="/faq" component={Faq} />
          <Route path="/contact" component={Contact} />
          <Route path="/apply-agency" component={ApplyAgencyAccount} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/register" component={Signup} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/advertise" component={Advertise} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/refund" component={Refund} />
          <Route path="/terms" component={Terms} />

          {/* Client Cockpit Routes */}
          <Route path="/app/dashboard">
            {() => <ProtectedRoute path="/app/dashboard" component={ClientDashboard} />}
          </Route>
          <Route path="/app/application">
            {() => <ProtectedRoute path="/app/application" component={ClientApplication} />}
          </Route>
          <Route path="/app/documents">
            {() => <ProtectedRoute path="/app/documents" component={ClientDocuments} />}
          </Route>
          <Route path="/app/notifications">
            {() => <ProtectedRoute path="/app/notifications" component={ClientNotifications} />}
          </Route>
          <Route path="/app/support">
            {() => <ProtectedRoute path="/app/support" component={ClientSupport} />}
          </Route>
          <Route path="/app/account">
            {() => <ProtectedRoute path="/app/account" component={ClientSettings} />}
          </Route>
          <Route path="/app/settings">
            {() => <ProtectedRoute path="/app/settings" component={ClientSettings} />}
          </Route>

          {/* Admin Operations Control Routes */}
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin/dashboard">
            {() => <ProtectedRoute path="/admin/dashboard" component={AdminApplications} role="ADMIN" />}
          </Route>
          <Route path="/admin/payments">
            {() => <ProtectedRoute path="/admin/payments" component={AdminPayments} role="ADMIN" />}
          </Route>
          <Route path="/admin/applications">
            {() => <ProtectedRoute path="/admin/applications" component={AdminApplications} role="ADMIN" />}
          </Route>
          <Route path="/admin/accounts">
            {() => <ProtectedRoute path="/admin/accounts" component={AdminAccounts} role="ADMIN" />}
          </Route>
          <Route path="/admin/documents">
            {() => <ProtectedRoute path="/admin/documents" component={AdminDocuments} role="ADMIN" />}
          </Route>
          <Route path="/admin/users">
            {() => <ProtectedRoute path="/admin/users" component={AdminUsers} role="ADMIN" />}
          </Route>
          <Route path="/admin/support">
            {() => <ProtectedRoute path="/admin/support" component={AdminSupport} role="ADMIN" />}
          </Route>
          <Route path="/admin/notifications">
            {() => <ProtectedRoute path="/admin/notifications" component={AdminNotifications} role="ADMIN" />}
          </Route>
          <Route path="/admin/settings">
            {() => <ProtectedRoute path="/admin/settings" component={AdminSettings} role="ADMIN" />}
          </Route>
          <Route path="/admin/audit-log">
            {() => <ProtectedRoute path="/admin/audit-log" component={AdminAuditLog} role="ADMIN" />}
          </Route>
          <Route path="/admin/live-chat">
            {() => <ProtectedRoute path="/admin/live-chat" component={AdminLiveChat} role="ADMIN" />}
          </Route>

          <Route component={NotFound} />
        </Switch>
      </main>
      {!isAppOrAdmin && <Footer />}
    </div>
  );
}

function App() {
  // Force dark mode + capture UTM attribution + global Telegram click tracking
  useEffect(() => {
    document.documentElement.classList.add("dark");
    captureAttribution();

    // Delegated click listener — fires Pixel events on every Telegram/contact button click:
    //  • Lead       → Meta's standard high-intent conversion event
    //  • Subscribe  → fires alongside Lead on the same click
    // 1-second dedupe protects against rapid double-clicks.
    let lastWaClickAt = 0;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const waAnchor = target?.closest?.('a[href*="t.me/"]') as HTMLAnchorElement | null;
      if (!waAnchor) return;

      const now = Date.now();
      if (now - lastWaClickAt < 1000) return;
      lastWaClickAt = now;

      const label =
        waAnchor.getAttribute('data-cta') ||
        waAnchor.getAttribute('aria-label') ||
        waAnchor.textContent?.trim().slice(0, 60) ||
        'telegram-cta';
      const href = waAnchor.href.slice(0, 120);
      const path = window.location.pathname;

      try {
        trackLead({ source: "wa-click", label, href, path });
        trackSubscribe({ source: "wa-click", label, href, path });
      } catch {}
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AmbientLights />
          <NoiseTexture />
          <CursorGlow />
          <LoadingScreen />
          <StickyUrgencyBar />
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <ChatWidget />
          </WouterRouter>
          <ExitIntentPopup />
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
