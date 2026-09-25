import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { JerseyProduct, SiteSettings } from '../../types';
import { Package, Tag, AlertCircle, Plus, CheckCircle2 } from 'lucide-react';
import { ProductTable } from './ProductTable';
import { ProductFormModal } from './ProductFormModal';
import { FeedbackModal } from './FeedbackModal';
import { AdminSidebar, AdminSection } from './AdminSidebar';
import { StoreIdentityPanel } from './StoreIdentityPanel';
import { StoreAppearancePanel } from './StoreAppearancePanel';
import { StoreContactPanel } from './StoreContactPanel';
import { StoreGuidesPanel } from './StoreGuidesPanel';
import { StoreDeliveryPanel } from './StoreDeliveryPanel';
import { StoreLocationsPanel } from './StoreLocationsPanel';
import { BannersPanel } from './BannersPanel';

interface AdminDashboardProps {
  products: JerseyProduct[];
  setProducts: React.Dispatch<React.SetStateAction<JerseyProduct[]>>;
  settings: SiteSettings;
  setSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
  onLogout: () => void;
  activePreset: string;
  setActivePreset: (val: string) => void;
}

export function AdminDashboard({ products, setProducts, settings, setSettings, onLogout, activePreset, setActivePreset }: AdminDashboardProps) {
  const navigate = useNavigate();
  const [presets, setPresets] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<AdminSection>('productos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<JerseyProduct | null>(null);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const feedbackTimer = useRef<number | null>(null);

  // Draft compartido para las secciones de configuración
  const [draftSettings, setDraftSettings] = useState<SiteSettings>(settings);
  const isSettingsDirty = JSON.stringify(draftSettings) !== JSON.stringify(settings);

  // Sincronizar el draft cuando cambian los settings (preset o guardado)
  useEffect(() => {
    setDraftSettings(settings);
  }, [settings]);

  // Cargar presets disponibles desde /data/
  useEffect(() => {
    // Lista de presets disponibles en /data/
    const availablePresets = ['data.json', 'comida.json', 'tecnologia.json', 'repuestos.json', 'farmacia.json'];
    setPresets(availablePresets);
  }, []);

  // Feedback Modal State
  const [feedback, setFeedback] = useState<{
    isOpen: boolean;
    type: 'confirm' | 'error' | 'info';
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({ isOpen: false, type: 'info', title: '', message: '' });

  // Limpiar temporizador del feedback al desmontar
  useEffect(() => {
    return () => {
      if (feedbackTimer.current) window.clearTimeout(feedbackTimer.current);
    };
  }, []);

  // KPIs
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.inStock !== false).length;
  const outOfStockProducts = totalProducts - inStockProducts;
  const featuredProducts = products.filter(p => p.isFeatured).length;

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: JerseyProduct) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    setFeedback({
      isOpen: true,
      type: 'confirm',
      title: 'Eliminar Camiseta',
      message: '¿Estás seguro de que deseas eliminar esta camiseta? Esta acción no se puede deshacer.',
      onConfirm: async () => {
        setFeedback(prev => ({ ...prev, isOpen: false }));
        const productToDelete = products.find(p => p.id === productId);
        if (productToDelete) {
          // Eliminar archivos locales solo en desarrollo; en Vercel /api/upload no existe
          if (import.meta.env.DEV) {
            // Eliminar imagen principal si es local
            if (productToDelete.image?.startsWith('/uploads/')) {
              await fetch('/api/upload', { method: 'DELETE', body: JSON.stringify({ url: productToDelete.image }) }).catch(() => {});
            }
            // Eliminar imágenes secundarias si son locales
            if (productToDelete.images && productToDelete.images.length > 0) {
              for (const img of productToDelete.images) {
                if (img.startsWith('/uploads/')) {
                  await fetch('/api/upload', { method: 'DELETE', body: JSON.stringify({ url: img }) }).catch(() => {});
                }
              }
            }
          }
        }
        setProducts(prev => prev.filter(p => p.id !== productId));
      }
    });
  };

  const handleToggleStock = (productId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, inStock: p.inStock === false ? true : false };
      }
      return p;
    }));
  };

  const handleSaveProduct = (product: JerseyProduct) => {
    const exists = products.some(p => p.id === product.id);
    setProducts(prev => {
      if (exists) {
        return prev.map(p => p.id === product.id ? product : p);
      } else {
        return [product, ...prev];
      }
    });
    setIsModalOpen(false);
    showSaveFeedback(exists ? '✅ Producto actualizado' : '✅ Producto agregado');
  };

  const showSaveFeedback = (message: string) => {
    setSaveFeedback(message);
    if (feedbackTimer.current) window.clearTimeout(feedbackTimer.current);
    feedbackTimer.current = window.setTimeout(() => setSaveFeedback(null), 2500);
  };

  const patchSettings = (patch: Partial<SiteSettings>) => {
    setDraftSettings(prev => ({ ...prev, ...patch }));
  };

  const handleSaveSettings = () => {
    setSettings(draftSettings);
    showSaveFeedback('✅ Configuración guardada');
  };

  const sectionTitle: Record<AdminSection, string> = {
    productos: 'Gestión de Inventario',
    identidad: 'Identidad & Hero',
    apariencia: 'Apariencia & Colores',
    contacto: 'Contacto & WhatsApp',
    guias: 'Guías & Ayuda',
    envios: 'Delivery & Pickup',
    sedes: 'Sedes Físicas',
    banners: 'Banners de Portada',
  };

  const renderSettingsPanel = () => {
    switch (activeSection) {
      case 'identidad':
        return <StoreIdentityPanel draft={draftSettings} onChange={patchSettings} />;
      case 'apariencia':
        return <StoreAppearancePanel draft={draftSettings} onChange={patchSettings} />;
      case 'contacto':
        return <StoreContactPanel draft={draftSettings} onChange={patchSettings} />;
      case 'guias':
        return <StoreGuidesPanel draft={draftSettings} onChange={patchSettings} />;
      case 'envios':
        return <StoreDeliveryPanel />;
      case 'sedes':
        return <StoreLocationsPanel draft={draftSettings} onChange={patchSettings} />;
      case 'banners':
        return <BannersPanel draft={draftSettings} onChange={patchSettings} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex">
      {/* Sidebar */}
      <AdminSidebar
        activePreset={activePreset}
        presets={presets}
        setActivePreset={setActivePreset}
        onLogout={onLogout}
        onNavigateHome={() => navigate('/')}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Contenido principal */}
      <div className="flex-1 sm:ml-64 p-4 sm:p-6 lg:p-8 overflow-auto">
        <div className="max-w-[1920px] mx-auto space-y-8">

          {/* Header por sección */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
                {sectionTitle[activeSection]}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Preset: {activePreset}
              </p>
            </div>
          </div>

          {activeSection === 'productos' ? (
            <>
              {/* KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Total Productos</p>
                    <p className="text-2xl font-black text-slate-900">{totalProducts}</p>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-50 text-brand-success flex items-center justify-center">
                    <Tag className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Destacados</p>
                    <p className="text-2xl font-black text-slate-900">{featuredProducts}</p>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Agotados</p>
                    <p className="text-2xl font-black text-slate-900">{outOfStockProducts}</p>
                  </div>
                </div>
              </div>

              {/* Productos: pantalla exclusiva para CRUD de productos */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 border-b border-slate-200">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Productos</h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Agrega, edita o elimina productos del catálogo
                    </p>
                  </div>
                  <button
                    onClick={handleOpenCreateModal}
                    className="flex items-center justify-center gap-2 bg-brand-success hover:bg-brand-success text-white px-4 py-3 sm:px-4 sm:py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm whitespace-nowrap touch-feedback min-w-[52px] min-h-[52px] sm:min-w-auto sm:min-h-auto"
                  >
                    <Plus className="w-5 h-5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Agregar Producto</span>
                  </button>
                </div>

                <div className="p-6">
                  <ProductTable
                    products={products}
                    onEdit={handleOpenEditModal}
                    onDelete={handleDeleteProduct}
                    onToggleStock={handleToggleStock}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Configuración de la sección activa */}
              {renderSettingsPanel()}

              {/* Barra de guardado global */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-end gap-3 sticky bottom-4">
                {isSettingsDirty && (
                  <span className="text-xs text-amber-700 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> Hay cambios sin guardar
                  </span>
                )}
                <button
                  onClick={handleSaveSettings}
                  disabled={!isSettingsDirty}
                  className="px-6 py-2.5 bg-brand-primary hover:bg-brand-primary text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Guardar Cambios
                </button>
              </div>
            </>
          )}
        </div>

        <ProductFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveProduct}
          initialData={editingProduct}
        />

        <FeedbackModal
          isOpen={feedback.isOpen}
          type={feedback.type}
          title={feedback.title}
          message={feedback.message}
          onConfirm={feedback.onConfirm}
          onCancel={() => setFeedback(prev => ({ ...prev, isOpen: false }))}
        />

        {saveFeedback && (
          <div className="fixed bottom-5 right-5 z-[80] flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg animate-fade-in">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{saveFeedback}</span>
          </div>
        )}
      </div>
    </div>
  );
}