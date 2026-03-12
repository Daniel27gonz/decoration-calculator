import { Link, useNavigate } from 'react-router-dom';
import { Calculator, History, TrendingUp, Sparkles, MessageCircle, Lock, ShoppingBag, DollarSign, CalendarDays, BarChart3, FileText, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useQuote } from '@/contexts/QuoteContext';
import { useAuth } from '@/contexts/AuthContext';
import InstallPrompt from '@/components/InstallPrompt';
import FirstLoginInstallPrompt from '@/components/FirstLoginInstallPrompt';
import { PendingApproval } from '@/components/PendingApproval';
import { useEffect, useMemo } from 'react';
import { getCurrencyByCode } from '@/lib/currencies';

const activeFeatures = [
  {
    icon: Calculator,
    title: 'Calcular',
    description: 'Calcula costos y precios de tu evento',
    href: '/calculator',
  },
  {
    icon: History,
    title: 'Historial',
    description: 'Cotizaciones guardadas',
    href: '/history',
  },
];

const lockedFeatures = [
  {
    icon: FileText,
    title: 'Cotización (PDF)',
    description: 'Cotización profesional en PDF',
  },
  {
    icon: ShoppingBag,
    title: 'Pedidos de clientes',
    description: 'Guarda cada pedido y revisa qué decoraciones tienes pendientes.',
  },
  {
    icon: DollarSign,
    title: 'Anticipos',
    description: 'Registra cuánto te pagaron y cuánto falta por cobrar.',
  },
  {
    icon: CalendarDays,
    title: 'Agenda de eventos',
    description: 'Organiza las fechas de tus eventos y evita cruzar pedidos.',
  },
  {
    icon: BarChart3,
    title: 'Ingresos y gastos',
    description: 'Registra lo que gastas en materiales y lo que entra de cada decoración.',
  },
  {
    icon: TrendingUp,
    title: 'Resumen del mes',
    description: 'Mira cuánto dinero ganaste realmente en el mes.',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { quotes, calculateCosts } = useQuote();
  const { user, profile, loading, isApproved, approvalStatus, isAdmin } = useAuth();
  
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

  if (!user) {
    return null;
  }

  if (!isAdmin && approvalStatus && !isApproved) {
    return <PendingApproval status={approvalStatus as 'pending' | 'rejected'} />;
  }

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      {/* Hero Section */}
      <section className="gradient-hero pt-20 pb-8 px-4">
        <div className="container max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-soft">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Calculadora para decoradoras</span>
          </div>
          
          <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight">
            Calculadora para
            <span className="text-gradient block">Decoradoras de Globos</span>
          </h1>
          
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Calcula el precio perfecto para tus decoraciones, 
            visualiza tu ganancia y envía cotizaciones profesionales.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button asChild variant="gradient" size="xl">
              <Link to="/calculator">
                <Calculator className="w-5 h-5" />
                Crear Cotización
              </Link>
            </Button>
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

      {/* Quick Stats */}
      {quotes.length > 0 && (
        <section className="container max-w-4xl mx-auto px-4 mt-6">
          <Card elevated>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ingresos proyectados</p>
                  <p className="text-2xl font-bold">{currencySymbol}{totalRevenue.toLocaleString('es-LA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Active Features */}
      <section className="container max-w-4xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {activeFeatures.map(({ icon: Icon, title, description, href }) => (
            <Link key={href} to={href}>
              <Card className="h-full hover:scale-[1.02] transition-transform duration-300 border-primary/20">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-rose-light flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
                    <p className="text-xs text-muted-foreground truncate">{description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Locked Features - Próximamente */}
      <section className="container max-w-4xl mx-auto px-4 mt-8 mb-8">
        <h2 className="font-display text-lg font-semibold text-foreground mb-3">Próximamente</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {lockedFeatures.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="h-full opacity-60 cursor-not-allowed border-border">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 relative">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <Lock className="w-3 h-3 text-muted-foreground absolute -bottom-0.5 -right-0.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-base font-semibold text-muted-foreground">{title}</h3>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">🔒</span>
                  </div>
                  <p className="text-xs text-muted-foreground/70 line-clamp-2">{description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
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