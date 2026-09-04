import React from 'react';
import { JerseyProduct, JerseySize } from '../types';
import { ProductCard } from './ProductCard';
import { SearchX, RotateCcw } from 'lucide-react';

interface ProductGridProps {
  products: JerseyProduct[];
  isWholesaleActive: boolean;
  onAddToCart: (product: JerseyProduct, size: JerseySize, quantity: number, customName?: string, customNumber?: string) => void;
  onOpenDetails: (product: JerseyProduct) => void;
  onResetFilters: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isWholesaleActive,
  onAddToCart,
  onOpenDetails,
  onResetFilters,
}) => {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center max-w-md mx-auto px-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <SearchX className="w-6 h-6 text-brand-primary" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">No encontramos modelos con ese filtro</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Intenta con otros términos como Real Madrid, Messi, Argentina, Retro, o restablece los filtros para ver todo el catálogo.
        </p>
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-950 dark:bg-white text-white dark:text-slate-950 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restablecer Filtros</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isWholesaleActive={isWholesaleActive}
          onAddToCart={onAddToCart}
          onOpenDetails={onOpenDetails}
        />
      ))}
    </div>
  );
};
