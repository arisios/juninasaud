import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import {
  BarChart3,
  Box,
  Truck,
  Users,
  Settings,
  Home,
  CheckSquare,
  Camera,
  Package,
  ShoppingCart,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  // Comum a todos
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <Home className="h-5 w-5" />,
    roles: ['producer', 'auditor', 'booth_manager', 'stock_operator', 'delivery_person'],
  },

  // Produtor
  {
    label: 'Eventos',
    href: '/producer/events',
    icon: <BarChart3 className="h-5 w-5" />,
    roles: ['producer'],
  },
  {
    label: 'Expositores',
    href: '/producer/exhibitors',
    icon: <Users className="h-5 w-5" />,
    roles: ['producer'],
  },
  {
    label: 'Barracas',
    href: '/producer/booths',
    icon: <Box className="h-5 w-5" />,
    roles: ['producer'],
  },
  {
    label: 'Auditorias',
    href: '/producer/audits',
    icon: <CheckSquare className="h-5 w-5" />,
    roles: ['producer'],
  },
  {
    label: 'Pedidos de Estoque',
    href: '/producer/stock-requests',
    icon: <ShoppingCart className="h-5 w-5" />,
    roles: ['producer'],
  },

  // Auditor
  {
    label: 'Fila de Auditorias',
    href: '/auditor/queue',
    icon: <CheckSquare className="h-5 w-5" />,
    roles: ['auditor'],
  },
  {
    label: 'Minhas Auditorias',
    href: '/auditor/sessions',
    icon: <Camera className="h-5 w-5" />,
    roles: ['auditor'],
  },

  // Responsável da Barraca
  {
    label: 'Minha Barraca',
    href: '/booth/dashboard',
    icon: <Box className="h-5 w-5" />,
    roles: ['booth_manager'],
  },
  {
    label: 'Pedidos de Estoque',
    href: '/booth/stock-requests',
    icon: <ShoppingCart className="h-5 w-5" />,
    roles: ['booth_manager'],
  },

  // Operador de Estoque
  {
    label: 'Fila de Pedidos',
    href: '/stock/queue',
    icon: <Package className="h-5 w-5" />,
    roles: ['stock_operator'],
  },
  {
    label: 'Meus Pedidos',
    href: '/stock/my-orders',
    icon: <CheckSquare className="h-5 w-5" />,
    roles: ['stock_operator'],
  },

  // Entregador
  {
    label: 'Entregas Disponíveis',
    href: '/delivery/available',
    icon: <Truck className="h-5 w-5" />,
    roles: ['delivery_person'],
  },
  {
    label: 'Minhas Entregas',
    href: '/delivery/my-deliveries',
    icon: <CheckSquare className="h-5 w-5" />,
    roles: ['delivery_person'],
  },

  // Comum
  {
    label: 'Configurações',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />,
    roles: ['producer', 'auditor', 'booth_manager', 'stock_operator', 'delivery_person'],
  },
];

interface SidebarProps {
  onClose?: () => void;
  variant?: 'desktop' | 'mobile';
}

export default function Sidebar({ onClose, variant = 'desktop' }: SidebarProps) {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();

  if (!user) return null;

  const filteredItems = navItems.filter((item) => item.roles.includes(user.role));

  const handleNavigation = (href: string) => {
    setLocation(href);
    onClose?.();
  };

  if (variant === 'mobile') {
    return (
      <div className="flex h-20 items-center justify-around overflow-x-auto px-2">
        {filteredItems.slice(0, 5).map((item) => (
          <button
            key={item.href}
            onClick={() => handleNavigation(item.href)}
            className={cn(
              'flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
              location === item.href
                ? 'bg-primary text-white'
                : 'text-muted-foreground hover:bg-secondary'
            )}
            title={item.label}
          >
            {item.icon}
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Logo */}
      <div className="border-b border-sidebar-border px-6 py-4">
        <h2 className="text-xl font-bold text-sidebar-foreground">
          Event Booth
        </h2>
        <p className="text-xs text-muted-foreground">Gestão de Eventos</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {filteredItems.map((item) => (
          <button
            key={item.href}
            onClick={() => handleNavigation(item.href)}
            className={cn(
              'w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
              location === item.href
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent'
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Info */}
      <div className="border-t border-sidebar-border px-4 py-4">
        <div className="rounded-lg bg-sidebar-accent p-3">
          <p className="text-xs font-semibold text-sidebar-foreground">
            {user.name}
          </p>
          <p className="text-xs text-muted-foreground capitalize">
            {user.role.replace(/_/g, ' ')}
          </p>
        </div>
      </div>
    </div>
  );
}
