import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Sparkles,
  Truck,
  ShieldCheck,
  RefreshCcw,
  ArrowRight,
  Scissors,
  Flame,
} from 'lucide-react';
import { ProductCategory } from '../types';

export const HeroBanner: React.FC = () => {
  const { setActiveCategory } = useStore();

  const quickCategories: {
    id: ProductCategory;
    title: string;
    subTitle: string;
    image: string;
    tag: string;
  }[] = [
    {
      id: 'ladies-suits',
      title: 'Ladies Suits',
      subTitle: 'Unstitched Suit',
      image:
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      tag: 'Lawn, Chiffon & Silk',
    },
    {
      id: 'gents-suits',
      title: 'Gents Fabric',
      subTitle: 'Mardana Kapra',
      image:
        'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=600&q=80',
      tag: 'Wash & Wear, Cotton, Boski',
    },
    {
      id: 'laces',
      title: 'Laces Collection',
      subTitle: 'Fancy Laces o Gotta',
      image:
        'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=600&q=80',
      tag: 'Zari, Gotta Patti, Borders',
    },
    {
      id: 'blankets',
      title: 'Blankets (Kambal)',
      subTitle: 'Mink o Fluffy Kambal',
      image:
        'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
      tag: '2-Ply Mink & AC Blankets',
    },
    {
      id: 'curtains',
      title: 'Parde (Curtains)',
      subTitle: 'Velvet o Blackout',
      image:
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
      tag: 'Velvet & Eyelet Pairs',
    },
    {
      id: 'bedsheets',
      title: 'Bed Sheets',
      subTitle: 'Cotton Bed Sets',
      image:
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
      tag: '100% Export Cotton Sets',
    },
    {
      id: 'jainamaz',
      title: 'Jainamaz',
      subTitle: 'Turkish o Memory Foam',
      image:
        'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=600&q=80',
      tag: 'Turkish Velvet & Soft Foam',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-emerald-950 to-stone-900 text-white pt-8 pb-12 sm:pt-12 sm:pb-16">
      <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Hero Text Banner in Roman Urdu */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-500/30 text-amber-300 text-xs sm:text-sm font-semibold shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Khan Cloth & Lace Center — Pakistan Ka Behtareen Online Markaz</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight font-serif">
              Aala Mayaar Ka Kapra, Fancy Laces <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                Aur Premium Home Textile
              </span>
            </h1>

            <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Ladies aur Gents ke unstitched suit, laces ki tamam variety (Gotta Kinari, Resham Zari, Crochet), imported kambal, shahi parde, export cotton bedsheets aur Turkish jainamaz — seedha factory rate par ghar bethe hasil karein.
            </p>

            {/* Value Highlights */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 text-xs sm:text-sm text-stone-200">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg backdrop-blur-xs">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Cash on Delivery (COD)</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg backdrop-blur-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Asal Kapray Ki Guarantee</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg backdrop-blur-xs">
                <RefreshCcw className="w-4 h-4 text-amber-400 shrink-0" />
                <span>7 Din Mein Tabdeeli Ki Sahulat</span>
              </div>
            </div>

            {/* Quick Action Buttons in Roman Urdu */}
            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                onClick={() => {
                  setActiveCategory('ladies-suits');
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-sm hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-900/30 flex items-center gap-2 cursor-pointer"
              >
                <span>Ladies Variety Dekhein</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setActiveCategory('gents-suits');
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-full bg-emerald-900/90 hover:bg-emerald-800 text-white border border-emerald-600/40 font-bold text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Mardana Fabric Collection</span>
                <Scissors className="w-4 h-4 text-amber-300" />
              </button>

              <button
                onClick={() => {
                  setActiveCategory('laces');
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-3 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-200 border border-stone-600/40 font-medium text-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Flame className="w-4 h-4 text-rose-400" />
                <span>Fancy Laces (9 Gaz Rolls)</span>
              </button>
            </div>
          </div>

          {/* Featured Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-2xl overflow-hidden bg-stone-800/90 border border-amber-500/30 p-3 shadow-2xl backdrop-blur-md">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
                  alt="Khan Cloth Center Fabric"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent" />
                <div className="absolute top-3 left-3 bg-rose-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Khas Eid o Shadi Edition
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
                  <div className="text-xs text-amber-300 font-semibold">
                    Khan Cloth & Lace Center Ki Nayi Variety
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug">
                    Premium Lawn, Boski, Zari Gotta Laces aur Imported Kambal
                  </h3>
                  <div className="flex items-center justify-between text-xs text-stone-300 pt-1 border-t border-white/10">
                    <span>Poore Pakistan Mein Home Delivery</span>
                    <span className="text-amber-400 font-bold">2 se 4 Din Mein Dispatch</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Quick Strip */}
        <div className="mt-10 pt-6 border-t border-white/10">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-300/80 mb-3 text-center sm:text-left">
            Category Muntakhib Karein (Select Category):
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
            {quickCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setActiveCategory(c.id);
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative rounded-xl overflow-hidden bg-stone-800/80 border border-white/10 hover:border-amber-400/60 p-2.5 transition-all hover:-translate-y-0.5 text-left flex flex-col justify-between cursor-pointer"
              >
                <div className="aspect-[4/3] rounded-lg overflow-hidden mb-2 bg-stone-900">
                  <img
                    src={c.image}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                    {c.title}
                  </div>
                  <div className="text-[11px] text-emerald-300 font-medium truncate leading-tight">
                    {c.subTitle}
                  </div>
                  <div className="text-[10px] text-stone-400 truncate mt-0.5">
                    {c.tag}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
