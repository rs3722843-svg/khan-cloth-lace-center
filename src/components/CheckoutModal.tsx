import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Truck,
  CheckCircle2,
  Banknote,
  Smartphone,
  Building,
  User,
} from 'lucide-react';

const PAKISTANI_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Gujranwala',
  'Sialkot',
  'Peshawar',
  'Quetta',
  'Hyderabad',
  'Sargodha',
  'Bahawalpur',
  'Sukkur',
  'Gujrat',
  'Sheikhupura',
  'Jhang',
  'Rahim Yar Khan',
  'Kasur',
  'Mardan',
  'Abbottabad',
  'Sahiwal',
  'Wah Cantt',
  'Okara',
  'Mirpur (AJK)',
  'Muzaffarabad',
];

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    cart,
    settings,
    placeOrder,
  } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [city, setCity] = useState('Lahore');
  const [customCity, setCustomCity] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'easypaisa' | 'jazzcash' | 'bank'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isCheckoutModalOpen) return null;

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const isFreeDelivery = subtotal >= settings.freeDeliveryThreshold;
  const deliveryFee = cart.length === 0 ? 0 : isFreeDelivery ? 0 : settings.standardDeliveryFee;
  const total = subtotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!customerName.trim()) {
      setError('Meherbani farma kar apna pura naam darj karein.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setError('Meherbani farma kar sahi 11-digit mobile ya WhatsApp number darj karein.');
      return;
    }
    if (!address.trim()) {
      setError('Meherbani farma kar mukammal delivery pata (address) darj karein.');
      return;
    }

    const selectedCity = city === 'other' ? customCity || 'Other City' : city;

    setIsSubmitting(true);

    try {
      placeOrder({
        customerName: customerName.trim(),
        phone: phone.trim(),
        altPhone: altPhone.trim() || undefined,
        city: selectedCity,
        address: address.trim(),
        notes: notes.trim() || undefined,
        paymentMethod,
        items: cart.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
        subtotal,
        deliveryFee,
        total,
      });

      setIsCheckoutModalOpen(false);
    } catch (err) {
      console.error(err);
      setError('Order mehfooz karne mein kharabi aayi. Dobara koshish karein.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header in Roman Urdu */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="text-lg font-bold text-stone-900 font-serif">
              Order Form — Cash on Delivery (Checkout)
            </h2>
            <p className="text-xs text-stone-500 font-medium">
              Khan Cloth & Lace Center — Mehfooz Home Delivery
            </p>
          </div>
          <button
            onClick={() => setIsCheckoutModalOpen(false)}
            className="w-8 h-8 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body in Roman Urdu */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Customer Personal Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Customer Ki Maloomat (Customer Details)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Pura Naam (Full Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Muhammad Tariq ya Mrs. Asim"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  WhatsApp / Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0300-1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Shehar (City) Muntakhib Karein *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
                >
                  {PAKISTANI_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="other">Koi Aur Shehar (Other City)</option>
                </select>
              </div>

              {city === 'other' ? (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Apne Shehar Ka Naam Likhein *
                  </label>
                  <input
                    type="text"
                    placeholder="Apna Shehar"
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Mutabaadil Phone (Alternate Number - Ikhtiyari)
                  </label>
                  <input
                    type="tel"
                    placeholder="0321-7654321"
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Mukammal Delivery Pata (Complete Address) *
              </label>
              <textarea
                required
                rows={2}
                placeholder="Makan / Dukan #, Gali, Mohallah ya Sector, Qareebi Mashhoor Jagah"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Khas Hidayat (Order Notes - Ikhtiyari)
              </label>
              <input
                type="text"
                placeholder="Misal: Delivery se pehle call karein, suit ke sath matching lace alag rakhein"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          {/* Payment Method Selector in Roman Urdu */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Tariqa-e-Adaigi (Payment Method)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <label
                className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-700'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="hidden"
                />
                <Banknote className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <div className="font-bold">Cash on Delivery</div>
                  <div className="text-[10px] text-stone-500">Parcel milne par raqam dein</div>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                  paymentMethod === 'easypaisa' || paymentMethod === 'jazzcash'
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-700'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'easypaisa'}
                  onChange={() => setPaymentMethod('easypaisa')}
                  className="hidden"
                />
                <Smartphone className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <div className="font-bold">EasyPaisa / JazzCash</div>
                  <div className="text-[10px] text-stone-500">Online wallet transfer</div>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                  paymentMethod === 'bank'
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-700'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'bank'}
                  onChange={() => setPaymentMethod('bank')}
                  className="hidden"
                />
                <Building className="w-4 h-4 text-indigo-600 shrink-0" />
                <div>
                  <div className="font-bold">Bank Transfer</div>
                  <div className="text-[10px] text-stone-500">Direct account transfer</div>
                </div>
              </label>
            </div>
          </div>

          {/* Order Summary Recap in Roman Urdu */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1.5">
            <div className="flex justify-between text-stone-600">
              <span>Items Ki Tadad ({cart.length}):</span>
              <span className="font-bold text-stone-900">
                Rs. {subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Delivery Charges:</span>
              <span className="font-bold">
                {isFreeDelivery ? (
                  <span className="text-emerald-700 font-bold">Muft (FREE)</span>
                ) : (
                  <span>Rs. {deliveryFee}</span>
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm sm:text-base font-extrabold text-stone-950 pt-1 border-t border-stone-200">
              <span>Kul Wajib-ul-Ada Raqam (Total):</span>
              <span className="text-emerald-950 font-serif">
                Rs. {total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Submit Action in Roman Urdu */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-700 hover:to-emerald-800 text-amber-200 font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-5 h-5 text-amber-400" />
              <span>
                {isSubmitting
                  ? 'Order Register Kiya Ja Raha Hai...'
                  : 'Order Confirm Karein (Confirm Order)'}
              </span>
            </button>
            <p className="text-[11px] text-center text-stone-500 mt-2 font-medium">
              Order mukammal hote hi aapko foran Tracking ID mil jayegi jisse aap parcel track kar sakein ge.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
