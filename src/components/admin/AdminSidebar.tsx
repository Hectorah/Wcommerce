import React from 'react';
import { Package, Tag, Settings, Users, BarChart, Home, LogOut, FileJson } from 'lucide-react';

interface AdminSidebarProps {
  activePreset: string;
  presets: string[];
  setActivePreset: (val: string) => void;
  onLogout: () => void;
  onNavigateHome: () => void;
}

export function AdminSidebar({ 
  activePreset, 
  presets, 
  setActivePreset, 
  onLogout,
  onNavigateHome 
}: AdminSidebarProps) {
  return (
    <div className="w-64 min-h-screen bg-slate-900 text-white border-r border-slate-800 flex flex-col">
      {/* Logo y header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <img 
            src="/icon.png" 
            alt="Wcommerce Logo" 
            className="h-10 w-10 object-contain"
          />
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight">Wcommerce</h1>
            <p className="text-xs text-slate-400">Panel Administrativo</p>
          </div>
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
      <div className="flex-1 p-4">
        <nav className="space-y-1">
          <button
            onClick={onNavigateHome}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Volver a Tienda</span>
          </button>

          <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mt-6 mb-2 px-3">
            Gestión
          </div>
          
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-brand-primary/20 text-brand-primary rounded-lg text-sm font-medium">
            <Package className="w-4 h-4" />
            <span>Productos</span>
          </a>

          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium">
            <Tag className="w-4 h-4" />
            <span>Categorías</span>
          </a>

          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium">
            <Users className="w-4 h-4" />
            <span>Clientes</span>
          </a>

          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium">
            <BarChart className="w-4 h-4" />
            <span>Reportes</span>
          </a>

          <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mt-6 mb-2 px-3">
            Configuración
          </div>

          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium">
            <Settings className="w-4 h-4" />
            <span>Ajustes</span>
          </a>
        </nav>
      </div>

      {/* Footer con logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}