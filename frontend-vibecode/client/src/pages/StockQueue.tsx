import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { Clock, AlertCircle, CheckCircle, Package } from 'lucide-react';

interface StockRequest {
  id: string;
  boothId: string;
  boothName: string;
  items: number;
  priority: 'normal' | 'urgent';
  createdAt: string;
  status: 'pending' | 'preparing' | 'ready';
}

const mockRequests: StockRequest[] = [
  {
    id: '1',
    boothId: 'BOOTH-001',
    boothName: 'Barraca A',
    items: 5,
    priority: 'urgent',
    createdAt: '2026-03-11T18:00:00Z',
    status: 'pending',
  },
  {
    id: '2',
    boothId: 'BOOTH-002',
    boothName: 'Barraca B',
    items: 3,
    priority: 'normal',
    createdAt: '2026-03-11T17:30:00Z',
    status: 'preparing',
  },
  {
    id: '3',
    boothId: 'BOOTH-003',
    boothName: 'Barraca C',
    items: 8,
    priority: 'normal',
    createdAt: '2026-03-11T17:00:00Z',
    status: 'ready',
  },
];

const statusInfo = {
  pending: { icon: Clock, color: 'text-warning', label: 'Pendente' },
  preparing: { icon: Package, color: 'text-accent', label: 'Preparando' },
  ready: { icon: CheckCircle, color: 'text-success', label: 'Pronto' },
};

export default function StockQueue() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'stock_operator') {
      setLocation('/');
    }
  }, [isAuthenticated, user, setLocation]);

  if (!user) {
    return null;
  }

  const pendingCount = mockRequests.filter((r) => r.status === 'pending').length;
  const readyCount = mockRequests.filter((r) => r.status === 'ready').length;

  return (
    <Layout>
      <div className="space-y-6 p-4 md:p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fila de Pedidos</h1>
          <p className="text-muted-foreground">
            {mockRequests.length} pedidos ({pendingCount} pendentes)
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold text-warning">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </Card>
          <Card className="border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Preparando</p>
                <p className="text-2xl font-bold text-accent">
                  {mockRequests.filter((r) => r.status === 'preparing').length}
                </p>
              </div>
              <Package className="h-8 w-8 text-accent" />
            </div>
          </Card>
          <Card className="border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Prontos</p>
                <p className="text-2xl font-bold text-success">{readyCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </Card>
        </div>

        {/* Requests List */}
        <div className="space-y-3">
          {mockRequests.map((request) => {
            const status = statusInfo[request.status];
            const StatusIcon = status.icon;
            return (
              <Card
                key={request.id}
                className="border-border p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-foreground">
                        {request.boothName}
                      </h3>
                      {request.priority === 'urgent' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-1 text-xs font-semibold text-destructive">
                          <AlertCircle className="h-3 w-3" />
                          Urgente
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{request.boothId}</span>
                      <span>•</span>
                      <span>{request.items} itens</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <StatusIcon className={`h-4 w-4 ${status.color}`} />
                      <span className={`font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={() =>
                      setLocation(`/stock/request/${request.id}`)
                    }
                  >
                    {request.status === 'pending' ? 'Preparar' : 'Visualizar'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
