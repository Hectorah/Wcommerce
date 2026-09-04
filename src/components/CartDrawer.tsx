import React, { useState, useMemo, useRef } from 'react';
import { X, Trash2, Plus, Minus, Send, Sparkles, Tag, ShieldCheck, ArrowRight, User, MapPin, FileText } from 'lucide-react';
import { CartItem, CustomerInfo } from '../types';
import { calculateCartSummary, generateWhatsAppMessage, buildWhatsAppUrl } from '../utils/cartUtils';
import { WHOLESALE_MIN_ITEMS } from '../data/mockProducts';
import { FlashLogo } from './FlashLogo';
import { WhatsAppIcon } from './Icons';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  whatsappNumbers: string[];
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  whatsappNumbers,
}) => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    city: '',
    phone: '',
    notes: '',
  });

  const summary = useMemo(() => calculateCartSummary(cartItems), [cartItems]);

  // Selecciona un número al azar de los configurados (solo cuando cambia la lista)
  const selectedPhone = useMemo(() => {
    if (!whatsappNumbers || whatsappNumbers.length === 0) return '';
    const idx = Math.floor(Math.random() * whatsappNumbers.length);
    return whatsappNumbers[idx];
  }, [whatsappNumbers]);

  const hasPhone = !!selectedPhone;
  const hasItems = cartItems.length > 0;
  const canSendOrder = hasItems && hasPhone;

  // Genera el link de WhatsApp solo en el momento del click
  const handleOrderClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!canSendOrder) {
      e.preventDefault();
      return;
    }
    try {
      const message = generateWhatsAppMessage(cartItems, customerInfo, summary);
      const url = buildWhatsAppUrl(selectedPhone, message);
      (e.currentTarget as HTMLAnchorElement).href = url;
    } catch (err) {
      console.error('Error generando pedido:', err);
      e.preventDefault();
    }
  };

  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-slate-950/70 dark:bg-black/80 backdrop-blur-sm transition-opacity duration-200 animate-fade-in"
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-full z-10 text-slate-900 dark:text-slate-100 overflow-hidden animate-slide-left transition-colors duration-200">

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FlashLogo size="sm" showSubtitle={false} className="scale-90" />
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5 uppercase">
                Mi Pedido
                {summary.totalItems > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.2 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-brand-primary rounded-full font-bold">
                    {summary.totalItems} 3+ unid
                  </span>
                )}
              </h2>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {summary.isWholesale ? '⚡ Tarifa Mayorista Aplicada' : 'Tarifa Detal (1 a 5 prendas)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {cartItems.length > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                className="text-xs text-slate-400 hover:text-rose-500 px-2 py-1 rounded transition-colors flex items-center gap-1"
                title="Vaciar carrito"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Vaciar</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Wholesale Status Banner / Progress */}
        {cartItems.length > 0 && (
          <div className="px-4 py-3 bg-slate-100/70 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
            {summary.isWholesale ? (
              <div className="bg-brand-primary/20 border border-brand-primary/20 rounded-xl p-3 flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-brand-primary text-slate-950 font-black flex-shrink-0">
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-black text-brand-primary dark:text-brand-primary block">
                    ¡Felicidades! Se ha aplicado la tarifa mayorista.
                  </span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-300">
                    Ahorro de <strong className="font-mono text-brand-primary dark:text-brand-primary font-bold">${summary.totalSaved.toFixed(2)} USD</strong> en total ($18 USD c/u).
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5 text-[11px]">
                    <Tag className="w-3.5 h-3.5 text-brand-primary" />
                    ¡Agrega <strong className="text-brand-primary font-mono">{summary.itemsNeededForWholesale}</strong> prenda{summary.itemsNeededForWholesale === 1 ? '' : 's'} más para tarifa mayorista!
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    {summary.totalItems}/{WHOLESALE_MIN_ITEMS}
                  </span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div
                    className="h-full bg-brand-primary transition-all duration-300 rounded-full"
                    style={{ width: `${Math.min(100, (summary.totalItems / WHOLESALE_MIN_ITEMS) * 100)}%` }}
                  />
                </div>

                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  Desde 6 prendas el precio baja automáticamente de <span className="line-through">$25</span> a <strong className="text-brand-primary">$18 c/u</strong>.
                </span>
              </div>
            )}
          </div>
        )}

        {/* Content Body: Items List & Customer Form */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">

          {cartItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Tag className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Tu pedido está vacío</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Explora el catálogo y selecciona tus camisetas con las tallas deseadas para armar tu cotización.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-950 dark:bg-white text-white dark:text-slate-950 transition-colors"
              >
                <span>Ver Catálogo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
                  Prendas Seleccionadas ({summary.totalItems})
                </span>

                {cartItems.map((item) => {
                  const unitPrice = summary.isWholesale ? item.product.wholesalePrice : item.product.retailPrice;
                  const itemTotal = unitPrice * item.quantity;

                  return (
                    <div
                      key={item.cartItemId}
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex gap-3 items-center justify-between"
                    >
                      {/* Image Thumbnail */}
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-14 rounded-lg object-cover bg-slate-200 dark:bg-slate-950 flex-shrink-0 border border-slate-200 dark:border-slate-800"
                        referrerPolicy="no-referrer"
                      />

                      {/* Item Details */}
                      <div className="flex-1 min-w-0 pr-1">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate leading-tight">
                          {item.product.name}
                        </h4>

                        <div className="flex items-center gap-1.5 mt-0.5 text-xs">
                          <span className="px-1.5 py-0.2 rounded bg-white dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 font-bold font-mono text-[9px]">
                            Talla {item.size}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 text-[10px]">
                            ${unitPrice} c/u
                          </span>
                        </div>

                        {(item.customName || item.customNumber) && (
                          <span className="text-[9px] text-brand-primary dark:text-brand-primary block truncate mt-0.5 font-mono">
                            Dorsal: {item.customNumber ? `#${item.customNumber}` : ''} {item.customName || ''}
                          </span>
                        )}
                      </div>

                      {/* Quantity Stepper & Price */}
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <div className="text-right">
                          <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white font-mono">
                            ${itemTotal}
                          </span>
                        </div>

                        <div className="flex items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                            className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white"
                          >
                            {item.quantity === 1 ? <Trash2 className="w-3 h-3 text-rose-500" /> : <Minus className="w-3 h-3" />}
                          </button>
                          <span className="w-5 text-center text-xs font-mono font-bold text-slate-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                            className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Customer Details Form */}
              <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-3">
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <User className="w-3 h-3 text-brand-primary" />
                  Datos de Contacto (Para tu Pedido)
                </span>

                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Nombre del Cliente
                    </label>
                    <div className="relative">
                      <input
                        id="customer-name-input"
                        type="text"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                        placeholder="Ej: Carlos Rodríguez"
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-brand-primary"
                      />
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Ciudad / Destino de Envío
                    </label>
                    <div className="relative">
                      <input
                        id="customer-city-input"
                        type="text"
                        value={customerInfo.city}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                        placeholder="Ej: Caracas, Valencia, Bogotá..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-brand-primary"
                      />
                      <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Notas / Dorsales Personalizados (Opcional)
                    </label>
                    <div className="relative">
                      <textarea
                        id="customer-notes-input"
                        rows={2}
                        value={customerInfo.notes}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                        placeholder="Ej: Camiseta Real Madrid dorsal 7 VINI JR..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-brand-primary resize-none"
                      />
                      <FileText className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                    </div>
                  </div>
                </div>


              </div>
            </>
          )}

        </div>

        {/* Footer with Calculation Breakdown & WhatsApp Button */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 space-y-3">

            {/* Price Breakdown */}
            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal Detal ({summary.totalItems} prendas):</span>
                <span className="font-mono">${summary.retailTotal.toFixed(2)} USD</span>
              </div>

              {summary.isWholesale && (
                <div className="flex justify-between text-brand-primary dark:text-brand-primary font-bold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Descuento Mayorista (3+):
                  </span>
                  <span className="font-mono">-${summary.totalSaved.toFixed(2)} USD</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline">
                <div>
                  <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white block">TOTAL ESTIMADO:</span>
                  <span className="text-[10px] text-slate-500">Tarifa {summary.isWholesale ? 'Mayorista' : 'Detal'}</span>
                </div>
                <div className="text-right">
                  <span className="text-xl sm:text-2xl font-black text-slate-950 dark:text-brand-primary font-mono">
                    ${summary.currentTotal.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-500 ml-1">USD</span>
                </div>
              </div>
            </div>

            {/* Big Green WhatsApp Action Button */}
            {canSendOrder ? (
              <a
                id="confirm-whatsapp-order-btn"
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleOrderClick}
                className="w-full py-3 px-4 rounded-xl bg-brand-success hover:bg-brand-success active:scale-[0.98] text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-brand-success/20 transition-all duration-200 cursor-pointer no-underline"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Confirmar y Enviar Pedido a WhatsApp</span>
              </a>
            ) : (
              <div className="w-full py-3 px-4 rounded-xl bg-slate-200 text-slate-400 font-black text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                <WhatsAppIcon className="w-4 h-4" />
                <span>{!hasPhone ? 'Sin número configurado' : 'Agrega productos al pedido'}</span>
              </div>
            )}

            <p className="text-[10px] text-center text-slate-500 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-success" />
              <span>Atención directa y personalizada por WhatsApp</span>
            </p>

          </div>
        )}

      </div>
    </div>
  );
};
