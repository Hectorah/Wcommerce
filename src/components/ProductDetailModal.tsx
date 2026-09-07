import React, { useState } from 'react';
import { X, Plus, Check, HelpCircle, Sparkles, Play } from 'lucide-react';
import { JerseyProduct, JerseySize } from '../types';

interface ProductDetailModalProps {
  product: JerseyProduct | null;
  onClose: () => void;
  isWholesaleActive: boolean;
  onAddToCart: (product: JerseyProduct, size: JerseySize, quantity: number, customName?: string, customNumber?: string) => void;
  onOpenSizeGuide: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  isWholesaleActive,
  onAddToCart,
  onOpenSizeGuide,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<JerseySize>(product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState<number>(1);
  const [customName, setCustomName] = useState<string>('');
  const [customNumber, setCustomNumber] = useState<string>('');
  const [isAdded, setIsAdded] = useState<boolean>(false);
  // 'image' | 'video' — qué tipo de media se muestra en el visor principal
  const [activeMediaType, setActiveMediaType] = useState<'image' | 'video'>('image');
  const [currentImage, setCurrentImage] = useState<string>(product.image);

  const allImages = [product.image, ...(product.images || [])].filter(Boolean);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, quantity, customName.trim(), customNumber.trim());
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 900);
  };

  const handleSelectSuggestedPlayer = (playerStr: string) => {
    const parts = playerStr.split(' - ');
    if (parts.length === 2) {
      setCustomNumber(parts[0]);
      setCustomName(parts[1]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 dark:bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl z-10 animate-scale-up text-slate-900 dark:text-slate-100">
        
        {/* Close Button - Mejorado para móvil */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-3 sm:p-2 rounded-full bg-black/70 hover:bg-black/90 text-white transition-colors shadow-lg touch-feedback min-w-[52px] min-h-[52px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center"
          aria-label="Cerrar"
        >
          <X className="w-6 h-6 sm:w-4 sm:h-4" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          
          {/* Left Column: Image with badges & gallery */}
          <div className="bg-slate-100 dark:bg-slate-950 flex flex-col h-full">
            <div className="relative aspect-[4/5] sm:aspect-auto sm:flex-1">
              {activeMediaType === 'video' && product.video ? (
                <video
                  src={product.video}
                  className="w-full h-full sm:object-cover object-contain"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                />
              ) : (
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full sm:object-cover object-contain"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-black bg-brand-primary text-slate-950 uppercase tracking-wider shadow">
                  {product.version}
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-black/70 text-white backdrop-blur">
                  {product.season}
                </span>
              </div>
            </div>

            {/* Gallery Thumbnails + Video Tab */}
            {(allImages.length > 1 || product.video) && (
              <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <div className="flex gap-2 overflow-x-auto pb-1 snap-x scrollbar-hide">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setCurrentImage(img); setActiveMediaType('image'); }}
                      className={`relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 snap-center transition-all ${
                        activeMediaType === 'image' && currentImage === img
                          ? 'border-brand-primary shadow-md'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}

                  {/* Video thumbnail */}
                  {product.video && (
                    <button
                      onClick={() => setActiveMediaType('video')}
                      className={`relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 snap-center transition-all bg-slate-900 flex items-center justify-center ${
                        activeMediaType === 'video'
                          ? 'border-brand-primary shadow-md'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Play className="w-6 h-6 text-white" />
                      <video src={product.video} className="absolute inset-0 w-full h-full object-cover opacity-40" muted />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Info & Form */}
          <div className="p-4 sm:p-6 flex flex-col justify-between space-y-3.5 max-h-[80vh] overflow-y-auto">
            
            {/* Header info */}
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-brand-primary block mb-1">
                {product.team} • {product.league}
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                {product.name}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price Box */}
            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Detal (1 a 2)</span>
                <span className="text-base font-black text-slate-900 dark:text-white font-mono">${product.retailPrice} USD</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase font-bold text-brand-primary block">Mayorista (3+)</span>
                <span className="text-lg font-black text-brand-primary font-mono">${product.wholesalePrice} USD</span>
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                <span>Talla:</span>
                <button
                  type="button"
                  onClick={onOpenSizeGuide}
                  className="text-brand-primary dark:text-brand-primary hover:underline flex items-center gap-1 text-[11px]"
                >
                  <HelpCircle className="w-3 h-3" /> Guía de medidas
                </button>
              </div>

              <div className="grid grid-cols-5 gap-1.5">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    disabled={product.inStock === false}
                    className={`py-1.5 text-xs font-black rounded-lg border transition-all ${
                      product.inStock === false ? 'cursor-not-allowed opacity-50 bg-slate-100 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800' : 'cursor-pointer'
                    } ${
                      selectedSize === sz && product.inStock !== false
                        ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 border-slate-950 dark:border-white shadow-sm'
                        : product.inStock !== false ? 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800' : ''
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Dorsal & Name Personalization */}
            <div className="bg-slate-50 dark:bg-slate-950/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-brand-primary" />
                Estampar Nombre y Dorsal (Opcional)
              </span>

              {/* Popular quick presets */}
              {product.popularPlayers && product.popularPlayers.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {product.popularPlayers.map((player) => (
                    <button
                      key={player}
                      type="button"
                      onClick={() => handleSelectSuggestedPlayer(player)}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-brand-primary transition-colors"
                    >
                      {player}
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <input
                    type="text"
                    value={customNumber}
                    onChange={(e) => setCustomNumber(e.target.value)}
                    placeholder="N° (ej: 7)"
                    maxLength={3}
                    className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-center"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value.toUpperCase())}
                    placeholder="Nombre (ej: VINICIUS JR)"
                    className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-slate-800 uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-0.5">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || product.inStock === false}
                  className="w-7 h-7 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold disabled:opacity-30"
                >
                  -
                </button>
                <span className="w-7 text-center text-xs font-mono font-bold text-slate-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(50, q + 1))}
                  disabled={product.inStock === false}
                  className="w-7 h-7 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold disabled:opacity-30"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                disabled={product.inStock === false}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
                  product.inStock === false ? 'cursor-not-allowed bg-slate-300 dark:bg-slate-800 text-slate-500' : 'cursor-pointer'
                } ${
                  product.inStock !== false && isAdded
                    ? 'bg-brand-primary text-slate-950'
                    : product.inStock !== false ? 'bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950' : ''
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>¡Agregado!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                    <span className="hidden xs:inline">Agregar al Pedido</span>
                    <span className="xs:hidden">Agregar</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
