import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { ProductCategory } from '../types';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: ProductCategory;
  onCategoryChange: (category: ProductCategory) => void;
  sortBy: 'popular' | 'price-asc' | 'price-desc' | 'name-asc';
  onSortChange: (sort: 'popular' | 'price-asc' | 'price-desc' | 'name-asc') => void;
  selectedVersionFilter: string;
  onVersionFilterChange: (version: string) => void;
  totalResultsCount: number;
}

const CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'clubes-europa', label: 'Clubes Europa' },
  { id: 'selecciones', label: 'Selecciones' },
  { id: 'version-jugador', label: 'Versión Jugador' },
  { id: 'retro', label: 'Retro Legends' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  selectedVersionFilter,
  onVersionFilterChange,
  totalResultsCount,
}) => {
  return (
    <section className="sticky top-16 sm:top-20 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-3 shadow-sm transition-colors duration-200">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 space-y-2.5">
        
        {/* Top row: Search input + Sort dropdown + Version filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          
          {/* Search Bar */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="search-jerseys-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 dark:hover:text-white"
                title="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Controls row for Sort & Version */}
          <div className="flex items-center gap-2">
            {/* Sort Selector */}
            <div className="relative flex-1 sm:flex-none">
              <select
                id="sort-by-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as any)}
                aria-label="Ordenar productos"
                className="w-full sm:w-auto appearance-none bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-medium py-2 pl-3 pr-8 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-brand-primary cursor-pointer"
              >
                <option value="popular">Más Populares</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="name-asc">Nombre (A - Z)</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                <ArrowUpDown className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Version quick filter */}
            <div className="relative flex-1 sm:flex-none">
              <select
                id="version-filter-select"
                value={selectedVersionFilter}
                onChange={(e) => onVersionFilterChange(e.target.value)}
                aria-label="Filtrar por versión de camiseta"
                className="w-full sm:w-auto appearance-none bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-medium py-2 pl-3 pr-8 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-brand-primary cursor-pointer"
              >
                <option value="all">Todas las Versiones</option>
                <option value="Versión Jugador">Versión Jugador (Pro)</option>
                <option value="Versión Fan">Versión Fan (Stadium)</option>
                <option value="Edición Especial Retro">Edición Especial Retro</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

        </div>

        {/* Bottom row: Category Chips */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-btn-${cat.id}`}
                onClick={() => onCategoryChange(cat.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg transition-all text-xs font-semibold flex-shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}

          <div className="ml-auto pl-2 text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap hidden sm:block">
            <strong className="text-brand-primary font-mono">{totalResultsCount}</strong> modelos
          </div>
        </div>

      </div>
    </section>
  );
};
