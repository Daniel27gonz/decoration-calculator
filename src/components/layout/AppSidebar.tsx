import {
  Calculator, History, Settings, FileText, ShoppingBag,
  DollarSign, CalendarDays, BarChart3, TrendingUp, Lock,
  Home, Wallet, Palette, Database
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const activeItemsBefore = [
  { title: "Inicio", url: "/", icon: Home },
  { title: "Calculadora", url: "/calculator", icon: Calculator },
  { title: "Historial", url: "/history", icon: History },
  { title: "Cotización PDF", url: "/design", icon: FileText },
];

const lockedItems = [
  { title: "Pedidos de clientes", icon: ShoppingBag, description: "Pedidos de decoraciones" },
  { title: "Anticipos", icon: DollarSign, description: "Anticipos de clientes" },
  { title: "Agenda de eventos", icon: CalendarDays, description: "Agenda de decoraciones" },
  { title: "Ingresos y gastos", icon: BarChart3, description: "Control de ingresos y gastos" },
  { title: "Resumen del mes", icon: TrendingUp, description: "Resumen del negocio" },
];

const activeItemsAfter = [
  { title: "Configuración", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state, setOpenMobile, isMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { isAdmin } = useAuth();

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-card pt-2">
        {/* Active navigation */}
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
                  <SidebarMenuButton className="px-3 py-2.5 pointer-events-none">
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span className="text-sm">{item.title}</span>}
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
  );
}