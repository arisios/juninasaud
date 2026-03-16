import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface AuditItem {
  id: string;
  boothId: string;
  boothName: string;
  exhibitor: string;
  priority: 'normal' | 'urgent';
  createdAt: string;
}

const mockAudits: AuditItem[] = [
  {
    id: '1',
    boothId: 'BOOTH-001',
    boothName: 'Barraca A',
    exhibitor: 'Expositor 1',
    priority: 'urgent',
    createdAt: '2026-03-11T18:00:00Z',
  },
  {
    id: '2',
    boothId: 'BOOTH-002',
    boothName: 'Barraca B',
    exhibitor: 'Expositor 2',
    priority: 'normal',
    createdAt: '2026-03-11T17:30:00Z',
  },
  {
    id: '3',
    boothId: 'BOOTH-003',
    boothName: 'Barraca C',
    exhibitor: 'Expositor 3',
    priority: 'normal',
    createdAt: '2026-03-11T17:00:00Z',
  },
];

export default function AuditorQueue() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'auditor') {
      setLocation('/');
    }
  }, [isAuthenticated, user, setLocation]);

  if (!user) {
    return null;
  }

  const urgentCount = mockAudits.filter((a) => a.priority === 'urgent').length;

  return (
    <Layout>
      <div className="space-y-6 p-4 md:p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fila de Auditorias</h1>
          <p className="text-muted-foreground">
            {mockAudits.length} auditorias aguardando ({urgentCount} urgentes)
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total na Fila</p>
                <p className="text-2xl font-bold text-foreground">{mockAudits.length}</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </Card>
          <Card className="border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Urgentes</p>
                <p className="text-2xl font-bold text-destructive">{urgentCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </Card>
          <Card className="border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Concluídas Hoje</p>
                <p className="text-2xl font-bold text-success">12</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </Card>
        </div>

        {/* Audits List */}
        <div className="space-y-3">
          {mockAudits.map((audit) => (
            <Card
              key={audit.id}
              className="border-border p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setLocation(`/auditor/audit/${audit.id}`)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-foreground">{audit.boothName}</h3>
                    {audit.priority === 'urgent' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-1 text-xs font-semibold text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        Urgente
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {audit.exhibitor} • {audit.boothId}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Criado em {new Date(audit.createdAt).toLocaleTimeString('pt-BR')}
                  </p>
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                  Iniciar Auditoria
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
