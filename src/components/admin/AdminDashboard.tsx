import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { JerseyProduct, SiteSettings } from '../../types';
import { Package, Tag, AlertCircle, Plus, LogOut, ArrowLeft, Video, Upload, Phone, Trash2, MessageCircle, FileJson } from 'lucide-react';
import { ProductTable } from './ProductTable';
import { ProductFormModal } from './ProductFormModal';
import { FeedbackModal } from './FeedbackModal';
import { AdminSidebar } from './AdminSidebar';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<JerseyProduct | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [newWhatsappNumber, setNewWhatsappNumber] = useState('');

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
          // Eliminar imagen principal si es local
          if (productToDelete.image?.startsWith('/uploads/')) {
            await fetch('/api/upload', { method: 'DELETE', body: JSON.stringify({ url: productToDelete.image }) });
          }
          // Eliminar imágenes secundarias si son locales
          if (productToDelete.images && productToDelete.images.length > 0) {
            for (const img of productToDelete.images) {
              if (img.startsWith('/uploads/')) {
                await fetch('/api/upload', { method: 'DELETE', body: JSON.stringify({ url: img }) });
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
    setProducts(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.map(p => p.id === product.id ? product : p);
      } else {
        return [product, ...prev];
      }
    });
    setIsModalOpen(false);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // En Vercel no podemos subir archivos, solo usar URLs
    setFeedback({
      isOpen: true,
      type: 'error',
      title: 'Función no disponible',
      message: 'En Vercel solo puedes usar URLs de videos. Copia la URL de un video de TikTok o YouTube y pégala en el campo de texto.'
    });
    if (e.target) e.target.value = '';
  };

  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, heroVideoUrl: e.target.value }));
  };

  const handleClearVideo = async () => {
    setSettings(prev => ({ ...prev, heroVideoUrl: '' }));
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
      />

      {/* Contenido principal */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        <div className="max-w-[1920px] mx-auto space-y-8">
          
          {/* Header simplificado */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
                Panel de Control
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Gestión de inventario - Preset: {activePreset}
              </p>
            </div>
          </div>

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

          {/* Tabla con botón de agregar integrado */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Productos</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Administra todos los productos del catálogo
                </p>
              </div>
              <button
                onClick={handleOpenCreateModal}
                className="flex items-center justify-center gap-2 bg-brand-success hover:bg-brand-success text-white px-4 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Producto</span>
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

          {/* Site Config Section */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Video className="w-5 h-5 text-brand-primary" /> Configuración de la Tienda
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Video Section */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Video en Portada (URL de TikTok, YouTube, etc.)</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="url"
                    placeholder="URL del video (ej: https://www.tiktok.com/...)"
                    value={settings.heroVideoUrl || ''}
                    onChange={handleVideoUrlChange}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-brand-success text-sm"
                  />
                  {settings.heroVideoUrl && (
                    <button
                      onClick={handleClearVideo}
                      className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-medium transition-colors whitespace-nowrap"
                      title="Quitar video"
                    >
                      Quitar URL
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  En Vercel solo puedes usar URLs públicas de videos. Ej: TikTok, YouTube, Vimeo.
                </p>
              </div>

              {/* WhatsApp Numbers Section */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-brand-success" />
                  Números de WhatsApp para Pedidos (máx. 4)
                </label>
                <p className="text-xs text-slate-500 mb-3">
                  Los pedidos se rotarán automáticamente entre estos números para distribuir la carga.
                  Formato internacional sin símbolos (ej: <span className="font-mono">584141234567</span>).
                </p>

                {/* Lista de números */}
                <div className="space-y-2 mb-3">
                  {(settings.whatsappNumbers || []).map((num, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                      <Phone className="w-4 h-4 text-brand-success flex-shrink-0" />
                      <span className="flex-1 font-mono text-sm text-slate-800">+{num}</span>
                      <span className="text-[10px] font-bold bg-green-200 text-emerald-700 px-1.5 py-0.5 rounded">#{idx + 1}</span>
                      <button
                        onClick={() => {
                          const updated = (settings.whatsappNumbers || []).filter((_, i) => i !== idx);
                          setSettings(prev => ({ ...prev, whatsappNumbers: updated }));
                        }}
                        className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {(settings.whatsappNumbers || []).length === 0 && (
                    <p className="text-xs text-brand-primary bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg">
                      ⚠️ No hay números configurados. Los pedidos no se podrán enviar.
                    </p>
                  )}
                </div>

                {/* Agregar número */}
                {(settings.whatsappNumbers || []).length < 4 && (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">+</span>
                      <input
                        type="tel"
                        placeholder="584141234567"
                        value={newWhatsappNumber}
                        onChange={e => setNewWhatsappNumber(e.target.value.replace(/\D/g, ''))}
                        className="w-full pl-6 pr-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-mono text-sm focus:ring-2 focus:ring-brand-success"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (!newWhatsappNumber || newWhatsappNumber.length < 8) return;
                        setSettings(prev => ({
                          ...prev,
                          whatsappNumbers: [...(prev.whatsappNumbers || []), newWhatsappNumber]
                        }));
                        setNewWhatsappNumber('');
                      }}
                      className="px-4 py-2 bg-brand-success hover:bg-brand-success text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Agregar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
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
      </div>
    </div>
  );
}
