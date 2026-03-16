import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { Truck, MapPin, Package, Clock } from 'lucide-react';

interface Delivery {
  id: string;
  boothId: string;
  boothName: string;
  location: string;
  items: number;
  createdAt: string;
  distance?: string;
}

const mockDeliveries: Delivery[] = [
  {
    id: '1',
    boothId: 'BOOTH-001',
    boothName: 'Barraca A',
    location: 'Pavilhão A, Setor 1',
    items: 5,
    createdAt: '2026-03-11T18:00:00Z',
    distance: '150m',
  },
  {
    id: '2',
    boothId: 'BOOTH-002',
    boothName: 'Barraca B',
    location: 'Pavilhão B, Setor 2',
    items: 3,
    createdAt: '2026-03-11T17:30:00Z',
    distance: '320m',
  },
  {
    id: '3',
    boothId: 'BOOTH-003',
    boothName: 'Barraca C',
    location: 'Pavilhão A, Setor 3',
    items: 8,
    createdAt: '2026-03-11T17:00:00Z',
    distance: '280m',
  },
  {
    id: '4',
    boothId: 'BOOTH-004',
    boothName: 'Barraca D',
    location: 'Pavilhão C, Setor 1',
    items: 2,
    createdAt: '2026-03-11T16:30:00Z',
    distance: '450m',
  },
];

export default function DeliveryAvailable() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'delivery_person') {
      setLocation('/');
    }
  }, [isAuthenticated, user, setLocation]);

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6 p-4 md:p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Entregas Disponíveis
          </h1>
          <p className="text-muted-foreground">
            {mockDeliveries.length} entregas aguardando
          </p>
        </div>

        {/* Stats */}
        <Card className="border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Entregas Disponíveis</p>
              <p className="text-2xl font-bold text-foreground">
                {mockDeliveries.length}
              </p>
            </div>
            <Truck className="h-8 w-8 text-primary" />
          </div>
        </Card>

        {/* Deliveries List */}
        <div className="space-y-3">
          {mockDeliveries.map((delivery) => (
            <Card
              key={delivery.id}
              className="border-border p-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground text-lg">
                      {delivery.boothName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {delivery.boothId}
                    </p>
                  </div>
                  <Button
                    className="bg-primary hover:bg-primary/90 gap-2"
                    onClick={() =>
                      setLocation(`/delivery/${delivery.id}/accept`)
                    }
                  >
                    <Truck className="h-4 w-4" />
                    Aceitar
                  </Button>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {delivery.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {delivery.items} itens
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {new Date(delivery.createdAt).toLocaleTimeString('pt-BR')}
                    </span>
                  </div>
                  {delivery.distance && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="rounded-full bg-secondary px-2 py-1 text-xs font-semibold text-foreground">
                        {delivery.distance}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
