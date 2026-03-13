import { Link, useNavigate } from 'react-router-dom';
import { Calculator, TrendingUp, Sparkles, MessageCircle, ArrowUpLeft, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useQuote } from '@/contexts/QuoteContext';
import { useAuth } from '@/contexts/AuthContext';
import InstallPrompt from '@/components/InstallPrompt';
import FirstLoginInstallPrompt from '@/components/FirstLoginInstallPrompt';
import { PendingApproval } from '@/components/PendingApproval';
import { useEffect, useMemo, useState } from 'react';
import { getCurrencyByCode } from '@/lib/currencies';
import { useSidebar } from '@/components/ui/sidebar';

export default function Home() {
  const navigate = useNavigate();
  const { quotes, calculateCosts } = useQuote();
  const { user, profile, loading, isApproved, approvalStatus, isAdmin } = useAuth();
  const { setOpenMobile, isMobile } = useSidebar();
  const [showMenuHint, setShowMenuHint] = useState(true);
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const currencySymbol = useMemo(() => {
    const currency = getCurrencyByCode(profile?.currency || 'USD');
    return currency?.symbol || '$';
  }, [profile?.currency]);

  const totalRevenue = useMemo(() => {
    return quotes.reduce((sum, quote) => {
      const costs = calculateCosts(quote);
      return sum + costs.finalPrice;
    }, 0);
  }, [quotes, calculateCosts]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🎈</div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin && approvalStatus && !isApproved) {
    return <PendingApproval status={approvalStatus as 'pending' | 'rejected'} />;
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      {/* Hero Section - fills available space */}
      <section className="gradient-hero flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-4xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-soft">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Calculadora para decoradoras</span>
          </div>
          
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Calculadora para
            <span className="text-gradient block">Decoradoras de Globos</span>
          </h1>
          
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Calcula el precio perfecto para tus decoraciones, 
            visualiza tu ganancia y envía cotizaciones profesionales.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button asChild
              variant="outline" 
              size="default"
              className="w-full sm:w-auto text-xs sm:text-base px-3 sm:px-6 py-2 sm:py-3 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-950"
            >
              <a
                href="/whatsapp-redirect.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="truncate">Únete a nuestra Comunidad Privada 🎀</span>
              </a>
            </Button>
          </div>


          <p className="text-sm text-muted-foreground pt-2">
            ¡Hola, {profile?.name || profile?.business_name || user.email?.split('@')[0]}! 👋
          </p>
        </div>
      </section>

      {/* Decorative Elements */}
      <div className="fixed top-20 right-10 text-6xl opacity-20 animate-float pointer-events-none hidden md:block">
        🎈
      </div>
      <div className="fixed bottom-32 left-10 text-4xl opacity-15 animate-float pointer-events-none hidden md:block" style={{ animationDelay: '1s' }}>
        🎀
      </div>

      <InstallPrompt />
      <FirstLoginInstallPrompt />
    </div>
  );
}