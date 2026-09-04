import React from 'react';
import { MessageCircle } from 'lucide-react';
import { DEFAULT_WHATSAPP_PHONE } from '../data/mockProducts';
import { WhatsAppIcon } from './Icons';

interface WhatsAppFloatingButtonProps {
  cartItemCount: number;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({ cartItemCount }) => {
  return (
    <aside aria-label="Contacto por WhatsApp" className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2">
      <a
        href="https://whatsapp.com/channel/0029Vb7RtomDZ4LQyRTqzJ1J"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-brand-success hover:bg-brand-success text-slate-950 font-black text-xs shadow-xl shadow-brand-success/20 hover:scale-105 active:scale-95 transition-all duration-200"
        title="Únete a nuestro canal de WhatsApp"
      >
        <div className="relative">
          <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping" />
        </div>
        <span className="hidden sm:inline font-bold tracking-tight">Canal de WhatsApp</span>
      </a>
    </aside>
  );
};
