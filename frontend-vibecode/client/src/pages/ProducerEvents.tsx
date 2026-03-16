import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { Plus, Calendar, Users, Box } from 'lucide-react';

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  exhibitors: number;
  booths: number;
  status: 'active' | 'planning' | 'finished';
}

const mockEvents: Event[] = [
  {
    id: '1',
    name: 'TechExpo 2026',
    date: '2026-04-15',
    location: 'São Paulo, SP',
    exhibitors: 24,
    booths: 48,
    status: 'active',
  },
  {
    id: '2',
    name: 'StartupFest',
    date: '2026-05-20',
    location: 'Rio de Janeiro, RJ',
    exhibitors: 18,
    booths: 36,
    status: 'planning',
  },
  {
    id: '3',
    name: 'FoodTech Summit',
    date: '2026-03-01',
    location: 'Belo Horizonte, MG',
    exhibitors: 12,
    booths: 24,
    status: 'finished',
  },
];

const statusColors = {
  active: { bg: 'bg-success/10', text: 'text-success', label: 'Ativo' },
  planning: { bg: 'bg-warning/10', text: 'text-warning', label: 'Planejamento' },
  finished: { bg: 'bg-muted', text: 'text-muted-foreground', label: 'Finalizado' },
};

export default function ProducerEvents() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'producer') {
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Eventos</h1>
            <p className="text-muted-foreground">
              Gerencie seus eventos e expositores
            </p>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Novo Evento</span>
          </Button>
        </div>

        {/* Events Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockEvents.map((event) => {
            const status = statusColors[event.status];
            return (
              <Card
                key={event.id}
                className="border-border p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setLocation(`/producer/events/${event.id}`)}
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground text-lg mb-1">
                        {event.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {event.location}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${status.bg} ${status.text}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(event.date).toLocaleDateString('pt-BR')}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-secondary/50 p-3">
                      <p className="text-xs text-muted-foreground mb-1">
                        Expositores
                      </p>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="font-bold text-foreground">
                          {event.exhibitors}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-3">
                      <p className="text-xs text-muted-foreground mb-1">
                        Barracas
                      </p>
                      <div className="flex items-center gap-1">
                        <Box className="h-4 w-4 text-accent" />
                        <span className="font-bold text-foreground">
                          {event.booths}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation(`/producer/events/${event.id}`);
                    }}
                  >
                    Visualizar Detalhes
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
