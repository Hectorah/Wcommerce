import React from 'react';
import { ShoppingBag, ShieldCheck, HelpCircle, Sparkles, Sun, Moon } from 'lucide-react';
import { FlashLogo } from './FlashLogo';
import { WhatsAppIcon } from './Icons';
import { DEFAULT_WHATSAPP_PHONE } from '../data/mockProducts';

interface NavbarProps {
  cartItemCount: number;
  cartTotal: number;
  isWholesale: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenCart: () => void;
  onOpenSizeGuide: () => void;
  onOpenWholesaleInfo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartItemCount,
  cartTotal,
  isWholesale,
  theme,
  onToggleTheme,
  onOpenCart,
  onOpenSizeGuide,
  onOpenWholesaleInfo,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      {/* Top micro-banner
      <div className="bg-slate-950 dark:bg-black text-white text-[11px] sm:text-xs font-semibold py-1.5 px-4 text-center flex items-center justify-center gap-2 border-b border-slate-800">
        <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
        <span>
          <strong className="text-brand-primary font-extrabold uppercase">Descuento Mayorista:</strong>  camisetas por solo <span className="underline decoration-brand-primary font-mono font-bold">$18 USD c/u</span>
        </span>
      </div> */}

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">

          {/* Logo & Store Name */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm group-hover:border-brand-primary/20 transition-colors">
              <FlashLogo size="sm" showSubtitle={false} className="scale-90" />
            </div>
          </div>

          {/* Center Info Badges (Desktop & Tablet) */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <button
              onClick={onOpenWholesaleInfo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" />
              <span>Venta Mayorista & Detal</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-brand-primary/20 text-brand-primary dark:text-brand-primary rounded font-mono font-bold">3+ unid</span>
            </button>

            <button
              onClick={onOpenSizeGuide}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-transparent hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Guía de Tallas</span>
            </button>
          </div>

          {/* Right Action: Theme Switcher + Direct WhatsApp + Cart */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Theme Toggle Button (Light / Dark Mode) */}
            <button
              id="theme-toggle-btn"
              type="button"
              onClick={onToggleTheme}
              className="p-2.5 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-all cursor-pointer active:scale-95 flex items-center justify-center min-w-[44px] min-h-[44px] touch-feedback"
              title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
              aria-label="Alternar modo claro y oscuro"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 sm:w-4 sm:h-4 text-brand-primary animate-spin-slow" />
              ) : (
                <Moon className="w-5 h-5 sm:w-4 sm:h-4 text-slate-700" />
              )}
            </button>

            {/* Quick WhatsApp Channel */}
            <div className="hidden sm:block">
              <a
                href="https://whatsapp.com/channel/0029Vb7RtomDZ4LQyRTqzJ1J"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold text-brand-success dark:text-brand-success bg-green-50 hover:bg-green-200 dark:bg-brand-success/20 dark:hover:bg-brand-success/20 rounded-full transition-colors border border-green-200/50 dark:border-emerald-800/50"
                title="Canal de WhatsApp"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden lg:inline">WhatsApp</span>
              </a>
            </div>

            {/* Cart Button */}
            <button
              id="navbar-cart-btn"
              onClick={onOpenCart}
              className={`relative flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 active:scale-95 shadow-sm ${cartItemCount > 0
                ? isWholesale
                  ? 'bg-brand-primary hover:bg-blue-200 text-slate-950 shadow-brand-primary/20'
                  : 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border border-slate-800 dark:border-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800'
                }`}
            >
              <div className="relative">
                <ShoppingBag className={`w-4 h-4 sm:w-5 sm:h-5 ${cartItemCount > 0 && isWholesale ? 'text-slate-950' : ''}`} />
                {cartItemCount > 0 && (
                  <span className={`absolute -top-2 -right-2.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-black rounded-full px-1 ${isWholesale
                    ? 'bg-slate-950 text-brand-primary'
                    : 'bg-brand-primary text-slate-950'
                    }`}>
                    {cartItemCount}
                  </span>
                )}
              </div>

              <div className="flex flex-col items-start text-left leading-tight">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-extrabold opacity-90">
                  {cartItemCount === 0 ? 'Pedido' : isWholesale ? 'Mayorista' : 'Mi Pedido'}
                </span>
                {cartItemCount > 0 && (
                  <span className="text-xs sm:text-sm font-black font-mono">
                    ${cartTotal.toFixed(0)}
                  </span>
                )}
              </div>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
