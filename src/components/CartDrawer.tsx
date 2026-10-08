import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Truck,
  Sparkles,
  MessageCircle,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    settings,
    setIsCheckoutModalOpen,
  } = useStore();

  if (!isCartOpen) return null;

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const isFreeDelivery = subtotal >= settings.freeDeliveryThreshold;
  const remainingForFreeDelivery = Math.max(
    0,
    settings.freeDeliveryThreshold - subtotal
  );
  const deliveryFee = cart.length === 0 ? 0 : isFreeDelivery ? 0 : settings.standardDeliveryFee;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutModalOpen(true);
  };

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;
    const phone = settings.whatsapp.replace(/\D/g, '');
    let text = `Assalam-o-Alaikum! Main Khan Cloth & Lace Center se darj-zail ashya ka order dena chahta hoon:\n\n`;

    cart.forEach((item, index) => {
      text += `${index + 1}. *${item.product.titleRomanUrdu || item.product.title}*\n   Tadad: ${item.quantity} ${item.product.unit} | Qeemat: Rs. ${(item.product.price * item.quantity).toLocaleString()}\n`;
    });

    text += `\n*Subtotal:* Rs. ${subtotal.toLocaleString()}`;
    text += `\n*Delivery Charges:* ${isFreeDelivery ? 'Muft (FREE)' : `Rs. ${deliveryFee}`}`;
    text += `\n*Kul Raqam:* Rs. ${total.toLocaleString()}`;
    text += `\n\nMeherbani farma kar mera Cash on Delivery order confirm karein. Shukriya!`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 border-l border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header in Roman Urdu */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-900 text-amber-300 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 leading-tight">
                Shopping Cart
              </h2>
              <span className="text-xs text-stone-500 font-medium">
                {cart.length} mukhtalif items shamil hain
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Delivery Bar in Roman Urdu */}
        <div className="bg-amber-50/80 px-4 py-2.5 border-b border-amber-200/50 text-xs">
          {isFreeDelivery ? (
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Mubarak ho! Aapke order par FREE Home Delivery laagu ho chuki hai.</span>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between text-stone-700 font-medium mb-1">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-700" />
                  <span>
                    FREE Delivery ke liye mazeed{' '}
                    <strong className="text-amber-900 font-bold">
                      Rs. {remainingForFreeDelivery.toLocaleString()}
                    </strong>{' '}
                    ki kharidari karein
                  </span>
                </span>
              </div>
              <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-600 transition-all duration-300 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (subtotal / settings.freeDeliveryThreshold) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Items List in Roman Urdu */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-stone-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-stone-800">
                  Aapka cart abhi khali hai
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Hamari ladies suit, mardana fabric, laces, kambal, parde ya bedsheets collection se kharidari shuru karein.
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-5 py-2.5 rounded-full bg-emerald-900 text-amber-300 text-xs font-bold hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                Shopping Shuru Karein
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 bg-stone-50/80 p-3 rounded-2xl border border-stone-200/80"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold text-stone-900 line-clamp-2 leading-snug">
                        {item.product.titleRomanUrdu || item.product.title}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[11px] text-stone-500 block truncate">
                      {item.product.unit}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-bold text-xs sm:text-sm text-emerald-950 font-serif">
                      Rs. {(item.product.price * item.quantity).toLocaleString()}
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden text-xs">
                      <button
                        onClick={() =>
                          updateCartQuantity(item.product.id, item.quantity - 1)
                        }
                        className="p-1.5 hover:bg-stone-100 text-stone-700 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-bold text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateCartQuantity(item.product.id, item.quantity + 1)
                        }
                        className="p-1.5 hover:bg-stone-100 text-stone-700 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary / Checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50/90 space-y-3">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold text-stone-900">
                  Rs. {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Delivery Charges:</span>
                <span className="font-semibold">
                  {isFreeDelivery ? (
                    <span className="text-emerald-700 font-bold">Muft (FREE)</span>
                  ) : (
                    <span>Rs. {deliveryFee}</span>
                  )}
                </span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between text-sm sm:text-base font-extrabold text-stone-950">
                <span>Kul Raqam (Total):</span>
                <span className="text-emerald-900 font-serif">
                  Rs. {total.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={handleCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Order Mukammal Karein (Checkout)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleWhatsAppCheckout}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-green-600" />
                <span>WhatsApp Ke Zariye Order Bhejein</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] text-stone-400">
              <button
                onClick={clearCart}
                className="hover:text-rose-600 transition-colors cursor-pointer"
              >
                Cart Khali Karein
              </button>
              <span>Cash on Delivery Dastiyab Hai</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
