import React, { useState, useMemo } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AdminPortalPage } from './components/AdminPortalPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import {
  MessageCircle,
  Truck,
  Sparkles,
  ShoppingBag,
  RotateCcw,
  Lock,
} from 'lucide-react';

const StoreContent: React.FC = () => {
  const {
    products,
    activeCategory,
    searchQuery,
    setSearchQuery,
    setActiveCategory,
    setIsTrackingModalOpen,
    settings,
    isAdminRoute,
    setIsAdminRoute,
  } = useStore();

  const [sortBy, setSortBy] = useState<string>('featured');

  // Check if search matches admin keyword or typos like 'admi8n'
  const isSearchMatchingAdmin = useMemo(() => {
    const clean = searchQuery.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!clean) return false;
    return (
      clean.includes('admin') ||
      clean.includes('admi8n') ||
      clean.includes('admn') ||
      clean.includes('admi') ||
      clean.includes('adm')
    );
  }, [searchQuery]);

  const openAdmin = () => {
    setSearchQuery('');
    try {
      window.history.pushState({}, '', '/admin');
    } catch {
      // ignore
    }
    setIsAdminRoute(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If URL is /admin or owner triggered admin shortcut, show dedicated Backend Portal
  if (isAdminRoute) {
    return (
      <ErrorBoundary
        fallbackTitle="Admin Portal Load Hone Mein Masla Aaya"
        onReset={() => {
          setIsAdminRoute(false);
          try {
            window.history.pushState({}, '', '/');
          } catch {
            // ignore
          }
        }}
      >
        <AdminPortalPage />
      </ErrorBoundary>
    );
  }

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchCategory =
          activeCategory === 'all' || p.category === activeCategory;

        if (!searchQuery.trim()) return matchCategory;
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchRomanUrdu = (p.titleRomanUrdu || '').toLowerCase().includes(q);
        const matchFabric = p.fabric.toLowerCase().includes(q);
        const matchCategoryName = p.categoryName.toLowerCase().includes(q);

        return matchCategory && (matchTitle || matchRomanUrdu || matchFabric || matchCategoryName);
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      });
  }, [products, activeCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans-modern selection:bg-amber-200 selection:text-stone-900">
      {/* Top announcement */}
      <AnnouncementBar />

      {/* Main Navbar */}
      <Navbar />

      {/* If owner searched 'admin', 'admi8n', or typo, show prominent Admin Portal Access Card right at the top */}
      {isSearchMatchingAdmin ? (
        <section className="bg-stone-900 border-b-2 border-amber-500 py-10 px-4 text-white">
          <div className="max-w-xl mx-auto bg-stone-950 p-6 sm:p-8 rounded-3xl border border-amber-500/80 shadow-2xl text-center space-y-5 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-stone-950 mx-auto flex items-center justify-center font-bold shadow-lg">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-serif text-amber-300">
                Admin Backend Portal
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Aapne search bar mein &ldquo;<strong>{searchQuery}</strong>&rdquo; likha hai. Dukan ka backend management portal kholne ke liye neechay button dabayein:
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={openAdmin}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105"
              >
                <Lock className="w-4 h-4" />
                <span>Admin Backend Kholein (PIN: 1234) →</span>
              </button>

              <button
                onClick={() => setSearchQuery('')}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold cursor-pointer"
              >
                Cancel / Wapis Store
              </button>
            </div>

            <div className="text-[11px] text-stone-400 border-t border-stone-800 pt-3 flex items-center justify-center gap-2">
              <span>💡 Default PIN: <strong className="text-amber-400">1234</strong></span>
              <span>•</span>
              <span>Items ki qeemat, stock aur customer orders manage karein</span>
            </div>
          </div>
        </section>
      ) : (
        /* Normal Hero Showcase */
        <HeroBanner />
      )}

      {/* Main Catalog Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full">
        {/* Category pills & sorting controls */}
        <CategoryFilter
          sortBy={sortBy}
          setSortBy={setSortBy}
          filteredCount={filteredProducts.length}
        />

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : isSearchMatchingAdmin ? (
          /* When owner searches 'admin', 'admi8n', or any typo, show direct portal card */
          <div className="text-center py-12 bg-stone-900 text-white rounded-3xl border border-amber-500/80 p-6 sm:p-10 space-y-5 shadow-2xl max-w-lg mx-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-stone-950 mx-auto flex items-center justify-center font-bold shadow-lg">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-amber-300">
                Admin Backend Portal
              </h3>
              <p className="text-xs text-stone-300 max-w-md mx-auto leading-relaxed">
                Aapne search bar mein &ldquo;<strong>{searchQuery}</strong>&rdquo; likha hai. Dukan ka backend management portal kholne ke liye neechay button dabayein:
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={openAdmin}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-xl flex items-center justify-center gap-2 mx-auto cursor-pointer transition-all hover:scale-105"
              >
                <Lock className="w-4 h-4" />
                <span>Admin Backend Login Kholein (PIN: 1234) →</span>
              </button>
            </div>
            <div className="text-[11px] text-stone-400 border-t border-stone-800 pt-3">
              💡 Yeh screen sirf dukan malik ke liye hai.
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8 space-y-5 shadow-xs max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-stone-900 font-serif">
                Koi Product Nahi Mila (No Products Found)
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Aapki talash &ldquo;{searchQuery}&rdquo; ke mutabiq koi item nahi mila. Kisi aur naam se search karein ya tamam items dekhein.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="px-5 py-2.5 rounded-full bg-emerald-900 hover:bg-emerald-800 text-amber-300 text-xs font-bold transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Tamam Variety Dobara Dekhein</span>
            </button>

            {/* In case of typo, discreet admin link for the owner */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-center gap-2 text-xs text-stone-400">
              <span>Dukan ke malik hain?</span>
              <button
                onClick={openAdmin}
                className="text-amber-700 hover:text-amber-800 font-bold underline cursor-pointer"
              >
                Admin Login Portal Kholein
              </button>
            </div>
          </div>
        )}

        {/* Mid-page Showcase Banner */}
        <div className="mt-16 rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 text-white p-6 sm:p-10 shadow-xl border border-amber-600/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Wholesale & Retail Supply</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif leading-tight">
              Kya aapko shadi biyah, boutique ya dukan ke liye laces aur suits thaan ke hisaab se chahiyein?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-medium">
              Khan Cloth & Lace Center par wholesale customers, boutiques aur darziyon ke liye khas discount dastiyab hai. Poore Pakistan mein delivery.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                'Assalam-o-Alaikum! Main Khan Cloth Center se wholesale laces/kapray ki tafseelat maloom karna chahta hoon.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-stone-950 fill-stone-950" />
              <span>Wholesale WhatsApp Rabta</span>
            </a>

            <button
              onClick={() => setIsTrackingModalOpen(true)}
              className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-amber-200 border border-white/20 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Truck className="w-4 h-4 text-amber-300" />
              <span>Order Track Karein</span>
            </button>
          </div>
        </div>
      </main>

      {/* Floating Action Button for Quick WhatsApp Help */}
      <aside aria-label="Customer Support and Order Tracking">
        <a
          href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 transition-all border-2 border-white/40 cursor-pointer"
          title="Khan Cloth Center se WhatsApp par rabta karein"
        >
          <MessageCircle className="w-6 h-6 fill-white" />
          <span className="hidden sm:inline font-bold text-xs">WhatsApp Rabta</span>
        </a>

        {/* Floating Quick Track Parcel Button on Left */}
        <button
          onClick={() => setIsTrackingModalOpen(true)}
          className="fixed bottom-6 left-6 z-40 bg-stone-900/90 hover:bg-stone-900 backdrop-blur-md text-amber-300 px-4 py-3 rounded-full shadow-xl flex items-center gap-2 border border-amber-500/30 text-xs font-bold hover:scale-105 transition-all cursor-pointer"
          title="Apna parcel track karein"
        >
          <Truck className="w-4 h-4 text-amber-400" />
          <span>Order Tracking</span>
        </button>
      </aside>

      {/* Customer Modals */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderConfirmationModal />
      <OrderTrackingModal />

      {/* Public Store Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <StoreContent />
      </StoreProvider>
    </ErrorBoundary>
  );
}
