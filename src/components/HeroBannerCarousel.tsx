import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HomeBanner } from '../types';

interface HeroBannerCarouselProps {
  banners: HomeBanner[];
}

const AUTOPLAY_MS = 5000;

export function HeroBannerCarousel({ banners }: HeroBannerCarouselProps) {
  const active = banners.filter(b => b.active && b.image);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Reiniciar al cambiar la lista
  useEffect(() => {
    setIndex(0);
  }, [active.length]);

  // Auto-avance
  useEffect(() => {
    if (paused || active.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex(prev => (prev + 1) % active.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, active.length]);

  const goTo = useCallback((i: number) => {
    if (active.length === 0) return;
    setIndex((i + active.length) % active.length);
  }, [active.length]);

  if (active.length === 0) return null;

  const banner = active[index];

  return (
    <section
      className="max-w-[1920px] mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-6 sm:pt-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 bg-slate-900 min-h-[240px] sm:min-h-[320px]">
        <img
          src={banner.image}
          alt={banner.title || 'Banner promocional'}
          className="absolute inset-0 w-full h-full object-fill"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Contenido */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-10 sm:py-14 min-h-[240px] sm:min-h-[320px]">
          {banner.title && (
            <h3 className="text-2xl sm:text-4xl font-black text-white drop-shadow-lg">{banner.title}</h3>
          )}
          {banner.subtitle && (
            <p className="mt-2 text-sm sm:text-base text-white/90 max-w-xl drop-shadow">{banner.subtitle}</p>
          )}
          {banner.link && banner.ctaText && (
            <a
              href={banner.link}
              target={banner.link.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="mt-5 px-6 py-2.5 bg-brand-primary hover:opacity-90 text-white rounded-xl font-black text-sm shadow-lg transition-all hover:scale-105"
            >
              {banner.ctaText}
            </a>
          )}
        </div>

        {/* Flechas */}
        {active.length > 1 && (
          <>
            <button
              onClick={() => goTo(index - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors z-20"
              aria-label="Banner anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => goTo(index + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors z-20"
              aria-label="Banner siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Puntos */}
        {active.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5 z-20">
            {active.map((b, i) => (
              <button
                key={b.id}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`}
                aria-label={`Ir al banner ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}