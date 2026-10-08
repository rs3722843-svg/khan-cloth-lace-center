import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  ShoppingBag,
  MessageCircle,
  Truck,
  ShieldCheck,
  RefreshCcw,
  CheckCircle2,
  Star,
  Plus,
  Minus,
  Heart,
  Share2,
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductForDetail,
    setSelectedProductForDetail,
    addToCart,
    toggleWishlist,
    isWishlisted,
    settings,
    setIsCheckoutModalOpen,
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!selectedProductForDetail) return null;

  const product = selectedProductForDetail;
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setSelectedProductForDetail(null);
    setIsCheckoutModalOpen(true);
  };

  const handleWhatsAppOrder = () => {
    const phone = settings.whatsapp.replace(/\D/g, '');
    const text = encodeURIComponent(
      `Assalam-o-Alaikum! Main Khan Cloth & Lace Center se yeh product order karna chahta hoon:\n\n*Product:* ${product.titleRomanUrdu || product.title}\n*Tadad:* ${quantity} ${product.unit}\n*Kul Raqam:* Rs. ${(product.price * quantity).toLocaleString()}\n*Item Code:* ${product.id}\n\nMeherbani farma kar Cash on Delivery address aur delivery schedule batayein. Shukriya!`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div
        className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header / Close button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/80">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-semibold">
            <span className="uppercase tracking-wider text-amber-800">
              {product.categoryName}
            </span>
            <span>•</span>
            <span className="text-stone-700">{product.unit}</span>
          </div>
          <button
            onClick={() => setSelectedProductForDetail(null)}
            className="w-8 h-8 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 flex-1">
          {/* Images Gallery */}
          <div className="space-y-3">
            <div className="aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-inner relative">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 bg-emerald-900 text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-emerald-800 ring-2 ring-emerald-800/20'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Guarantees Box in Roman Urdu */}
            <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200 grid grid-cols-3 gap-2 text-center text-[11px] text-stone-600">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-emerald-700" />
                <span className="font-semibold">Poore Pakistan Mein Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span className="font-semibold">100% Asal Kapray Ki Guarantee</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RefreshCcw className="w-4 h-4 text-emerald-700" />
                <span className="font-semibold">7 Din Mein Tabdeeli</span>
              </div>
            </div>
          </div>

          {/* Details & Purchase Actions */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              {/* Main Title in Roman Urdu */}
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug">
                {product.titleRomanUrdu || product.title}
              </h2>

              {/* Rating & Reviews in Roman Urdu */}
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold text-stone-900 text-sm">{product.rating}</span>
                </div>
                <span className="text-xs text-stone-400">•</span>
                <span className="text-xs text-stone-500">
                  {product.reviewsCount} Customer Reviews
                </span>
                <span className="text-xs text-stone-400">•</span>
                <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Stock Mojood ({product.stock})
                </span>
              </div>

              {/* Price block */}
              <div className="mt-4 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/70 flex items-baseline justify-between">
                <div>
                  <div className="text-xs text-stone-500 font-medium">Qeemat (Price):</div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl sm:text-3xl font-extrabold text-stone-950 font-serif">
                      Rs. {product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-stone-400 line-through">
                        Rs. {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-stone-500 block">Cut / Size:</span>
                  <span className="text-xs sm:text-sm font-bold text-emerald-900 bg-emerald-100/70 px-2.5 py-1 rounded-md">
                    {product.unit}
                  </span>
                </div>
              </div>

              {/* Fabric Specs in Roman Urdu */}
              <div className="mt-4 space-y-2 text-xs sm:text-sm">
                <div className="flex items-start gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  <span className="font-bold text-stone-900 shrink-0">Fabric / Material:</span>
                  <span className="text-stone-700">{product.fabric}</span>
                </div>

                <div className="space-y-1.5 pt-2">
                  <span className="font-bold text-stone-900 block">Tafseel (Description):</span>
                  <p className="text-stone-600 leading-relaxed text-xs sm:text-sm">
                    {product.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Quantity Selector & Purchase buttons in Roman Urdu */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-stone-800">
                  Tadad (Quantity):
                </span>
                <div className="flex items-center border border-stone-300 rounded-xl bg-white overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-bold text-sm text-stone-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="p-2 hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-stone-900 hover:bg-stone-800 text-white flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-300" />
                  <span>Cart Mein Shamil Karein</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>Abhi Kharidein (Cash on Delivery)</span>
                </button>
              </div>

              {/* Direct WhatsApp Order */}
              <button
                onClick={handleWhatsAppOrder}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-green-600" />
                <span>WhatsApp Par Fori Order Dein</span>
              </button>

              {/* Wishlist & Share buttons */}
              <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="flex items-center gap-1.5 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      wishlisted ? 'text-rose-500 fill-rose-500' : 'text-stone-400'
                    }`}
                  />
                  <span>
                    {wishlisted ? 'Wishlist Mein Mojood Hai' : 'Wishlist Mein Shamil Karein'}
                  </span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 hover:text-stone-900 transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copiedLink ? 'Link Copy Ho Gaya!' : 'Share Karein'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
