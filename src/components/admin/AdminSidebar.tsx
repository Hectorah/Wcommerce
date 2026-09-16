import React, { useState } from 'react';
import { Package, Home, LogOut, FileJson, Menu, X, Store, Palette, Share2, MapPin, Image as ImageIcon } from 'lucide-react';

export type AdminSection = 'productos' | 'identidad' | 'apariencia' | 'contacto' | 'sedes' | 'banners';

const SECTION_ITEMS: { id: AdminSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'productos', label: 'Productos', icon: Package },
  { id: 'identidad', label: 'Identidad & Hero', icon: Store },
  { id: 'apariencia', label: 'Apariencia', icon: Palette },
  { id: 'contacto', label: 'Contacto', icon: Share2 },
  { id: 'sedes', label: 'Sedes Físicas', icon: MapPin },
  { id: 'banners', label: 'Banners', icon: ImageIcon },
];

interface AdminSidebarProps {
  activePreset: string;
  presets: string[];
  setActivePreset: (val: string) => void;
  onLogout: () => void;
  onNavigateHome: () => void;
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
}

export function AdminSidebar({
  activePreset,
  presets,
  setActivePreset,
  onLogout,
  onNavigateHome,
  activeSection,
  onSectionChange,
}: AdminSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const SidebarContent = () => (
    <>
      {/* Logo y header */}
      <div className="p-4 sm:p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <img
            src="/icon.png"
            alt="Wcommerce Logo"
            className="h-10 w-10 object-contain"
          />
          <div className="flex-1">
            <h1 className="text-xl font-black uppercase tracking-tight">Wcommerce</h1>
            <p className="text-xs text-slate-400">Panel Administrativo</p>
          </div>
          {/* Botón de cerrar menú móvil (solo en móvil) */}
          <button
            onClick={toggleMobileMenu}
            className="sm:hidden text-slate-400 hover:text-white transition-colors p-1"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Preset selector */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center text-slate-300 text-sm mb-2">
          <FileJson className="w-4 h-4 mr-2" />
          <span className="font-medium">Preset Activo</span>
        </div>
        <select
          value={activePreset}
          onChange={(e) => setActivePreset(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary cursor-pointer"
        >
          {presets.length > 0 ? (
            presets.map(p => <option key={p} value={p}>{p}</option>)
          ) : (
            <option value={activePreset}>{activePreset}</option>
          )}
        </select>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 overflow-y-auto">
        <nav className="space-y-1">
          <button
            onClick={() => {
              onNavigateHome();
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Volver a Tienda</span>
          </button>

          <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mt-6 mb-2 px-3">
            Gestión
          </div>

          {SECTION_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSectionChange(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                  isActive
                    ? 'bg-brand-primary/20 text-brand-primary'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer con logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => {
            onLogout();
            setIsMobileMenuOpen(false);
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Botón de hamburguesa para móvil */}
      <button
        onClick={toggleMobileMenu}
        className="sm:hidden fixed top-4 left-4 z-50 bg-slate-900 text-white p-2 rounded-lg shadow-lg"
        aria-label="Abrir menú"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar para desktop */}
      <div className="hidden sm:flex w-64 min-h-screen bg-slate-900 text-white border-r border-slate-800 flex-col fixed left-0 top-0 z-40">
        <SidebarContent />
      </div>

      {/* Overlay y sidebar para móvil */}
      {isMobileMenuOpen && (
        <>
          <div
            className="sm:hidden fixed inset-0 bg-black/50 z-40"
            onClick={toggleMobileMenu}
            aria-hidden="true"
          />
          <div className="sm:hidden fixed left-0 top-0 h-full w-64 bg-slate-900 text-white border-r border-slate-800 flex-col z-50 animate-slide-in-left">
            <SidebarContent />
          </div>
        </>
      )}
    </>
  );
}