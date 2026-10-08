import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import {
  ShoppingBag,
  Heart,
  MessageCircle,
  Star,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    toggleWishlist,
    isWishlisted,
    setSelectedProductForDetail,
    settings,
  } = useStore();

  const wishlisted = isWishlisted(product.id);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : null;

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const phone = settings.whatsapp.replace(/\D/g, '');
    const text = encodeURIComponent(
      `Assalam-o-Alaikum! Main Khan Cloth & Lace Center se yeh product khareedna chahta hoon:\n\n*Product:* ${product.titleRomanUrdu || product.title}\n*Cut/Size:* ${product.unit}\n*Qeemat:* Rs. ${product.price.toLocaleString()}\n*Code:* ${product.id}\n\nMeherbani farma kar Cash on Delivery order confirm karein aur delivery ki tafseel batayein. Shukriya!`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div
      onClick={() => setSelectedProductForDetail(product)}
      className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:border-amber-400/50"
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] sm:aspect-square bg-stone-100 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="bg-emerald-900/90 backdrop-blur-xs text-amber-300 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              {product.badge}
            </span>
          )}
          {discountPercent && (
            <span className="bg-rose-600 text-white text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded-full shadow-sm">
              {discountPercent}% Bachat
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-stone-700 hover:text-rose-600 transition-colors shadow-sm"
          title="Wishlist mein shamil karein"
        >
          <Heart
            className={`w-4 h-4 ${
              wishlisted ? 'text-rose-500 fill-rose-500' : 'text-stone-600'
            }`}
          />
        </button>

        {/* Unit badge at bottom of image */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          <span className="bg-stone-900/85 backdrop-blur-xs text-stone-200 text-[11px] font-semibold px-2.5 py-1 rounded-md">
            {product.unit}
          </span>
          <span className="bg-white/90 backdrop-blur-xs text-amber-900 text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>{product.rating}</span>
          </span>
        </div>
      </div>

      {/* Content section */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category Tag */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
            <span className="text-amber-700 font-bold uppercase tracking-wider">
              {product.categoryName}
            </span>
            <span className="truncate max-w-[150px] text-stone-400">
              {product.fabric.split(' ')[0]} Fabric
            </span>
          </div>

          {/* Main Title in Roman Urdu */}
          <h3 className="text-sm sm:text-base font-bold text-stone-900 leading-snug line-clamp-2">
            {product.titleRomanUrdu || product.title}
          </h3>

          {/* Fabric snippet */}
          <p className="mt-1.5 text-[11px] text-stone-600 line-clamp-1 bg-stone-50 px-2 py-1 rounded-md border border-stone-100">
            🧵 {product.fabric}
          </p>
        </div>

        {/* Pricing and Stock Status */}
        <div className="pt-2 border-t border-stone-100 space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-extrabold text-emerald-950 font-serif">
                Rs. {product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-stone-400 line-through">
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock indicator in Roman Urdu */}
            <div className="text-[11px] font-semibold flex items-center gap-1">
              {product.inStock ? (
                <span className="text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Stock Mojood ({product.stock})</span>
                </span>
              ) : (
                <span className="text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Khatam Ho Gaya</span>
                </span>
              )}
            </div>
          </div>

          {/* Action buttons in Roman Urdu */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`w-full py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                product.inStock
                  ? 'bg-stone-900 hover:bg-stone-800 text-white'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
              <span>Cart Mein Daalein</span>
            </button>

            <button
              onClick={handleWhatsAppOrder}
              className="w-full py-2 px-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="Direct WhatsApp par order dein"
            >
              <MessageCircle className="w-3.5 h-3.5 text-green-600" />
              <span>WhatsApp Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
