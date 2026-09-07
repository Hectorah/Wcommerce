import React, { useState, useEffect, useRef } from 'react';
import { Tag, Sparkles, TrendingUp, Truck, ShieldCheck, Zap, ArrowRight, Volume2, VolumeX, CreditCard } from 'lucide-react';
import { FlashLogo } from './FlashLogo';
import { WHOLESALE_MIN_ITEMS } from '../data/mockProducts';
import { SiteSettings } from '../types';

interface HeroProps {
  cartItemCount: number;
  isWholesale: boolean;
  onOpenWholesaleModal: () => void;
  onOpenSizeGuide: () => void;
  settings?: SiteSettings;
}

// Typewriter Hook
function useTypewriter(text: string, speed = 55, delay = 400) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return { displayed, done };
}

export const Hero: React.FC<HeroProps> = ({
  cartItemCount,
  isWholesale,
  onOpenWholesaleModal,
  onOpenSizeGuide,
  settings,
}) => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };
  const itemsLeft = Math.max(0, WHOLESALE_MIN_ITEMS - cartItemCount);
  const progressPercent = Math.min(100, (cartItemCount / WHOLESALE_MIN_ITEMS) * 100);

  const titleLine1 = 'Catálogo Oficial';
  const titleLine2 = 'Portal de Compras';
  const { displayed: typed1, done: done1 } = useTypewriter(titleLine1, 50, 300);
  const { displayed: typed2, done: done2 } = useTypewriter(titleLine2, 50, done1 ? 100 : 99999);

  return (
    <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      
      {/* Background accent blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-b from-brand-primary/20 via-brand-primary/20 to-transparent blur-3xl pointer-events-none -z-0" />
      <div className="absolute -top-16 -right-16 w-72 h-72 bg-brand-primary/20 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-brand-success/5 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="relative z-10 max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        
        {/* Two-column layout on large screens */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 py-10 sm:py-14 lg:py-16">

          {/* LEFT COLUMN — Headline + Branding */}
          <div className="flex-1 text-center lg:text-left space-y-5">

            {/* Logo Badge */}
            <div className="inline-block p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <FlashLogo size="md" showSubtitle={true} />
            </div>

            {/* Typewriter Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-950 dark:text-white tracking-tight leading-tight min-h-[4em] sm:min-h-[3em] lg:min-h-[2.5em]">
              <span>{typed1}</span>
              {!done1 && (
                <span className="inline-block w-0.5 h-[1em] bg-slate-950 dark:bg-white ml-0.5 animate-pulse align-middle" />
              )}
              {done1 && (
                <>
                  {' '}
                  <br className="hidden sm:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-primary to-yellow-500">
                    {typed2}
                  </span>
                  {!done2 && (
                    <span className="inline-block w-0.5 h-[0.85em] bg-brand-primary ml-0.5 animate-pulse align-middle" />
                  )}
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Selecciona tus modelos favoritos, calcula tu tarifa al detal o mayorista en tiempo real y envía tu pedido directo a WhatsApp.
            </p>

            {/* Assurances row (Value Pillars) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-left pt-4 mt-4 w-full">
              <div className="bg-white dark:bg-slate-900/60 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-3 w-full text-center sm:text-left">
                <div className="p-2 rounded-lg bg-brand-primary/20 text-brand-primary border border-brand-primary/20 flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-0.5">La Mejor Calidad</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs hidden sm:block">Bordados y estampados oficiales.</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900/60 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-3 w-full text-center sm:text-left">
                <div className="p-2 rounded-lg bg-brand-primary/20 text-brand-primary border border-brand-primary/20 flex-shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-0.5">Envíos Rápidos</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs hidden sm:block">Despachos nacionales diarios.</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900/60 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-3 w-full text-center sm:text-left">
                <div className="p-2 rounded-lg bg-brand-primary/20 text-brand-primary border border-brand-primary/20 flex-shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-0.5">Pagos Flexibles</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs hidden sm:block">Bs, Zelle, USDT y Efectivo.</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — Phone Mockup (TikTok Video) */}
          <div className="w-full lg:w-auto lg:min-w-[440px] xl:min-w-[520px] flex justify-center">
            {settings?.heroVideoUrl ? (
              <div className="relative w-[280px] sm:w-[320px] aspect-[9/19.5] bg-black rounded-[3rem] shadow-2xl overflow-hidden border-[8px] border-slate-900 ring-4 ring-slate-800 flex-shrink-0">
                {/* Notch */}
                <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20 pointer-events-none">
                  <div className="w-24 h-5 bg-slate-900 rounded-b-xl" />
                </div>
                
                {/* Video Player */}
                <video 
                  ref={videoRef}
                  src={settings.heroVideoUrl}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                {/* Volume Toggle */}
                <button
                  onClick={toggleMute}
                  className="absolute bottom-4 right-4 p-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white rounded-full transition-colors z-30"
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>
            ) : (
              <div className="relative w-[280px] sm:w-[320px] aspect-[9/19.5] bg-slate-100 dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border-[8px] border-slate-900 ring-4 ring-slate-800 flex items-center justify-center text-center p-6">
                <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20 pointer-events-none">
                  <div className="w-24 h-5 bg-slate-900 rounded-b-xl" />
                </div>
                <div>
                  <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-500">Video no configurado</p>
                  <p className="text-xs text-slate-400 mt-2">Puedes añadir un video de TikTok desde el Panel de Administración.</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
