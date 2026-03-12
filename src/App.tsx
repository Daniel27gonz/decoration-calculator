import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { QuoteProvider } from "@/contexts/QuoteContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import PWAInstallPopup from "@/components/PWAInstallPopup";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Calculator from "./pages/Calculator";
import Finances from "./pages/Finances";
import History from "./pages/History";
import Settings from "./pages/Settings";
import Install from "./pages/Install";
import Design from "./pages/Design";
import AdminDatabase from "./pages/AdminDatabase";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const pageTitles: Record<string, string> = {
  "/": "Inicio",
  "/calculator": "Cotizar",
  "/finances": "Mi Dinero",
  "/history": "Historial",
  "/settings": "Configuración",
  "/design": "Cotización PDF",
  "/admin/database": "Database",
  "/install": "Instalar",
};

function AppLayout() {
  const location = useLocation();
  const { user, loading } = useAuth();
  const isAuthPage = location.pathname === "/auth";

  if (isAuthPage || (!loading && !user)) {
    return (
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Auth />} />
      </Routes>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b border-border bg-card/95 backdrop-blur-lg sticky top-0 z-50 px-4 gap-3">
            <SidebarTrigger />
            <span className="font-display text-lg font-semibold text-foreground">
              {pageTitles[location.pathname] || ""}
            </span>
          </header>
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/finances" element={<Finances />} />
              <Route path="/history" element={<History />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/install" element={<Install />} />
              <Route path="/design" element={<Design />} />
              <Route path="/admin/database" element={<AdminDatabase />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <QuoteProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <PWAInstallPopup />
            <AppLayout />
          </BrowserRouter>
        </TooltipProvider>
      </QuoteProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;