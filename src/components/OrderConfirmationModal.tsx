import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  CheckCircle2,
  Copy,
  Check,
  Truck,
  MessageCircle,
  X,
} from 'lucide-react';

export const OrderConfirmationModal: React.FC = () => {
  const {
    lastPlacedOrder,
    setLastPlacedOrder,
    openTrackingForOrder,
    settings,
  } = useStore();

  const [copied, setCopied] = useState(false);

  if (!lastPlacedOrder) return null;

  const order = lastPlacedOrder;

  const handleCopyId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(order.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleTrackNow = () => {
    const id = order.id;
    setLastPlacedOrder(null);
    openTrackingForOrder(id);
  };

  const handleSendToWhatsApp = () => {
    const phone = settings.whatsapp.replace(/\D/g, '');
    let msg = `Assalam-o-Alaikum! Main ne Khan Cloth & Lace Center se naya order darj kiya hai:\n\n`;
    msg += `*Order Tracking ID:* ${order.id}\n`;
    msg += `*Customer Naam:* ${order.customerName}\n`;
    msg += `*Phone:* ${order.phone}\n`;
    msg += `*Shehar:* ${order.city}\n`;
    msg += `*Pata:* ${order.address}\n\n`;
    msg += `*Items:*\n`;

    order.items.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.product.titleRomanUrdu || item.product.title} (${item.quantity} ${item.product.unit}) - Rs. ${(item.product.price * item.quantity).toLocaleString()}\n`;
    });

    msg += `\n*Kul Raqam:* Rs. ${order.total.toLocaleString()} (${order.paymentMethod.toUpperCase()})\n\n`;
    msg += `Meherbani farma kar is order ki tasdeeq aur dispatch schedule batayein. Shukriya!`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div
        className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-emerald-500/30 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner in Roman Urdu */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 text-white p-6 text-center relative">
          <button
            onClick={() => setLastPlacedOrder(null)}
            className="absolute top-4 right-4 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-full bg-emerald-600/30 border-2 border-amber-400/80 mx-auto flex items-center justify-center text-amber-300 mb-3 shadow-lg">
            <CheckCircle2 className="w-9 h-9 stroke-[2.3]" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-serif text-amber-200">
            Mubarak Ho! Aapka Order Darj Ho Gaya
          </h2>
          <p className="text-xs text-stone-300 mt-1 font-medium">
            Khan Cloth & Lace Center par aetimad karne ka shukriya
          </p>
        </div>

        {/* Tracking ID Spotlight Box in Roman Urdu */}
        <div className="p-6 space-y-5">
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-center space-y-2">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
              Aapka Tracking Number (Order Tracking ID)
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-wider font-mono">
                {order.id}
              </span>
              <button
                onClick={handleCopyId}
                className="p-2 rounded-xl bg-amber-200/80 hover:bg-amber-300 text-amber-950 transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
                title="Copy Tracking ID"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-800" />
                    <span>Copy Ho Gaya</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Karein</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-stone-500">
              Is tracking ID ko mehfooz rakhein, aap kisi bhi waqt parcel ka status dekh sakte hain.
            </p>
          </div>

          {/* Quick Details List in Roman Urdu */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <span className="text-stone-500">Customer Ka Naam:</span>
              <span className="font-bold text-stone-900">{order.customerName}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <span className="text-stone-500">Phone Number:</span>
              <span className="font-bold text-stone-800 font-mono">{order.phone}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <span className="text-stone-500">Shehar o Pata:</span>
              <span className="font-semibold text-stone-800 truncate max-w-[200px]">
                {order.city} - {order.address}
              </span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <span className="text-stone-500">Tariqa Adaigi:</span>
              <span className="font-bold text-emerald-800 uppercase">
                {order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : order.paymentMethod}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-stone-700 font-bold">Kul Raqam (Total Amount):</span>
              <span className="text-base font-extrabold text-stone-950 font-serif">
                Rs. {order.total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Primary Action Buttons in Roman Urdu */}
          <div className="space-y-2.5 pt-1">
            <button
              onClick={handleTrackNow}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Truck className="w-4 h-4 text-amber-400" />
              <span>Abhi Order Track Karein (Track Parcel)</span>
            </button>

            <button
              onClick={handleSendToWhatsApp}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-green-600" />
              <span>WhatsApp Par Receipt aur Tasdeeq Mangwayein</span>
            </button>

            <button
              onClick={() => setLastPlacedOrder(null)}
              className="w-full py-2 text-stone-500 hover:text-stone-800 text-xs font-semibold text-center cursor-pointer"
            >
              Mazeed Shopping Jari Rakhein
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
