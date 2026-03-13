import { useState } from "react";
import {
  Calculator, History, Settings, FileText, ShoppingBag,
  DollarSign, CalendarDays, BarChart3, TrendingUp, Lock,
  Home, Database
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const activeItemsBefore = [
  { title: "Inicio", url: "/", icon: Home },
  { title: "Calculadora", url: "/calculator", icon: Calculator },
  { title: "Historial", url: "/history", icon: History },
];

const lockedItems = [
  { title: "Cotización PDF", icon: FileText },
  { title: "Pedidos de clientes", icon: ShoppingBag },
  { title: "Anticipos", icon: DollarSign },
  { title: "Agenda de eventos", icon: CalendarDays },
  { title: "Ingresos y gastos", icon: BarChart3 },
  { title: "Resumen del mes", icon: TrendingUp },
];

const activeItemsAfter = [
  { title: "Configuración", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state, setOpenMobile, isMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const { isAdmin } = useAuth();
  const [showPromo, setShowPromo] = useState(false);

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleLockedClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
    setShowPromo(true);
  };

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarContent className="bg-card pt-2">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {activeItemsBefore.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/"}
                        className="hover:bg-rose-light/50 rounded-lg px-3 py-2.5"
                        activeClassName="bg-rose-light text-primary font-semibold"
                        onClick={handleNavClick}
                      >
                        <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                        {!collapsed && <span className="text-sm">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                {lockedItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      className="px-3 py-2.5 cursor-pointer hover:bg-rose-light/50"
                      onClick={handleLockedClick}
                    >
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <span className="text-sm">{item.title}</span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                {activeItemsAfter.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/"}
                        className="hover:bg-rose-light/50 rounded-lg px-3 py-2.5"
                        activeClassName="bg-rose-light text-primary font-semibold"
                        onClick={handleNavClick}
                      >
                        <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                        {!collapsed && <span className="text-sm">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                {isAdmin && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to="/admin/database"
                        className="hover:bg-rose-light/50 rounded-lg px-3 py-2.5"
                        activeClassName="bg-rose-light text-primary font-semibold"
                        onClick={handleNavClick}
                      >
                        <Database className="mr-3 h-5 w-5 flex-shrink-0" />
                        {!collapsed && <span className="text-sm">Database</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <Dialog open={showPromo} onOpenChange={setShowPromo}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              🔒 Función Premium
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-base font-semibold text-foreground">
              Esta función forma parte del sistema DecoControl.
            </p>
            <p className="text-sm text-muted-foreground">
              La herramienta que te ayuda a organizar y controlar tu negocio de decoraciones.
            </p>
            <Button
              className="w-full mt-4 text-base font-semibold"
              size="lg"
              onClick={() => {
                window.open("https://calcu-docora.lovable.app", "_blank");
                setShowPromo(false);
              }}
            >
              Quiero DecoControl
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
