import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { JerseyProduct, SiteSettings } from './types';
import { StoreFront } from './StoreFront';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLogin } from './components/admin/AdminLogin';
import { PWAInstaller } from './components/PWAInstaller';
import { ErrorBoundary } from './components/ErrorBoundary';
import { BcvRateProvider } from './hooks/BcvRateContext';
import { DeliveryProvider } from './hooks/DeliveryContext';

const DEFAULT_SETTINGS: SiteSettings = {
  heroVideoUrl: '',
  whatsappNumbers: [],
  storeName: 'Flash Sport Shop',
  storeTagline: 'Camisetas de Fútbol',
  heroTitleLine1: 'Catálogo Oficial',
  heroTitleLine2: 'Portal de Compras',
  heroSubtitle: 'Selecciona tus modelos favoritos, calcula tu tarifa al detal o mayorista en tiempo real y envía tu pedido directo a WhatsApp.',
  announcementEnabled: false,
  announcementText: 'Descuento Mayorista: camisetas a $18 USD c/u',
  announcementLink: '',
  whatsappChannelUrl: 'https://whatsapp.com/channel/0029Vb7RtomDZ4LQyRTqzJ1J',
  instagramUrl: '',
  tiktokUrl: '',
  facebookUrl: '',
  brandPrimaryColor: '#2563EB',
  brandSuccessColor: '#10B981',
  stores: [
    {
      id: 'cc-cristal',
      name: 'CC Cristal — Naguanagua',
      address: '2do Piso, CC Cristal, Naguanagua, Carabobo',
      mapsUrl: 'https://www.google.com/maps/search/CC+Cristal+Naguanagua+Carabobo+Venezuela',
      hours: 'Lun–Sáb: 9am – 7pm',
    },
  ],
  banners: [],
  infoGuideEnabled: true,
  infoGuideTitle: 'Guía Oficial de Tallas',
  infoGuideSubtitle: 'Medidas en centímetros (Aproximadas estándar)',
  infoGuideShowSizes: true,
  infoGuideItems: [
    {
      id: 'fan',
      title: 'Versión Fan',
      body: 'Corte clásico regular, tela cómoda para uso diario. Pide tu talla regular.',
    },
    {
      id: 'pro',
      title: 'Versión Jugador Pro',
      body: 'Corte atlético ceñido (Slim Fit). Si prefieres ajuste holgado, elige una talla superior.',
    },
  ],
};

// Completa settings viejos (localStorage/JSON) con los defaults actuales sin romper arrays
function normalizeSettings(raw: unknown): SiteSettings {
  const s = (raw && typeof raw === 'object' ? raw : {}) as Partial<SiteSettings>;
  return {
    ...DEFAULT_SETTINGS,
    ...s,
    whatsappNumbers: Array.isArray(s.whatsappNumbers) ? s.whatsappNumbers : [],
    stores: Array.isArray(s.stores) ? s.stores : DEFAULT_SETTINGS.stores,
    banners: Array.isArray(s.banners) ? s.banners : [],
    infoGuideItems: Array.isArray(s.infoGuideItems) ? s.infoGuideItems : DEFAULT_SETTINGS.infoGuideItems,
  };
}

