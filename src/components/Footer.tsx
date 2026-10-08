import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Scissors,
  Phone,
  MessageCircle,
  MapPin,
  Truck,
  ShieldCheck,
  RefreshCcw,
} from 'lucide-react';
import { ProductCategory } from '../types';

export const Footer: React.FC = () => {
  const {
    settings,
    setActiveCategory,
    setIsTrackingModalOpen,
    setIsAdminRoute,
  } = useStore();

  // Hidden Keyboard shortcut for owner: Alt + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && (e.key === 'a' || e.key === 'A')) || (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a'))) {
        e.preventDefault();
        try {
          window.history.pushState({}, '', '/admin');
        } catch {
          // ignore
        }
        setIsAdminRoute(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsAdminRoute]);

  const footerLinks: { id: ProductCategory; label: string; sub: string }[] = [
    { id: 'ladies-suits', label: 'Ladies Unstitched Suits', sub: 'Lawn, Chiffon, Linen' },
    { id: 'gents-suits', label: 'Gents Fabric Collection', sub: 'Wash & Wear, Cotton, Boski' },
    { id: 'laces', label: 'Fancy Laces & Borders', sub: 'Zari, Gotta Patti, Cutwork' },
    { id: 'blankets', label: '2-Ply Mink Blankets', sub: 'Mink o Fluffy Kambal' },
    { id: 'curtains', label: 'Luxury Velvet Curtains', sub: 'Velvet o Blackout Parde' },
    { id: 'bedsheets', label: '100% Export Bed Sheets', sub: 'King Size Cotton Sets' },
    { id: 'jainamaz', label: 'Turkish Velvet Jainamaz', sub: 'Makhmali o Memory Foam' },
  ];

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Trust Pillars Strip in Roman Urdu */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-12 border-b border-stone-800 text-stone-200">
          <div className="flex items-center gap-4 bg-stone-900/60 p-4 rounded-2xl border border-stone-800/80">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Cash on Delivery (COD)</h4>
              <p className="text-xs text-stone-400">
                Poore Pakistan mein delivery, parcel milne par payment karein.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-stone-900/60 p-4 rounded-2xl border border-stone-800/80">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">100% Asal Kapray Ki Guarantee</h4>
              <p className="text-xs text-stone-400">
                Rang aur fabric ki mukammal tasalli, aala quality laces o kapra.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-stone-900/60 p-4 rounded-2xl border border-stone-800/80">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <RefreshCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">7 Din Mein Aasan Tabdeeli</h4>
              <p className="text-xs text-stone-400">
                Kharabi ya pasand na aane par 7 din mein aasan exchange.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-950 via-emerald-800 to-amber-700 flex items-center justify-center text-amber-300 shadow-md">
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-lg text-white font-serif block leading-none">
                  KHAN
                </span>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  Cloth & Lace Center
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Khan Cloth & Lace Center — Pakistan mein unstitched suits, fancy laces, imported kambal, parde, bedsheets aur Turkish jainamaz ka mohtabar markaz.
            </p>

            <div className="space-y-1 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{settings.address}</span>
              </div>
            </div>
          </div>

          {/* Catalog Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Hamari Variety (Categories)
            </h4>
            <ul className="space-y-2 text-xs">
              {footerLinks.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveCategory(item.id);
                      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-stone-400 hover:translate-x-1 duration-200 cursor-pointer text-left"
                  >
                    <span>• {item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service & Tracking */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Customer Services & Tracking
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => setIsTrackingModalOpen(true)}
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-950/90 hover:bg-emerald-900 text-amber-300 font-bold border border-emerald-800 flex items-center gap-2 transition-all w-full justify-center shadow-xs cursor-pointer"
                >
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>Order Track Karein (Tracking)</span>
                </button>
              </li>

              <li className="pt-2">
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Helpline: {settings.phone}</span>
                </a>
              </li>

              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-stone-500" />
                <span>Subah 10:00 AM se Raat 10:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Delivery Coverage Map Snippet */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Delivery Network
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta samait Pakistan ke tamam shehron aur dehaton mein tez tareen parcel delivery بذریعہ TCS, Leopards aur Trax.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-stone-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Cash on Delivery Booking 24/7 Faal Hai</span>
            </div>
          </div>
        </div>

        {/* Clean, Prestigious Bottom Bar: Completely Clean (NO Admin button shown to public) */}
        <div className="pt-8 mt-4 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} Khan Cloth & Lace Center. Tamam huqooq mehfooz hain.
          </div>

          <div className="flex items-center gap-4 text-[11px] text-stone-600">
            <span>Pakistani Certified Fabric Retailer</span>
            <span>•</span>
            <span>Nationwide COD Network</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
