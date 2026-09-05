import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { JerseyProduct, SiteSettings } from './types';
import { StoreFront } from './StoreFront';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLogin } from './components/admin/AdminLogin';
import { PWAInstaller } from './components/PWAInstaller';

const DEFAULT_SETTINGS: SiteSettings = {
  heroVideoUrl: '',
  whatsappNumbers: []
};

export default function App() {
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
      .then(data => {
        if (data) {
          if (data.products) setProducts(data.products);
          if (data.settings) setSettings(data.settings);
        } else {
          setProducts([]);
          setSettings(DEFAULT_SETTINGS);
        }
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
      <PWAInstaller />
    </>
  );
}

