import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { BarChart3, Users, Box, CheckSquare, Truck } from 'lucide-react';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/');
    }
  }, [isAuthenticated, setLocation]);

  if (!user) {
    return null;
  }

  const dashboardContent = {
    producer: {
      title: 'Dashboard do Produtor',
      description: 'Gerencie seus eventos, expositores e barracas',
      stats: [
        { label: 'Eventos Ativos', value: '3', icon: BarChart3 },
        { label: 'Expositores', value: '24', icon: Users },
        { label: 'Barracas', value: '48', icon: Box },
        { label: 'Auditorias Pendentes', value: '7', icon: CheckSquare },
      ],
      actions: [
        { label: 'Novo Evento', href: '/producer/events/new' },
        { label: 'Visualizar Auditorias', href: '/producer/audits' },
        { label: 'Pedidos de Estoque', href: '/producer/stock-requests' },
      ],
    },
    auditor: {
      title: 'Dashboard do Auditor',
      description: 'Gerencie suas auditorias e registros financeiros',
      stats: [
        { label: 'Auditorias Pendentes', value: '5', icon: CheckSquare },
        { label: 'Concluídas Hoje', value: '12', icon: BarChart3 },
        { label: 'Fotos Registradas', value: '48', icon: Box },
        { label: 'Dinheiro Retirado', value: 'R$ 2.450', icon: Users },
      ],
      actions: [
        { label: 'Ver Fila', href: '/auditor/queue' },
        { label: 'Minhas Auditorias', href: '/auditor/sessions' },
      ],
    },
    booth_manager: {
      title: 'Dashboard da Barraca',
      description: 'Gerencie sua barraca e pedidos de estoque',
      stats: [
        { label: 'Pedidos Pendentes', value: '3', icon: Box },
        { label: 'Entregas Aguardadas', value: '2', icon: Truck },
        { label: 'Estoque Atual', value: '156', icon: BarChart3 },
      ],
      actions: [
        { label: 'Novo Pedido', href: '/booth/stock-requests/new' },
        { label: 'Acompanhar Pedidos', href: '/booth/stock-requests' },
      ],
    },
    stock_operator: {
      title: 'Dashboard do Operador de Estoque',
      description: 'Gerencie pedidos e preparação de entregas',
      stats: [
        { label: 'Pedidos na Fila', value: '8', icon: Box },
        { label: 'Em Preparação', value: '3', icon: BarChart3 },
        { label: 'Prontos para Entrega', value: '5', icon: Truck },
      ],
      actions: [
        { label: 'Ver Fila', href: '/stock/queue' },
        { label: 'Meus Pedidos', href: '/stock/my-orders' },
      ],
    },
    delivery_person: {
      title: 'Dashboard do Entregador',
      description: 'Gerencie suas entregas',
      stats: [
        { label: 'Entregas Disponíveis', value: '4', icon: Truck },
        { label: 'Em Andamento', value: '2', icon: BarChart3 },
        { label: 'Concluídas Hoje', value: '9', icon: CheckSquare },
      ],
      actions: [
        { label: 'Entregas Disponíveis', href: '/delivery/available' },
        { label: 'Minhas Entregas', href: '/delivery/my-deliveries' },
      ],
    },
  };

  const content = dashboardContent[user.role];

  return (
    <Layout>
      <div className="space-y-6 p-4 md:p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">{content.title}</h1>
          <p className="text-muted-foreground">{content.description}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {content.stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="border-border p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="mt-2 text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="border-border p-6">
          <h2 className="mb-4 text-lg font-bold text-foreground">
            Ações Rápidas
          </h2>
          <div className="flex flex-wrap gap-3">
            {content.actions.map((action) => (
              <Button
                key={action.href}
                onClick={() => setLocation(action.href)}
                className="bg-primary hover:bg-primary/90"
              >
                {action.label}
              </Button>
            ))}
          </div>
        </Card>

        {/* Placeholder Content */}
        <Card className="border-border p-6">
          <h2 className="mb-4 text-lg font-bold text-foreground">
            Atividade Recente
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
              <div>
                <p className="font-medium text-foreground">Auditoria concluída</p>
                <p className="text-xs text-muted-foreground">Há 2 horas</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-success" />
            </div>
            <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
              <div>
                <p className="font-medium text-foreground">Pedido preparado</p>
                <p className="text-xs text-muted-foreground">Há 1 hora</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-success" />
            </div>
            <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
              <div>
                <p className="font-medium text-foreground">Entrega registrada</p>
                <p className="text-xs text-muted-foreground">Há 30 minutos</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-success" />
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
