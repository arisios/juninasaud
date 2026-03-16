import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AlertCircle, QrCode, Smartphone } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function BoothEntry() {
  const [, setLocation] = useLocation();
  const [boothId, setBoothId] = useState('');
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleScanClick = () => {
    // TODO: Integrar com câmera para QR/NFC
    setIsScanning(!isScanning);
  };

  const handleManualEntry = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!boothId.trim()) {
      setError('Por favor, insira o ID da barraca');
      return;
    }

    // Redirecionar para login da barraca
    setLocation(`/booth/${boothId}/login`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="space-y-3 text-center">
          <div className="flex justify-center">
            <div className="rounded-2xl bg-primary/10 p-4">
              <Smartphone className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Event Booth System
          </h1>
          <p className="text-muted-foreground">
            Escaneie a tag NFC ou QR code de uma barraca para começar
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Card */}
        <Card className="space-y-6 border-border p-6">
          {/* Scan Button */}
          <Button
            onClick={handleScanClick}
            size="lg"
            className="w-full gap-2 bg-primary hover:bg-primary/90"
            disabled={isScanning}
          >
            <QrCode className="h-5 w-5" />
            {isScanning ? 'Aguardando leitura...' : 'Escanear QR/NFC'}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-card px-2 text-muted-foreground">ou</span>
            </div>
          </div>

          {/* Manual Entry Form */}
          <form onSubmit={handleManualEntry} className="space-y-4">
            <div>
              <label htmlFor="boothId" className="block text-sm font-medium text-foreground mb-2">
                ID da Barraca
              </label>
              <Input
                id="boothId"
                type="text"
                placeholder="Ex: BOOTH-001"
                value={boothId}
                onChange={(e) => setBoothId(e.target.value)}
                className="h-12 text-base"
                autoFocus
              />
            </div>
            <Button
              type="submit"
              size="lg"
              variant="outline"
              className="w-full"
            >
              Continuar
            </Button>
          </form>
        </Card>

        {/* Info Box */}
        <div className="rounded-lg bg-secondary/50 p-4 text-center text-sm text-muted-foreground">
          <p>
            Você será redirecionado para fazer login após escanear ou inserir o ID
          </p>
        </div>
      </div>
    </div>
  );
}
