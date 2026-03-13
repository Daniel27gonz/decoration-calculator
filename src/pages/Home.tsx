import { Link, useNavigate } from 'react-router-dom';
import { Calculator, ShoppingBag, DollarSign, Calendar, BarChart3, ClipboardList, Lock, Sparkles, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import InstallPrompt from '@/components/InstallPrompt';
import FirstLoginInstallPrompt from '@/components/FirstLoginInstallPrompt';
import { PendingApproval } from '@/components/PendingApproval';
import { useEffect } from 'react';

const dashboardFeatures = [
  {
    icon: Calculator,
    title: 'Nueva Cotización',
    description: 'Calcula cuánto cobrar por una decoración.',
    href: '/calculator',
    locked: false,
  },
  {
    icon: ShoppingBag,
    title: 'Pedidos de clientes',
    description: 'Guarda cada pedido y revisa qué decoraciones tienes pendientes.',
    href: '#',
    locked: true,
  },
  {
    icon: DollarSign,
    title: 'Anticipos',
    description: 'Registra cuánto te pagaron y cuánto falta por cobrar.',
    href: '#',
    locked: true,
  },
  {
    icon: Calendar,
    title: 'Agenda de eventos',
    description: 'Organiza las fechas de tus decoraciones.',
    href: '#',
    locked: true,
  },
  {
    icon: BarChart3,
    title: 'Ingresos y gastos',
    description: 'Controla lo que ganas y lo que gastas en cada decoración.',
    href: '#',
    locked: true,
  },
  {
    icon: ClipboardList,
    title: 'Resumen del mes',
    description: 'Mira cuánto dinero ganaste realmente en el mes.',
    href: '#',
    locked: true,
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { user, profile, loading, isApproved, approvalStatus, isAdmin } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

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
    <div className="min-h-screen pb-24 md:pb-8">
      {/* Hero compacto */}
      <section className="gradient-hero px-4 pt-10 pb-6 md:pt-16 md:pb-10">
        <div className="container max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-soft">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Panel de Decoradora</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight">
            ¡Hola, {profile?.name || profile?.business_name || user.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Gestiona tus decoraciones de eventos desde un solo lugar.
          </p>
          <Button asChild
            variant="outline"
            size="default"
            className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-950"
          >
            <a
              href="/whatsapp-redirect.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Únete a nuestra Comunidad 🎀</span>
            </a>
          </Button>
        </div>
      </section>

      {/* Dashboard Grid */}
      <section className="container max-w-4xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {dashboardFeatures.map((feature) => {
            const Icon = feature.icon;
            const content = (
              <Card
                key={feature.title}
                className={`relative h-full transition-all duration-300 ${
                  feature.locked
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:scale-[1.03] cursor-pointer'
                }`}
              >
                {feature.locked && (
                  <div className="absolute top-3 right-3 text-muted-foreground">
                    <Lock className="w-4 h-4" />
                  </div>
                )}
                <CardContent className="p-5 flex flex-col items-center text-center gap-3 pt-6">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center ${
                      feature.locked
                        ? 'bg-muted text-muted-foreground'
                        : 'gradient-primary text-primary-foreground'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display text-sm md:text-base font-semibold leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-snug">
                      {feature.description}
                    </p>
                  </div>
                  {feature.locked && (
                    <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      Próximamente
                    </span>
                  )}
                </CardContent>
              </Card>
            );

            return feature.locked ? (
              <div key={feature.title}>{content}</div>
            ) : (
              <Link key={feature.title} to={feature.href}>
                {content}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Decorative */}
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