export default function App() {
  const location = useLocation();
  const [activePreset, setActivePreset] = useState<string>(() => {
    try {
      return localStorage.getItem('wcommerce_active_preset') || 'data.json';
    } catch {
      return 'data.json';
    }
  });

  const [products, setProducts] = useState<JerseyProduct[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Ref que indica que estamos en medio de una carga de preset → NO guardar
  const isLoadingPreset = useRef(true);

  // Cargar datos cuando cambia el preset
  useEffect(() => {
    isLoadingPreset.current = true;
    setIsLoading(true);

    // Cargar directamente desde /data/ para Vercel
    fetch(`/data/${activePreset}`)
      .then(res => {
        if (!res.ok) {
          // Si el archivo no existe, crear uno vacío
          return { products: [], settings: DEFAULT_SETTINGS };
        }
        return res.json();
      })
      .then((data) => {
        // Base: contenido del archivo /data/<preset>.json
        const baseProducts = data?.products ?? [];
        const baseSettings = normalizeSettings(data?.settings);

        // Override: si el admin guardó cambios para este preset (localStorage),
        // se priorizan para que sobrevivan a la recarga del navegador.
        let finalProducts = baseProducts;
        let finalSettings = baseSettings;
        try {
          const savedProducts = localStorage.getItem(`wcommerce_${activePreset}_products`);
          const savedSettings = localStorage.getItem(`wcommerce_${activePreset}_settings`);
          if (savedProducts !== null) {
            const parsed = JSON.parse(savedProducts);
            if (Array.isArray(parsed)) finalProducts = parsed;
          }
          if (savedSettings !== null) {
            finalSettings = normalizeSettings(JSON.parse(savedSettings));
          }
        } catch {}

        setProducts(finalProducts);
        setSettings(finalSettings);
      })
      .catch(err => {
        console.error('Error cargando preset:', err);
        setProducts([]);
        setSettings(DEFAULT_SETTINGS);
      })
      .finally(() => {
        setIsLoading(false);
        // Dejamos un tick de React para que los estados se asienten antes de habilitar el guardado
        setTimeout(() => {
          isLoadingPreset.current = false;
        }, 100);
      });
  }, [activePreset]);

  // Guardar preset seleccionado en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('wcommerce_active_preset', activePreset);
    } catch {}
  }, [activePreset]);

  // Guardar datos SOLO cuando el usuario edita (no durante carga de preset)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Si estamos cargando un preset, NO guardar
    if (isLoadingPreset.current) return;

    // En Vercel solo guardamos en localStorage ya que no tenemos backend
    try {
      localStorage.setItem(`wcommerce_${activePreset}_products`, JSON.stringify(products));
      localStorage.setItem(`wcommerce_${activePreset}_settings`, JSON.stringify(settings));
    } catch {}
  }, [products, settings]);

  // Aplicar tema de marca (colores) + SEO dinámico por preset
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-brand-primary', settings.brandPrimaryColor || DEFAULT_SETTINGS.brandPrimaryColor);
    root.style.setProperty('--color-brand-success', settings.brandSuccessColor || DEFAULT_SETTINGS.brandSuccessColor);

    document.title = settings.storeName
      ? `${settings.storeName}${settings.storeTagline ? ` — ${settings.storeTagline}` : ''}`
      : 'Wcommerce';

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && settings.heroSubtitle) metaDesc.setAttribute('content', settings.heroSubtitle);

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme && settings.brandPrimaryColor) metaTheme.setAttribute('content', settings.brandPrimaryColor);
  }, [settings]);

  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('flash_sport_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const handleLogin = () => {
    setIsAdminAuthenticated(true);
    try {
      localStorage.setItem('flash_sport_admin_auth', 'true');
    } catch {}
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    try {
      localStorage.removeItem('flash_sport_admin_auth');
    } catch {}
  };

  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <>
      {/* key=pathname: al navegar el boundary se reinicia y no queda "pegado" el error */}
      <ErrorBoundary key={location.pathname}>
        <BcvRateProvider>
          <DeliveryProvider>
            <Routes>
              <Route path="/" element={<StoreFront products={products} settings={settings} />} />
              <Route
                path="/admin"
                element={
                  isAdminAuthenticated ? (
                    <AdminDashboard
                      products={products}
                      setProducts={setProducts}
                      settings={settings}
                      setSettings={setSettings}
                      onLogout={handleLogout}
                      activePreset={activePreset}
                      setActivePreset={setActivePreset}
                    />
                  ) : (
                    <AdminLogin onLogin={handleLogin} />
                  )
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </DeliveryProvider>
        </BcvRateProvider>
      </ErrorBoundary>
      <PWAInstaller />
    </>
  );
}

