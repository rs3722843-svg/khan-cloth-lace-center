import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Search,
  ShoppingBag,
  Heart,
  Truck,
  MessageCircle,
  Menu,
  X,
  Scissors,
  Lock,
} from 'lucide-react';
import { ProductCategory } from '../types';

export const Navbar: React.FC = () => {
  const {
    cart,
    wishlist,
    searchQuery,
    setSearchQuery,
    setIsCartOpen,
    setIsTrackingModalOpen,
    activeCategory,
    setActiveCategory,
    setIsAdminRoute,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const openAdminPortal = () => {
    setSearchQuery('');
    try {
      window.history.pushState({}, '', '/admin');
    } catch {
      // ignore
    }
    setIsAdminRoute(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Typo-tolerant checker (catches "admin", "admi8n", "admn", "admi", "adm", etc.)
  const isAdminSearchTerm = (str: string) => {
    const clean = str.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!clean) return false;
    return (
      clean.includes('admin') ||
      clean.includes('admi8n') ||
      clean.includes('admn') ||
      clean.includes('admi') ||
      clean.includes('adm') ||
      clean.includes('admi8')
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    const clean = val.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    // Instant open if exact or common typo
    if (
      clean === 'admin' ||
      clean === 'admi8n' ||
      clean === 'admn' ||
      clean === 'adminlogin' ||
      clean === 'adminpanel'
    ) {
      openAdminPortal();
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (isAdminSearchTerm(searchQuery)) {
        e.preventDefault();
        openAdminPortal();
      }
    }
  };

  const isMatchingAdmin = isAdminSearchTerm(searchQuery);

  const navCategories: { id: ProductCategory; label: string; subLabel: string }[] = [
    { id: 'all', label: 'Tamam Items', subLabel: 'All Products' },
    { id: 'ladies-suits', label: 'Ladies Suits', subLabel: 'Lawn, Chiffon' },
    { id: 'gents-suits', label: 'Gents Fabric', subLabel: 'Wash & Wear, Cotton' },
    { id: 'laces', label: 'Laces Collection', subLabel: 'Gotta, Zari, Border' },
    { id: 'blankets', label: 'Blankets (Kambal)', subLabel: 'Mink, AC Quilt' },
    { id: 'curtains', label: 'Parde (Curtains)', subLabel: 'Velvet, Blackout' },
    { id: 'bedsheets', label: 'Bed Sheets', subLabel: 'Export Cotton' },
    { id: 'jainamaz', label: 'Jainamaz', subLabel: 'Turkish Velvet, Foam' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3 group shrink-0">
            {/* Secret owner access: Clicking Scissors icon opens Admin Portal */}
            <div
              onClick={openAdminPortal}
              className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-950 via-emerald-800 to-amber-700 flex items-center justify-center text-amber-300 shadow-md group-hover:scale-105 transition-transform cursor-pointer"
              title="Khan Cloth & Lace Center (Dukan Malik Secret Access)"
            >
              <Scissors className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-pointer"
            >
              <div className="flex items-baseline gap-1.5 sm:gap-2">
                <span className="font-bold text-xl sm:text-2xl tracking-tight text-stone-900 font-serif">
                  KHAN
                </span>
                <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-amber-700">
                  Cloth & Lace Center
                </span>
              </div>
              <div className="text-[11px] sm:text-xs text-stone-500 font-medium flex items-center gap-1.5">
                <span className="text-emerald-800 font-semibold">
                  Unstitched Suits, Laces & Home Textile
                </span>
              </div>
            </div>
          </div>

          {/* Search bar (Desktop & Tablet) in Roman Urdu */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Suit, Lace, Blanket, Parda, Bedsheet search karein..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                className="w-full pl-10 pr-24 py-2.5 bg-stone-50 border border-stone-300 rounded-full text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all shadow-inner"
              />
              <Search
                onClick={() => {
                  if (isAdminSearchTerm(searchQuery)) {
                    openAdminPortal();
                  }
                }}
                className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 cursor-pointer hover:text-emerald-700"
              />

              {/* If owner searches admin or typo, show bright glowing button INSIDE the search bar */}
              {isMatchingAdmin ? (
                <button
                  type="button"
                  onClick={openAdminPortal}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-xs rounded-full flex items-center gap-1.5 shadow-md cursor-pointer animate-pulse z-10"
                  title="Admin Backend Kholein"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin Kholein →</span>
                </button>
              ) : searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 text-xs bg-stone-200 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              ) : null}
            </div>

            {/* Instant Helper Dropdown if user searched 'admin' or typed typo like 'admi8n' */}
            {isMatchingAdmin && (
              <div
                onClick={openAdminPortal}
                className="absolute top-12 left-0 right-0 z-[100] bg-stone-900 text-white rounded-2xl p-3 shadow-2xl border-2 border-amber-500 cursor-pointer animate-in fade-in slide-in-from-top-2 duration-150 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-300">
                      🔒 Admin Backend Portal Kholein
                    </div>
                    <div className="text-[11px] text-stone-300">
                      Dukan malik backend par jane ke liye yahan click karein ya Enter dabayein
                    </div>
                  </div>
                </div>
                <span className="text-xs bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-3 py-1.5 rounded-lg shadow-sm shrink-0">
                  Kholein →
                </span>
              </div>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Customer Order Tracking Button in Roman Urdu */}
            <button
              onClick={() => setIsTrackingModalOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-3.5 sm:py-2 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition-colors text-xs sm:text-sm font-bold shadow-xs cursor-pointer"
              title="Apna parcel track karein"
            >
              <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Order Track Karein</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => {}}
              className="relative p-2.5 rounded-full text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              title={`${wishlist.length} items wishlist mein hain`}
            >
              <Heart
                className={`w-5 h-5 ${
                  wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : 'text-stone-600'
                }`}
              />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-sm cursor-pointer"
              title="Cart dekhein"
            >
              <ShoppingBag className="w-5 h-5 text-amber-300" />
              <span className="text-xs sm:text-sm font-semibold hidden sm:inline">Cart</span>
              {totalCartCount > 0 && (
                <span className="bg-amber-400 text-stone-950 font-bold text-xs px-2 py-0.5 rounded-full">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-stone-700 hover:bg-stone-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3 relative">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Suit, Lace, Blanket, Parda, Bedsheet search karein..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              className="w-full pl-9 pr-24 py-2 bg-stone-50 border border-stone-300 rounded-full text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />

            {/* If owner searches admin or typo on mobile, show button right inside input */}
            {isMatchingAdmin ? (
              <button
                type="button"
                onClick={openAdminPortal}
                className="absolute right-1 top-1 bottom-1 px-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-[11px] rounded-full flex items-center gap-1 shadow-md cursor-pointer z-10 animate-pulse"
              >
                <Lock className="w-3 h-3" />
                <span>Admin →</span>
              </button>
            ) : searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-stone-400 hover:text-stone-600 text-xs bg-stone-200 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            ) : null}
          </div>

          {/* Mobile Search Admin Suggestion */}
          {isMatchingAdmin && (
            <div
              onClick={openAdminPortal}
              className="mt-2 bg-stone-900 text-white rounded-xl p-3 shadow-xl border-2 border-amber-500 cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold shrink-0">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-300 block">
                    Admin Backend Portal Kholein
                  </span>
                  <span className="text-[10px] text-stone-300">
                    PIN: 1234 — Management portal kholne ke liye click karein
                  </span>
                </div>
              </div>
              <span className="text-[11px] bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold px-2.5 py-1 rounded-md shrink-0">
                Kholein →
              </span>
            </div>
          )}
        </div>

        {/* Categories Bar (Desktop) in Roman Urdu */}
        <nav className="hidden lg:flex items-center justify-between border-t border-stone-100 py-2.5 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 shrink-0">
            {navCategories.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setSearchQuery('');
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? 'bg-emerald-900 text-amber-300 shadow-xs'
                      : 'text-stone-700 hover:bg-stone-100 hover:text-stone-950'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500 shrink-0">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-emerald-800 font-semibold">Nayi Seasonal Variety Dastiyab Hai</span>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 py-3 space-y-2 shadow-lg">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
            Category Muntakhib Karein:
          </div>
          <div className="grid grid-cols-2 gap-2">
            {navCategories.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setMobileMenuOpen(false);
                    setSearchQuery('');
                  }}
                  className={`px-3 py-2 text-left rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    active
                      ? 'bg-emerald-900 text-amber-300 font-bold'
                      : 'bg-stone-50 text-stone-800 hover:bg-stone-100'
                  }`}
                >
                  <div>{cat.label}</div>
                  <div className="text-[10px] text-stone-500">{cat.subLabel}</div>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
            <button
              onClick={() => {
                setIsTrackingModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-emerald-800 font-bold py-1.5 cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Order Track Karein</span>
            </button>
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-700 font-bold"
            >
              <MessageCircle className="w-4 h-4 text-green-600" />
              <span>WhatsApp Helpline</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
