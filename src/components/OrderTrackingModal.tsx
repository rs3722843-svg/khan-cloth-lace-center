import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  Copy,
  Check,
  AlertCircle,
  Scissors,
  CheckCircle,
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

export const OrderTrackingModal: React.FC = () => {
  const {
    isTrackingModalOpen,
    setIsTrackingModalOpen,
    trackingInitialId,
    setTrackingInitialId,
    findOrder,
    orders,
    settings,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [copiedTracking, setCopiedTracking] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    if (trackingInitialId) {
      setSearchQuery(trackingInitialId);
      findOrder(trackingInitialId).then((found) => {
        if (!isCancelled) {
          setTrackedOrder(found || null);
          setSearchAttempted(true);
        }
      });
    } else {
      if (orders.length > 0 && !searchAttempted) {
        setTrackedOrder(orders[0]);
        setSearchQuery(orders[0].id);
      }
    }
    return () => {
      isCancelled = true;
    };
  }, [trackingInitialId, isTrackingModalOpen]);

  if (!isTrackingModalOpen) return null;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchAttempted(true);
    const found = await findOrder(searchQuery.trim());
    setTrackedOrder(found || null);
  };

  const handleSelectSample = async (id: string) => {
    setSearchQuery(id);
    setSearchAttempted(true);
    const found = await findOrder(id);
    setTrackedOrder(found || null);
  };

  const handleCopyCourierTracking = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2000);
    }
  };

  const getStatusStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'confirmed':
        return 1;
      case 'processing':
        return 2;
      case 'dispatched':
        return 3;
      case 'delivered':
        return 4;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const steps = [
    { title: 'Order Mosool Hua', sub: 'Order Placed', icon: Clock },
    { title: 'Tasdeeq Mukammal', sub: 'Confirmed', icon: CheckCircle2 },
    { title: 'Cutting & Packing', sub: 'Packing in Progress', icon: Scissors },
    { title: 'Courier Rawangi', sub: 'Dispatched via Courier', icon: Truck },
    { title: 'Deliver Ho Gaya', sub: 'Delivered', icon: CheckCircle },
  ];

  const currentStep = trackedOrder ? getStatusStepIndex(trackedOrder.status) : 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div
        className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header in Roman Urdu */}
        <div className="p-4 sm:p-6 border-b border-stone-200 bg-gradient-to-r from-emerald-950 to-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif text-white">
                Customer Order Tracking (Apna Order Track Karein)
              </h2>
              <p className="text-xs text-amber-300 font-medium">
                Khan Cloth & Lace Center — Apne parcel ki taaza tareen soorat-e-haal dekhein
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsTrackingModalOpen(false);
              setTrackingInitialId('');
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-stone-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body in Roman Urdu */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="block text-xs font-bold text-stone-700">
              Order Tracking ID (Misal: KCLC-1001) ya Mobile Phone Number Likhein:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="KCLC-1001 ya apna phone number likhein..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-sm shrink-0 cursor-pointer"
              >
                Track Karein
              </button>
            </div>

            {/* Quick Test Samples */}
            <div className="flex items-center gap-2 flex-wrap pt-1 text-[11px] text-stone-500">
              <span>Sample Orders Check Karein:</span>
              {orders.slice(0, 3).map((ord) => (
                <button
                  key={ord.id}
                  type="button"
                  onClick={() => handleSelectSample(ord.id)}
                  className="px-2 py-0.5 rounded-md bg-stone-100 hover:bg-amber-100 text-stone-800 font-mono text-[11px] border border-stone-200 transition-colors cursor-pointer"
                >
                  {ord.id} ({ord.status})
                </button>
              ))}
            </div>
          </form>

          {/* Results Area */}
          {trackedOrder ? (
            <div className="space-y-6">
              {/* Order Status Banner */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-stone-500 flex items-center gap-2">
                    <span>Order Number:</span>
                    <span className="font-bold text-stone-900 font-mono text-sm">
                      {trackedOrder.id}
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="font-semibold text-stone-700">{trackedOrder.customerName}</span>
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">
                    Order Date: {new Date(trackedOrder.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs ${
                      trackedOrder.status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : trackedOrder.status === 'dispatched'
                        ? 'bg-sky-100 text-sky-900 border border-sky-300'
                        : trackedOrder.status === 'processing'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : trackedOrder.status === 'confirmed'
                        ? 'bg-indigo-100 text-indigo-900 border border-indigo-300'
                        : trackedOrder.status === 'cancelled'
                        ? 'bg-rose-100 text-rose-900 border border-rose-300'
                        : 'bg-stone-200 text-stone-800'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                    <span>
                      {trackedOrder.status === 'delivered' && 'Deliver Ho Gaya (Delivered)'}
                      {trackedOrder.status === 'dispatched' && 'Courier Ke Hawale (Dispatched)'}
                      {trackedOrder.status === 'processing' && 'Packing o Cutting Jari (Processing)'}
                      {trackedOrder.status === 'confirmed' && 'Tasdeeq Shuda (Confirmed)'}
                      {trackedOrder.status === 'pending' && 'Tasdeeq Ka Muntazir (Pending)'}
                      {trackedOrder.status === 'cancelled' && 'Mansookh Shuda (Cancelled)'}
                    </span>
                  </span>
                </div>
              </div>

              {/* Progress Stepper in Roman Urdu */}
              {trackedOrder.status !== 'cancelled' ? (
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-6">
                    Delivery Ki Timeline (Delivery Steps)
                  </h3>

                  <div className="relative">
                    {/* Connecting line */}
                    <div className="hidden sm:block absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-stone-200 z-0">
                      <div
                        className="h-full bg-emerald-600 transition-all duration-500"
                        style={{
                          width: `${(Math.max(0, currentStep) / (steps.length - 1)) * 100}%`,
                        }}
                      />
                    </div>

                    {/* Step circles */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 sm:gap-2 relative z-10">
                      {steps.map((st, idx) => {
                        const Icon = st.icon;
                        const isCompleted = idx <= currentStep;
                        const isCurrent = idx === currentStep;

                        return (
                          <div
                            key={idx}
                            className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2"
                          >
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${
                                isCompleted
                                  ? 'bg-emerald-700 text-amber-200 ring-4 ring-emerald-100 shadow-sm'
                                  : 'bg-stone-100 text-stone-400 border border-stone-300'
                              } ${isCurrent ? 'scale-110 ring-emerald-200' : ''}`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>

                            <div>
                              <div
                                className={`text-xs font-bold ${
                                  isCompleted ? 'text-stone-900' : 'text-stone-400'
                                }`}
                              >
                                {st.title}
                              </div>
                              <div className="text-[10px] text-stone-500">
                                {st.sub}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>Yeh order customer ki darkhwast par mansookh (cancel) kar diya gaya hai.</span>
                </div>
              )}

              {/* Courier Specific Tracking info if available */}
              {(trackedOrder.courierTrackingNumber || trackedOrder.courierName) && (
                <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                      Courier Parcel Dispatch Ki Tafseel
                    </span>
                    <div className="text-xs text-stone-700">
                      Courier Company: <strong>{trackedOrder.courierName || 'TCS Express'}</strong>
                    </div>
                    {trackedOrder.courierTrackingNumber && (
                      <div className="text-xs text-stone-700 flex items-center gap-2">
                        <span>Courier Tracking #:</span>
                        <span className="font-mono font-bold text-stone-950 text-sm">
                          {trackedOrder.courierTrackingNumber}
                        </span>
                        <button
                          onClick={() =>
                            handleCopyCourierTracking(
                              trackedOrder.courierTrackingNumber!
                            )
                          }
                          className="p-1 rounded-md bg-amber-200 hover:bg-amber-300 text-amber-950 text-[11px] flex items-center gap-1 font-semibold cursor-pointer"
                        >
                          {copiedTracking ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedTracking ? 'Copy Ho Gaya' : 'Copy'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Assalam-o-Alaikum! Main Khan Cloth Center ke order ${trackedOrder.id} ki courier delivery ke baray mein maloom karna chahta hoon.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-200 text-xs font-bold flex items-center gap-2 self-start sm:self-auto transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-green-400" />
                    <span>WhatsApp Helpline Rabta</span>
                  </a>
                </div>
              )}

              {/* Timeline Notes History in Roman Urdu */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Tafseeli Updates (Status History Logs)
                </h3>
                <div className="space-y-2">
                  {trackedOrder.statusHistory.map((hist, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs flex items-start gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-emerald-700 mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-stone-500 text-[11px] mb-0.5">
                          <span className="font-bold text-emerald-950 capitalize">
                            Marhala: {hist.status}
                          </span>
                          <span>{hist.timestamp}</span>
                        </div>
                        <p className="text-stone-800 font-medium">
                          {hist.note}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ordered Items Breakdown in Roman Urdu */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Shamil Items (Ordered Products)
                </h3>
                <div className="divide-y divide-stone-100 space-y-2">
                  {trackedOrder.items.map((item, idx) => (
                    <div key={idx} className="pt-2 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 text-xs">
                        <h4 className="font-bold text-stone-900 leading-snug">
                          {item.product.titleRomanUrdu || item.product.title}
                        </h4>
                        <div className="text-stone-500 text-[11px]">
                          {item.quantity} x {item.product.unit} (Rs. {item.product.price.toLocaleString()})
                        </div>
                      </div>
                      <span className="font-bold text-stone-950 text-xs font-serif">
                        Rs. {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-stone-200 flex justify-between text-sm font-extrabold text-stone-950">
                  <span>Kul Raqam (Total):</span>
                  <span className="text-emerald-900 font-serif">
                    Rs. {trackedOrder.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Delivery Address Details */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900 block">
                      Delivery Pata (Address):
                    </span>
                    <span className="text-stone-700">
                      {trackedOrder.address}, <strong>{trackedOrder.city}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-stone-200 text-stone-600">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>Customer Phone: {trackedOrder.phone}</span>
                </div>
              </div>
            </div>
          ) : searchAttempted ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-stone-800">
                Koi Order Nahi Mila (Order Not Found)
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Meherbani farma kar tracking ID (misal: KCLC-1001) ya sahi phone number check karein.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
