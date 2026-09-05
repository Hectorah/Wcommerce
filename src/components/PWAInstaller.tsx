import React, { useEffect, useState } from 'react';
import { Download, X, Check, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  // Detectar si es iOS y si ya está instalada como PWA
  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);
    
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                            (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);
    
    // Mostrar banner si no está instalada y es móvil
    if (!isStandaloneMode && (isIOSDevice || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
      setTimeout(() => {
        setShowBanner(true);
      }, 3000);
    }
  }, []);

  // Manejar evento beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Verificar si ya está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
      setShowBanner(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Instalar PWA
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('Usuario aceptó la instalación');
      setShowBanner(false);
      setIsInstallable(false);
    } else {
      console.log('Usuario rechazó la instalación');
    }
    
    setDeferredPrompt(null);
  };

  // Instrucciones para iOS
  const renderIOSInstructions = () => (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3">
      <p className="text-sm text-blue-800 font-medium mb-2">📱 Para instalar en iPhone/iPad:</p>
      <ol className="text-xs text-blue-700 list-decimal list-inside space-y-1">
        <li>Toca el botón <strong>Compartir</strong> <span className="text-blue-900">⎋</span></li>
        <li>Desplázate y selecciona <strong>"Agregar a pantalla de inicio"</strong></li>
        <li>Toca <strong>"Agregar"</strong> en la esquina superior derecha</li>
      </ol>
    </div>
  );

  // Si ya está instalado o no mostrar banner, no renderizar nada
  if (isStandalone || !showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-50 animate-fade-in-up">
      <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-primary/20 text-brand-primary rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Instalar Wcommerce App</h3>
              <p className="text-xs text-slate-500">Acceso rápido desde tu pantalla de inicio</p>
            </div>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isIOS ? (
          <>
            <button
              onClick={() => window.open('/', '_blank')}
              className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary text-white py-2.5 px-4 rounded-lg font-bold text-sm transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              Abrir en Safari para instalar
            </button>
            {renderIOSInstructions()}
          </>
        ) : isInstallable ? (
          <button
            onClick={handleInstallClick}
            className="w-full flex items-center justify-center gap-2 bg-brand-success hover:bg-brand-success text-white py-2.5 px-4 rounded-lg font-bold text-sm transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Instalar App
          </button>
        ) : (
          <div className="text-center">
            <p className="text-sm text-slate-600 mb-3">
              Usa el menú de tu navegador para instalar esta app
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <Check className="w-3 h-3 text-green-500" />
              <span>Funciona sin internet</span>
              <span className="text-slate-300">•</span>
              <span>Notificaciones push</span>
              <span className="text-slate-300">•</span>
              <span>Pantalla completa</span>
            </div>
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>App PWA • Sin descarga de tienda</span>
            <button
              onClick={() => setShowBanner(false)}
              className="text-slate-400 hover:text-slate-600 underline"
            >
              Más tarde
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}