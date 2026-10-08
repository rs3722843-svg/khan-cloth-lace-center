import React from 'react';
import { useStore } from '../context/StoreContext';
import { MessageCircle, Truck, Sparkles, Lock } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { settings, setIsAdminRoute } = useStore();

  const handleAdminClick = () => {
    try {
      window.history.pushState({}, '', '/admin');
    } catch {
      // ignore
    }
    setIsAdminRoute(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside aria-label="Announcement" className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 text-amber-200 text-xs sm:text-sm py-2 px-4 shadow-inner border-b border-amber-600/30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2 font-medium overflow-hidden">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
          <span className="truncate">{settings.announcement}</span>
        </div>

        <div className="flex items-center gap-4 text-xs shrink-0 text-stone-200">
          <div className="flex items-center gap-1.5 hidden md:flex text-emerald-300">
            <Truck className="w-3.5 h-3.5" />
            <span>Poore Pakistan Mein Cash on Delivery (COD)</span>
          </div>
          <span className="hidden md:inline text-stone-600">|</span>
          <a
            href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-amber-300 hover:text-amber-100 transition-colors font-semibold"
          >
            <MessageCircle className="w-3.5 h-3.5 text-green-400" />
            <span>WhatsApp Helpline: {settings.phone}</span>
          </a>

          {/* Discreet Malik Portal Lock */}
          <button
            onClick={handleAdminClick}
            title="Dukan Malik Portal (PIN: 1234)"
            className="opacity-40 hover:opacity-100 text-amber-300 hover:text-amber-100 transition-all p-1 cursor-pointer flex items-center gap-1"
          >
            <Lock className="w-3 h-3" />
            <span className="text-[10px] hidden lg:inline">Malik Portal</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
