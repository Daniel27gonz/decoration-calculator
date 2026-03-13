import { Link, useLocation } from 'react-router-dom';
import { Home, Calculator, History, Settings, User, Wallet, Palette, Database, Menu, Lock, ShoppingBag, DollarSign, Calendar, BarChart3, FileText, ClipboardList, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

const mobileNavItems = [
  { path: '/', icon: Home, label: 'Inicio' },
  { path: '/calculator', icon: Calculator, label: 'Cotizar' },
  { path: '/history', icon: History, label: 'Historial' },
  { path: '/settings', icon: Settings, label: 'Ajustes' },
];

const desktopNavItems = [
  { path: '/', icon: Home, label: 'Inicio' },
  { path: '/calculator', icon: Calculator, label: 'Cotizar' },
  { path: '/history', icon: History, label: 'Historial' },
  { path: '/settings', icon: Settings, label: 'Ajustes' },
];

const sidebarActiveItems = [
  { path: '/', icon: Home, label: 'Inicio' },
  { path: '/calculator', icon: Calculator, label: 'Calcular' },
  { path: '/history', icon: History, label: 'Historial' },
  { path: '/finances', icon: Wallet, label: 'Mi Dinero' },
  { path: '/settings', icon: Settings, label: 'Configuración' },
];

const sidebarLockedItems = [
  { icon: FileText, label: 'Cotización (PDF)' },
  { icon: DollarSign, label: 'Gastos del Mes' },
  { icon: ShoppingBag, label: 'Materiales' },
  { icon: Calendar, label: 'Pedido y Agenda' },
  { icon: BarChart3, label: 'Gana Más' },
];

export function Navigation() {
  const location = useLocation();
  const { user, profile, isAdmin } = useAuth();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (location.pathname === '/auth') {
    return null;
  }

  const isFinancesActive = location.pathname === '/finances';

  return (
    <>
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="container flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center focus:outline-none">
                  <Menu className="w-4 h-4 text-primary-foreground" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0 border-r border-border bg-card">
                {/* Sidebar Header */}
                <div className="px-6 py-5 border-b border-border">
                  <h2 className="font-display text-xl font-bold text-gradient">DecoControl</h2>
                </div>

                {/* Active Items */}
                <nav className="flex flex-col py-2">
                  {sidebarActiveItems.map(({ path, icon: Icon, label }) => {
                    const isActive = location.pathname === path;
                    return (
                      <Link
                        key={path}
                        to={path}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-4 px-6 py-3.5 text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-rose-light text-primary"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{label}</span>
                        {isActive && <span className="ml-auto text-primary">›</span>}
                      </Link>
                    );
                  })}
                </nav>

                {/* Divider */}
                <div className="mx-6 border-t border-border" />

                {/* Locked Items */}
                <nav className="flex flex-col py-2">
                  {sidebarLockedItems.map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-4 px-6 py-3.5 text-sm font-medium text-muted-foreground opacity-50 cursor-not-allowed"
                    >
                      <Icon className="w-5 h-5" />
                      <span>{label}</span>
                      <Lock className="w-3.5 h-3.5 ml-auto" />
                    </div>
                  ))}
                </nav>

                {/* Bottom: Config */}
                {isAdmin && (
                  <>
                    <div className="mx-6 border-t border-border" />
                    <nav className="flex flex-col py-2">
                      <Link
                        to="/admin/database"
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-4 px-6 py-3.5 text-sm font-medium transition-all duration-200",
                          location.pathname === '/admin/database'
                            ? "bg-rose-light text-primary"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        <Database className="w-5 h-5" />
                        <span>Database</span>
                      </Link>
                    </nav>
                  </>
                )}
              </SheetContent>
            </Sheet>
            <span className="font-display text-lg font-semibold text-foreground">
              {location.pathname === '/' && 'Inicio'}
              {location.pathname === '/calculator' && 'Cotizar'}
              {location.pathname === '/finances' && 'Finanzas'}
              {location.pathname === '/history' && 'Historial'}
              {location.pathname === '/settings' && 'Ajustes'}
              {location.pathname === '/admin/database' && 'Database'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/finances"
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300",
                isFinancesActive
                  ? "text-primary bg-rose-light"
                  : "text-muted-foreground hover:text-primary hover:bg-rose-light/50"
              )}
            >
              <Wallet className="w-5 h-5" />
              <span className="text-sm font-medium">Finanzas</span>
            </Link>
            <Link
              to="/design"
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300",
                location.pathname === '/design'
                  ? "text-primary bg-rose-light"
                  : "text-muted-foreground hover:text-primary hover:bg-rose-light/50"
              )}
            >
              <Palette className="w-5 h-5" />
              <span className="text-sm font-medium">Diseño</span>
            </Link>
            {isAdmin && (
              <Link
                to="/admin/database"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300",
                  location.pathname === '/admin/database'
                    ? "text-primary bg-rose-light"
                    : "text-muted-foreground hover:text-primary hover:bg-rose-light/50"
                )}
              >
                <Database className="w-5 h-5" />
                <span className="text-sm font-medium">Database</span>
              </Link>
            )}
            {!isMobile && (
              <>
                {user ? (
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-light hover:bg-rose-light/80 transition-colors"
                  >
                    <User className="w-4 h-4 text-rose-dark" />
                    <span className="text-xs font-medium text-rose-dark max-w-[120px] truncate">
                      {profile?.name || user.email?.split('@')[0]}
                    </span>
                  </Link>
                ) : (
                  <Link
                    to="/auth"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-xs font-medium">Entrar</span>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border shadow-elevated">
        <div className="container flex items-center justify-center h-16 md:h-18">
          <div className="flex md:hidden items-center justify-around w-full">
            {mobileNavItems.map(({ path, icon: Icon, label }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={cn(
                    "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300",
                    isActive
                      ? "text-primary bg-rose-light"
                      : "text-muted-foreground hover:text-primary hover:bg-rose-light/50"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{label}</span>
                </Link>
              );
            })}
          </div>
          <div className="hidden md:flex items-center justify-center gap-8">
            {desktopNavItems.map(({ path, icon: Icon, label }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={cn(
                    "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300",
                    isActive
                      ? "text-primary bg-rose-light"
                      : "text-muted-foreground hover:text-primary hover:bg-rose-light/50"
                  )}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
