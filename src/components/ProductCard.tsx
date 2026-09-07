import React, { useState } from 'react';
import { Plus, Check, Eye, Tag } from 'lucide-react';
import { JerseyProduct, JerseySize } from '../types';

interface ProductCardProps {
  product: JerseyProduct;
  isWholesaleActive: boolean;
  onAddToCart: (product: JerseyProduct, size: JerseySize, quantity: number, customName?: string, customNumber?: string) => void;
  onOpenDetails: (product: JerseyProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWholesaleActive,
  onAddToCart,
  onOpenDetails,
}) => {
  const [selectedSize, setSelectedSize] = useState<JerseySize>(product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddedRecently, setIsAddedRecently] = useState<boolean>(false);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, quantity);
    setIsAddedRecently(true);
    setTimeout(() => {
      setIsAddedRecently(false);
    }, 1200);
  };

  const isPlayerVersion = product.version === 'Versión Jugador';
  const isRetro = product.category === 'retro';

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-brand-primary dark:hover:border-brand-primary/20 transition-all duration-200 flex flex-col overflow-hidden shadow-sm hover:shadow-md">

      {/* Product Image Box (3:4 Vertical Aspect Ratio) */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100 dark:bg-slate-950 cursor-pointer" onClick={() => onOpenDetails(product)}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />

        {/* Subtle Gradient Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-start justify-between gap-1 pointer-events-none">
          <div className="flex flex-col gap-1">
            {product.inStock === false && (
              <span className="px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black tracking-wider uppercase backdrop-blur-md shadow-sm bg-red-500 text-white">
                AGOTADO
              </span>
            )}
            <span className={`px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black tracking-wider uppercase backdrop-blur-md shadow-sm ${isPlayerVersion
                ? 'bg-brand-primary text-slate-950'
                : isRetro
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                  : 'bg-white text-slate-950 dark:bg-slate-900 dark:text-white'
              }`}>
              {product.version}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(product);
            }}
            className="p-2 sm:p-1.5 rounded-lg bg-white/90 dark:bg-slate-900/90 hover:bg-brand-primary hover:text-slate-950 text-slate-700 dark:text-slate-300 backdrop-blur transition-all pointer-events-auto shadow-sm flex items-center justify-center min-w-[44px] min-h-[44px] touch-feedback"
            title="Ver detalles"
          >
            <Eye className="w-5 h-5 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>

        {/* Bottom Image Info (League) */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-white font-medium pointer-events-none">
          <span className="truncate max-w-[70%] drop-shadow-sm font-semibold">
            {product.league}
          </span>
          {product.fabricTech && (
            <span className="bg-black/60 px-1.5 py-0.2 rounded text-[8px] font-mono text-blue-200 border border-white/10 backdrop-blur">
              {product.fabricTech}
            </span>
          )}
        </div>
      </div>

      {/* Product Content Body */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">

        {/* Title & Team */}
        <div>
          <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-brand-primary block mb-0.5">
            {product.team} • {product.season}
          </span>
          <h3
            onClick={() => onOpenDetails(product)}
            className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-brand-primary cursor-pointer transition-colors leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>
        </div>

        {/* Pricing Layout */}
        <div className="bg-slate-50 dark:bg-slate-950/80 p-2 rounded-xl border border-slate-200 dark:border-slate-800/80">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[9px] text-slate-400 uppercase font-bold block">Detal</span>
              <div className="flex items-baseline gap-0.5">
                <span className={`text-xs sm:text-sm font-black font-mono ${!isWholesaleActive ? 'text-slate-900 dark:text-white' : 'text-slate-400 line-through'
                  }`}>
                  ${product.retailPrice}
                </span>
                <span className="text-[9px] text-slate-400">USD</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[9px] text-brand-primary font-extrabold uppercase flex items-center justify-end gap-0.5">
                <Tag className="w-2.5 h-2.5" /> Mayor (3+)
              </span>
              <div className="flex items-baseline justify-end gap-0.5">
                <span className="text-sm sm:text-base font-black font-mono text-brand-primary">
                  ${product.wholesalePrice}
                </span>
                <span className="text-[9px] text-brand-primary dark:text-brand-primary font-bold">c/u</span>
              </div>
            </div>
          </div>
        </div>

        {/* Size Selection */}
        <div>
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
            <span>Talla: <strong className="text-slate-900 dark:text-white">{selectedSize}</strong></span>
          </div>

          <div className="grid grid-cols-5 gap-1">
            {product.sizes.map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => setSelectedSize(sz)}
                disabled={product.inStock === false}
                className={`py-1 text-[10px] sm:text-[11px] font-bold rounded-lg border transition-all ${product.inStock === false ? 'cursor-not-allowed opacity-50 bg-slate-100 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800' : 'cursor-pointer'
                  } ${selectedSize === sz && product.inStock !== false
                    ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 border-slate-950 dark:border-white shadow-sm'
                    : product.inStock !== false ? 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600' : ''
                  }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls (Quantity + Add Button) */}
        <div className="flex items-center gap-1.5 pt-1">

          {/* Quantity Stepper */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1 || product.inStock === false}
              className="w-6 h-7 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 text-xs font-bold"
            >
              -
            </button>
            <span className="w-5 text-center text-xs font-mono font-bold text-slate-900 dark:text-white">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(50, q + 1))}
              disabled={product.inStock === false}
              className="w-6 h-7 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 text-xs font-bold"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            id={`add-to-cart-${product.id}`}
            onClick={handleAdd}
            disabled={product.inStock === false}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 ${product.inStock === false ? 'cursor-not-allowed bg-slate-300 dark:bg-slate-800 text-slate-500' : 'cursor-pointer active:scale-95'
              } ${product.inStock !== false && isAddedRecently
                ? 'bg-brand-primary text-slate-950 shadow-sm'
                : product.inStock !== false ? 'bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 shadow-sm' : ''
              }`}
          >
            {isAddedRecently ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>¡Listo!</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                <span className="truncate hidden xs:inline">Agregar</span>
              </>
            )}
          </button>

        </div>

      </div>

    </div>
  );
};
