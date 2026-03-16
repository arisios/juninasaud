import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { QrCode, LogIn, Smartphone } from 'lucide-react';
import { useEffect } from 'react';

export default function Home() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  // Redirecionar se já autenticado
  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/dashboard');
    }
  }, [isAuthenticated, setLocation]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="w-full max-w-2xl space-y-12">
        {/* Header */}
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="rounded-2xl bg-primary/10 p-6">
              <Smartphone className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground md:text-5xl">
            Event Booth System
          </h1>
          <p className="text-lg text-muted-foreground">
            Sistema operacional para gestão de eventos presenciais
          </p>
        </div>

        {/* Main Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Scan Card */}
          <Card className="border-border p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setLocation('/booth-entry')}>
            <div className="space-y-4">
              <div className="rounded-lg bg-primary/10 p-3 w-fit">
                <QrCode className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Escanear Barraca
                </h2>
                <p className="text-sm text-muted-foreground">
                  Escaneie o QR code ou tag NFC de uma barraca para acessar
                </p>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 gap-2">
                <QrCode className="h-4 w-4" />
                Iniciar Escaneamento
              </Button>
            </div>
          </Card>

          {/* Login Card */}
          <Card className="border-border p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setLocation('/login')}>
            <div className="space-y-4">
              <div className="rounded-lg bg-accent/10 p-3 w-fit">
                <LogIn className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Fazer Login
                </h2>
                <p className="text-sm text-muted-foreground">
                  Acesse com suas credenciais de produtor ou gerenciador
                </p>
              </div>
              <Button variant="outline" className="w-full gap-2">
                <LogIn className="h-4 w-4" />
                Entrar com Email
              </Button>
            </div>
          </Card>
        </div>

        {/* Features */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-secondary/50 p-4 text-center">
            <h3 className="font-semibold text-foreground mb-1">5 Papéis</h3>
            <p className="text-xs text-muted-foreground">
              Produtor, Auditor, Responsável, Operador, Entregador
            </p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-4 text-center">
            <h3 className="font-semibold text-foreground mb-1">Mobile-First</h3>
            <p className="text-xs text-muted-foreground">
              Otimizado para operações em campo
            </p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-4 text-center">
            <h3 className="font-semibold text-foreground mb-1">Escalável</h3>
            <p className="text-xs text-muted-foreground">
              Funciona para qualquer volume de dados
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p>© 2026 Event Booth System. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}
