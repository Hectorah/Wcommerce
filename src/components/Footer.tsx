import React from 'react';
import { ShieldCheck, Truck, CreditCard, MapPin, Navigation, Instagram, Facebook } from 'lucide-react';
import { DEFAULT_WHATSAPP_PHONE, STORE_NAME } from '../data/mockProducts';
import { FlashLogo } from './FlashLogo';
import { WhatsAppIcon, TikTokIcon } from './Icons';
import { Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenSizeGuide: () => void;
  onOpenWholesaleInfo: () => void;
}

const STORE_LOCATIONS = [
  {
    name: 'CC Cristal — Naguanagua',
    address: '2do Piso, CC Cristal, Naguanagua, Carabobo',
    mapsUrl: 'https://www.google.com/maps/search/CC+Cristal+Naguanagua+Carabobo+Venezuela',
    hours: 'Lun–Sáb: 9am – 7pm',
  },
];

export const Footer: React.FC<FooterProps> = ({ onOpenSizeGuide, onOpenWholesaleInfo }) => {
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
              {STORE_LOCATIONS.map((loc, i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
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
            <h5 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2.5">Contacto & Canal</h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              Únete a nuestro canal para ver novedades, ofertas y nuevos modelos al instante.
            </p>
            <a
              href="https://whatsapp.com/channel/0029Vb7RtomDZ4LQyRTqzJ1J"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-success hover:bg-brand-success text-white text-xs font-bold transition-colors shadow-sm shadow-brand-success/20 mb-3"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>Unirse al Canal de WhatsApp</span>
            </a>
            <p className="text-[10px] text-slate-400 mt-1">
              📍 CC Cristal 2do Piso, Naguanagua
            </p>
          </div>

        </div>

        {/* Bottom copyright & Socials */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-900 flex flex-col items-center gap-4 text-[11px]">
          {/* Redes Sociales */}
          <div className="flex items-center gap-4">
            <a href="#" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 dark:bg-slate-900 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400 hover:text-brand-primary">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 dark:bg-slate-900 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400 hover:text-brand-primary">
              <TikTokIcon className="w-4 h-4" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 dark:bg-slate-900 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400 hover:text-brand-primary">
              <Facebook className="w-4 h-4" />
            </a>
          </div>

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
