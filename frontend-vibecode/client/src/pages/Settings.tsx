import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Layout from '@/components/Layout';
import { Bell, Lock, User } from 'lucide-react';

export default function Settings() {
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

  return (
    <Layout>
      <div className="space-y-6 p-4 md:p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">Gerencie suas preferências e conta</p>
        </div>

        {/* Profile Section */}
        <Card className="border-border p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-lg font-bold text-foreground mb-4">
                  Informações da Conta
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nome
                  </label>
                  <Input
                    type="text"
                    value={user.name}
                    disabled
                    className="bg-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={user.email}
                    disabled
                    className="bg-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Papel
                  </label>
                  <Input
                    type="text"
                    value={user.role.replace(/_/g, ' ')}
                    disabled
                    className="bg-secondary capitalize"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Notifications Section */}
        <Card className="border-border p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-accent/10 p-3">
              <Bell className="h-6 w-6 text-accent" />
            </div>
            <div className="flex-1 space-y-4">
              <h2 className="text-lg font-bold text-foreground">
                Notificações
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-border"
                  />
                  <span className="text-sm text-foreground">
                    Notificações por email
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-border"
                  />
                  <span className="text-sm text-foreground">
                    Alertas de auditoria urgente
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-border"
                  />
                  <span className="text-sm text-foreground">
                    Atualizações de pedidos
                  </span>
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* Security Section */}
        <Card className="border-border p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-warning/10 p-3">
              <Lock className="h-6 w-6 text-warning" />
            </div>
            <div className="flex-1 space-y-4">
              <h2 className="text-lg font-bold text-foreground">
                Segurança
              </h2>
              <Button variant="outline" className="w-full md:w-auto">
                Alterar Senha
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
