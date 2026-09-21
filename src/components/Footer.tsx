import React from 'react';
import { ShieldCheck, Truck, CreditCard, MapPin, Navigation, Instagram, Facebook } from 'lucide-react';
import { FlashLogo } from './FlashLogo';
import { WhatsAppIcon, TikTokIcon } from './Icons';
import { Sparkles } from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  onOpenSizeGuide: () => void;
  onOpenWholesaleInfo: () => void;
  settings: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSizeGuide, onOpenWholesaleInfo, settings }) => {
  const stores = settings.stores || [];
  const channelUrl = settings.whatsappChannelUrl;
  const socials = [
    { href: settings.instagramUrl, icon: <Instagram className="w-4 h-4" />, label: 'Instagram' },
    { href: settings.tiktokUrl, icon: <TikTokIcon className="w-4 h-4" />, label: 'TikTok' },
    { href: settings.facebookUrl, icon: <Facebook className="w-4 h-4" />, label: 'Facebook' },
  ].filter(s => s.href);

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80 pt-10 pb-8 text-slate-500 dark:text-slate-400 text-xs transition-colors duration-200">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">

        {/* Main Footer Links */}
        <div className="py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-slate-500 dark:text-slate-400">

          <div className="space-y-2">
            <FlashLogo size="sm" showSubtitle={true} className="items-start" />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-2">
              Plataforma de comercio electrónico versátil y moderna para cualquier rubro. Gestión profesional de inventario y ventas para negocios de todos los tamaños.
            </p>
          </div>

          {/* <div>
            <h5 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2.5">Ayuda & Guías</h5>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button onClick={onOpenSizeGuide} className="hover:text-brand-primary transition-colors">
                  • Guía de Tallas y Medidas
                </button>
              </li>
              <li>
                <button onClick={onOpenWholesaleInfo} className="hover:text-brand-primary transition-colors">
                  • Tarifas Mayoristas (3+ piezas)
                </button>
              </li>
              <li>
                <span className="text-slate-400">• Versión Fan vs Versión Jugador</span>
              </li>
            </ul>
          </div> */}

          {/* Sedes Físicas */}
          <div>
            <h5 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-primary" />
              Nuestras Tiendas
            </h5>
            <div className="space-y-3">
              {stores.map((loc, i) => (
                <div key={loc.id || i} className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <p className="font-bold text-slate-900 dark:text-white text-[11px]">{loc.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">{loc.address}</p>
                  <p className="text-[10px] text-brand-primary font-medium">{loc.hours}</p>
                  <a
                    href={loc.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-success dark:text-brand-success hover:underline mt-1"
                  >
                    <Navigation className="w-3 h-3" />
                    Cómo llegar
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Contacto WhatsApp */}
          <div>
            {channelUrl && (
              <>
                <h5 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2.5">Contacto & Canal</h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                  Únete a nuestro canal para ver novedades, ofertas y nuevos modelos al instante.
                </p>
                <a
                  href={channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-success hover:bg-brand-success text-white text-xs font-bold transition-colors shadow-sm shadow-brand-success/20 mb-3"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  <span>Unirse al Canal de WhatsApp</span>
                </a>
              </>
            )}
            {stores.length > 0 && (
              <p className="text-[10px] text-slate-400 mt-1">
                📍 {stores[0].name}
              </p>
            )}
          </div>

        </div>

        {/* Bottom copyright & Socials */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-900 flex flex-col items-center gap-4 text-[11px]">
          {/* Redes Sociales */}
          {socials.length > 0 && (
            <div className="flex items-center gap-4">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 dark:bg-slate-900 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400 hover:text-brand-primary" aria-label={s.label}>
                  {s.icon}
                </a>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-2 text-slate-400">
            <p>© {new Date().getFullYear()} Hector Hernandez • Todos los derechos reservados.</p>
            <p className="flex items-center gap-1">
              <span>Desarrollado por</span>
              <a href="https://hectorah.github.io/PORTAFOLIO/" target="_blank" rel="noopener noreferrer" className="font-bold text-slate-900 dark:text-white hover:text-brand-primary transition-colors">Héctor Hernández</a>
              <Sparkles className="w-3 h-3 text-brand-primary ml-1" />
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};
