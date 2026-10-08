import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Lock,
  Package,
  PlusCircle,
  Truck,
  Settings,
  Edit2,
  Trash2,
  Save,
  CheckCircle2,
  Search,
  MessageCircle,
  RefreshCcw,
  ArrowLeft,
  X,
  ExternalLink,
  AlertCircle,
  FolderTree,
  Tag,
  Layers,
  Scissors,
  Sparkles,
  Wind,
  Bed,
  Heart,
  Shirt,
  ShoppingBag,
  Star,
  Check,
} from 'lucide-react';
import { Product, ProductCategory, OrderStatus, CategoryItem } from '../types';

const CATEGORY_ICON_OPTIONS = [
  { id: 'tag', label: 'Tag (General)' },
  { id: 'layers', label: 'Layers (Suits/Parde)' },
  { id: 'scissors', label: 'Scissors (Silai/Cuts)' },
  { id: 'sparkles', label: 'Sparkles (Laces/Fancy)' },
  { id: 'wind', label: 'Wind (Kambal/Shawls)' },
  { id: 'bed', label: 'Bed (Bedsheets)' },
  { id: 'heart', label: 'Heart (Jainamaz/Special)' },
  { id: 'shirt', label: 'Shirt (Kurta/Garments)' },
  { id: 'shopping-bag', label: 'Bag (Ready to Wear)' },
  { id: 'star', label: 'Star (VIP/Exclusive)' },
];

const renderCatBadgeIcon = (icon?: string, className = 'w-4 h-4') => {
  switch (icon) {
    case 'scissors':
      return <Scissors className={`${className} text-emerald-400`} />;
    case 'layers':
      return <Layers className={`${className} text-rose-400`} />;
    case 'sparkles':
      return <Sparkles className={`${className} text-amber-400`} />;
    case 'wind':
      return <Wind className={`${className} text-sky-400`} />;
    case 'bed':
      return <Bed className={`${className} text-indigo-400`} />;
    case 'heart':
      return <Heart className={`${className} text-emerald-400`} />;
    case 'shirt':
      return <Shirt className={`${className} text-violet-400`} />;
    case 'shopping-bag':
      return <ShoppingBag className={`${className} text-pink-400`} />;
    case 'star':
      return <Star className={`${className} text-amber-400`} />;
    case 'tag':
    default:
      return <Tag className={`${className} text-teal-400`} />;
  }
};

export const AdminPortalPage: React.FC = () => {
  const {
    products,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    settings,
    updateSettings,
    verifyAdminPin,
    resetToDefaults,
    isAdminAuthenticated,
    setIsAdminAuthenticated,
    setIsAdminRoute,
  } = useStore();

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'add' | 'categories' | 'orders' | 'settings'>('products');

  // Filter products
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState<ProductCategory>('all');

  // Edit product inline
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editOriginalPrice, setEditOriginalPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editTitleRomanUrdu, setEditTitleRomanUrdu] = useState<string>('');
  const [editUnit, setEditUnit] = useState<string>('');
  const [editFabric, setEditFabric] = useState<string>('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Add Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newTitleRomanUrdu, setNewTitleRomanUrdu] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('ladies-suits');
  const [newPrice, setNewPrice] = useState<number>(3500);
  const [newOriginalPrice, setNewOriginalPrice] = useState<number>(4200);
  const [newUnit, setNewUnit] = useState('3-Piece Suit (Unstitched)');
  const [newStock, setNewStock] = useState<number>(20);
  const [newFabric, setNewFabric] = useState('Pure Lawn 90/70');
  const [newDescription, setNewDescription] = useState('Aala quality ka unstitched fabric, pakke rang aur modern design.');
  const [newImageUrl, setNewImageUrl] = useState(
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
  );
  const [addSuccessMessage, setAddSuccessMessage] = useState('');

  // Category Management State
  const [newCatName, setNewCatName] = useState('');
  const [newCatRomanUrdu, setNewCatRomanUrdu] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('tag');
  const [newCatDescription, setNewCatDescription] = useState('');
  const [catActionSuccess, setCatActionSuccess] = useState('');
  const [catActionError, setCatActionError] = useState('');
  const [isSubmittingCat, setIsSubmittingCat] = useState(false);
  const [deleteCatConfirmId, setDeleteCatConfirmId] = useState<string | null>(null);

  // Edit Category Inline
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatRomanUrdu, setEditCatRomanUrdu] = useState('');
  const [editCatIcon, setEditCatIcon] = useState('tag');
  const [editCatDescription, setEditCatDescription] = useState('');

  // Orders State
  const [orderFilter, setOrderFilter] = useState<'all' | OrderStatus>('all');
  const [courierInput, setCourierInput] = useState<{ [orderId: string]: string }>({});
  const [courierNameInput, setCourierNameInput] = useState<{ [orderId: string]: string }>({});

  // Settings State - safely initialize from settings with fallbacks
  const [settingsPhone, setSettingsPhone] = useState(settings?.phone || '0300-1234567');
  const [settingsWhatsapp, setSettingsWhatsapp] = useState(settings?.whatsapp || '923001234567');
  const [settingsAnnouncement, setSettingsAnnouncement] = useState(settings?.announcement || '');
  const [settingsFreeThreshold, setSettingsFreeThreshold] = useState(settings?.freeDeliveryThreshold || 3500);
  const [settingsFee, setSettingsFee] = useState(settings?.standardDeliveryFee || 250);
  const [settingsPin, setSettingsPin] = useState(settings?.adminPin || '1234');
  const [settingsSavedMessage, setSettingsSavedMessage] = useState('');
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // Sync settings state whenever settings update
  useEffect(() => {
    if (settings) {
      if (settings.phone) setSettingsPhone(settings.phone);
      if (settings.whatsapp) setSettingsWhatsapp(settings.whatsapp);
      if (settings.announcement !== undefined) setSettingsAnnouncement(settings.announcement);
      if (settings.freeDeliveryThreshold !== undefined) setSettingsFreeThreshold(settings.freeDeliveryThreshold);
      if (settings.standardDeliveryFee !== undefined) setSettingsFee(settings.standardDeliveryFee);
      if (settings.adminPin) setSettingsPin(settings.adminPin);
    }
  }, [settings]);

  const handleBackToStore = () => {
    try {
      window.history.pushState({}, '', '/');
    } catch {
      // ignore
    }
    setIsAdminRoute(false);
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // ignore
    }
  };

  // PIN Verification with server
  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setPinError('');

    try {
      const ok = await verifyAdminPin(pinInput || '1234');
      if (!ok) {
        setPinError('Ghalat PIN code! (Default PIN: 1234)');
      }
    } catch {
      // Fallback unlock if network issue
      if (pinInput === '1234' || pinInput === settings?.adminPin) {
        setIsAdminAuthenticated(true);
      } else {
        setPinError('Login mein masla aaya. Default PIN 1234 try karein.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFastUnlock = async () => {
    setPinInput('1234');
    setIsVerifying(true);
    try {
      await verifyAdminPin('1234');
    } catch {
      setIsAdminAuthenticated(true);
    } finally {
      setIsVerifying(false);
    }
  };

  // Start editing a product
  const startEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setEditPrice(prod.price || 0);
    setEditOriginalPrice(prod.originalPrice || prod.price || 0);
    setEditStock(prod.stock || 0);
    setEditTitle(prod.title || '');
    setEditTitleRomanUrdu(prod.titleRomanUrdu || prod.title || '');
    setEditUnit(prod.unit || '');
    setEditFabric(prod.fabric || '');
  };

  const saveProductEdit = async (id: string) => {
    await updateProduct(id, {
      price: editPrice,
      originalPrice: editOriginalPrice,
      stock: editStock,
      title: editTitle,
      titleRomanUrdu: editTitleRomanUrdu,
      unit: editUnit,
      fabric: editFabric,
    });
    setEditingProductId(null);
    setActionSuccessMsg('Item live server par update ho gaya!');
    setTimeout(() => setActionSuccessMsg(''), 2500);
  };

  // Handle Add Product
  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const matchedCat = (categories || []).find((c) => c.id === newCategory);
    const resolvedCatName = matchedCat ? matchedCat.name : (newCategory || 'General');

    await addProduct({
      title: newTitle.trim() || newTitleRomanUrdu.trim(),
      titleRomanUrdu: newTitleRomanUrdu.trim() || newTitle.trim(),
      category: newCategory,
      categoryName: resolvedCatName,
      price: Number(newPrice) || 1000,
      originalPrice: Number(newOriginalPrice) || Number(newPrice),
      unit: newUnit.trim() || 'Item',
      stock: Number(newStock) || 10,
      inStock: (Number(newStock) || 10) > 0,
      images: [newImageUrl.trim() || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
      fabric: newFabric.trim() || 'Standard Fabric',
      description: newDescription.trim() || 'Premium Quality Product',
      badge: 'Nayi Variety',
      isFeatured: false,
      rating: 5.0,
      reviewsCount: 1,
    });

    setAddSuccessMessage('Naya item server par save ho gaya aur live website par shamil ho gaya!');
    setTimeout(() => {
      setAddSuccessMessage('');
      setActiveTab('products');
    }, 1500);

    setNewTitle('');
    setNewTitleRomanUrdu('');
  };

  // Handle Add Category
  const handleAddCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim() && !newCatRomanUrdu.trim()) {
      setCatActionError('Category ka naam likhna zaroori hai.');
      return;
    }

    setIsSubmittingCat(true);
    setCatActionError('');
    setCatActionSuccess('');

    try {
      const slug =
        newCatSlug.trim() ||
        (newCatName || newCatRomanUrdu)
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '') ||
        `cat-${Date.now()}`;

      await addCategory({
        id: slug,
        name: newCatName.trim() || newCatRomanUrdu.trim(),
        nameRomanUrdu: newCatRomanUrdu.trim() || newCatName.trim(),
        icon: newCatIcon || 'tag',
        description: newCatDescription.trim(),
      });

      setCatActionSuccess(`Nayi category "${newCatName || newCatRomanUrdu}" shamil ho gayi aur foran website par live ho gayi!`);
      setNewCatName('');
      setNewCatRomanUrdu('');
      setNewCatSlug('');
      setNewCatIcon('tag');
      setNewCatDescription('');
      setTimeout(() => setCatActionSuccess(''), 4000);
    } catch (err: any) {
      setCatActionError(err.message || 'Category shamil karne mein masla aaya');
    } finally {
      setIsSubmittingCat(false);
    }
  };

  // Handle Delete Category
  const handleDeleteCategory = async (catId: string) => {
    setCatActionError('');
    setCatActionSuccess('');
    try {
      const count = safeProductsList.filter((p) => p.category === catId).length;
      if (count > 0) {
        setCatActionError(
          `Is category mein ${count} items pehle se mojood hain! Pehle un items ki category tabdeel karein ya unhein delete karein.`
        );
        setDeleteCatConfirmId(null);
        return;
      }
      await deleteCategory(catId);
      setDeleteCatConfirmId(null);
      setCatActionSuccess('Category kamyabi se delete ho gayi!');
      setTimeout(() => setCatActionSuccess(''), 3000);
    } catch (err: any) {
      setCatActionError(err.message || 'Delete karne mein masla aaya');
    }
  };

  // Handle Edit Category
  const startEditCategory = (cat: CategoryItem) => {
    setEditingCatId(cat.id);
    setEditCatName(cat.name);
    setEditCatRomanUrdu(cat.nameRomanUrdu);
    setEditCatIcon(cat.icon || 'tag');
    setEditCatDescription(cat.description || '');
  };

  const saveEditCategory = async (catId: string) => {
    try {
      await updateCategory(catId, {
        name: editCatName.trim(),
        nameRomanUrdu: editCatRomanUrdu.trim() || editCatName.trim(),
        icon: editCatIcon,
        description: editCatDescription.trim(),
      });
      setEditingCatId(null);
      setCatActionSuccess('Category kamyabi se update ho gayi!');
      setTimeout(() => setCatActionSuccess(''), 3000);
    } catch (err: any) {
      setCatActionError(err.message || 'Update karne mein masla aaya');
    }
  };

  // Handle Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      phone: settingsPhone,
      whatsapp: settingsWhatsapp,
      announcement: settingsAnnouncement,
      freeDeliveryThreshold: Number(settingsFreeThreshold),
      standardDeliveryFee: Number(settingsFee),
      adminPin: settingsPin,
    });
    setSettingsSavedMessage('Dukan ki settings live server par save ho gayi hain!');
    setTimeout(() => setSettingsSavedMessage(''), 2500);
  };

  // Sample image presets
  const sampleImagePresets = [
    {
      label: 'Ladies Suit',
      url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Gents Fabric',
      url: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Fancy Lace Roll',
      url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Mink Kambal',
      url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Parde (Curtains)',
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Bed Sheet Set',
      url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Turkish Jainamaz',
      url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=800&q=80',
    },
  ];

  // 100% Null-safe products filtering
  const safeProductsList = Array.isArray(products) ? products : [];
  const filteredProducts = safeProductsList.filter((p) => {
    if (!p) return false;
    const cat = p.category || 'all';
    const matchesCat = selectedProductCategory === 'all' || cat === selectedProductCategory;
    const search = (productSearch || '').toLowerCase().trim();
    if (!search) return matchesCat;

    const title = (p.title || '').toLowerCase();
    const roman = (p.titleRomanUrdu || '').toLowerCase();
    const fab = (p.fabric || '').toLowerCase();
    return matchesCat && (title.includes(search) || roman.includes(search) || fab.includes(search));
  });

  // 100% Null-safe orders filtering
  const safeOrdersList = Array.isArray(orders) ? orders : [];
  const filteredOrders = safeOrdersList.filter((o) => {
    if (!o) return false;
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col font-sans">
      {/* Top Admin Header Bar */}
      <header className="bg-stone-950 border-b border-stone-800 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-md shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-sm sm:text-base md:text-lg font-bold font-serif text-white">
                Khan Cloth & Lace Center — Backend Portal
              </h1>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                Live Server Connected
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-stone-400">
              Yahan ki gayi tabdeeliyan foran live website par tamam customers ko nazar aayengi.
            </p>
          </div>
        </div>

        {/* Back to Public Store button */}
        <button
          onClick={handleBackToStore}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 hover:text-amber-200 text-xs font-bold transition-all border border-stone-700 cursor-pointer shrink-0"
          title="Aam customers ki website par jayein"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Public Store Par Wapis Jayein</span>
          <span className="sm:hidden">Wapis</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-60" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {!isAdminAuthenticated ? (
          /* Secure PIN Login Screen */
          <div className="max-w-md w-full mx-auto my-auto p-6 sm:p-8 rounded-3xl bg-stone-950 border border-stone-800 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
                Admin Backend Login
              </h2>
              <p className="text-xs text-stone-400 leading-relaxed">
                Yeh portal aam visitors ko website par nazar nahi aata. Dukan malik ka PIN enter karein:
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="PIN: 1234"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  autoFocus
                  className="w-full text-center text-2xl tracking-widest px-4 py-3 bg-stone-900 border border-stone-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>

              {pinError && (
                <p className="text-xs text-rose-400 font-bold bg-rose-950/40 p-2.5 rounded-lg border border-rose-900/50">
                  {pinError}
                </p>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? 'Tasdeeq Ho Rahi Hai...' : 'Backend Open Karein (Unlock)'}
              </button>

              <button
                type="button"
                onClick={handleFastUnlock}
                className="w-full py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 text-xs font-bold border border-amber-500/40 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>⚡ 1-Click Fast Unlock (Default PIN: 1234)</span>
              </button>
            </form>

            <div className="text-[11px] text-stone-400 bg-stone-900/80 p-3 rounded-xl border border-stone-800 text-left space-y-1">
              <div>💡 <strong>Dukan Malik Guide:</strong> Default PIN <code className="text-amber-400 font-bold">1234</code> hai.</div>
              <div>Yahan se aap items ke rate tabdeel kar sakte hain aur live customer orders dekh sakte hain.</div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleBackToStore}
                className="text-xs text-stone-400 hover:text-stone-200 underline cursor-pointer"
              >
                ← Public Website Par Wapis Jayein
              </button>
            </div>
          </div>
        ) : (
          /* Full Backend Dashboard */
          <div className="bg-stone-950 rounded-3xl border border-stone-800 shadow-2xl flex-1 flex flex-col overflow-hidden">
            {/* Action success notification */}
            {actionSuccessMsg && (
              <div className="bg-emerald-950 text-emerald-200 border-b border-emerald-800 px-6 py-2.5 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{actionSuccessMsg}</span>
              </div>
            )}

            {/* Dashboard Tabs */}
            <div className="px-4 sm:px-6 border-b border-stone-800 bg-stone-900/50 flex items-center justify-between overflow-x-auto gap-2">
              <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar shrink-0">
                <button
                  onClick={() => setActiveTab('products')}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'products'
                      ? 'bg-amber-500 text-stone-950 shadow-sm'
                      : 'text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Items & Prices Update ({safeProductsList.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('add')}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'add'
                      ? 'bg-amber-500 text-stone-950 shadow-sm'
                      : 'text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Naya Item Shamil Karein</span>
                </button>

                <button
                  onClick={() => setActiveTab('categories')}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'categories'
                      ? 'bg-amber-500 text-stone-950 shadow-sm'
                      : 'text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <FolderTree className="w-4 h-4" />
                  <span>Categories Manage ({categories.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'orders'
                      ? 'bg-amber-500 text-stone-950 shadow-sm'
                      : 'text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>Customer Orders ({safeOrdersList.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'settings'
                      ? 'bg-amber-500 text-stone-950 shadow-sm'
                      : 'text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Dukan Ki Settings</span>
                </button>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    try {
                      sessionStorage.removeItem('khan_cloth_admin_token_v3');
                    } catch {
                      // ignore
                    }
                    setIsAdminAuthenticated(false);
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 font-bold px-3 py-1.5 rounded-lg border border-rose-900 hover:bg-rose-950/50 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* TAB 1: PRODUCT & PRICE MANAGEMENT */}
            {activeTab === 'products' && (
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-900 p-3 rounded-2xl border border-stone-800">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Item ka naam ya fabric search karein..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-700 text-white rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedProductCategory}
                      onChange={(e) =>
                        setSelectedProductCategory(e.target.value as ProductCategory)
                      }
                      className="bg-stone-950 border border-stone-700 text-white rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="all">Tamam Categories ({safeProductsList.length})</option>
                      {(categories || []).map((c) => {
                        const count = safeProductsList.filter((p) => p.category === c.id).length;
                        return (
                          <option key={c.id} value={c.id}>
                            {c.name} ({count})
                          </option>
                        );
                      })}
                    </select>

                    <button
                      onClick={() => setActiveTab('add')}
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-sm whitespace-nowrap cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Naya Item</span>
                    </button>
                  </div>
                </div>

                {/* Table of Products */}
                <div className="border border-stone-800 rounded-2xl overflow-x-auto shadow-2xs">
                  <table className="w-full text-left text-xs text-stone-300 min-w-[650px]">
                    <thead className="bg-stone-900 text-amber-300 uppercase tracking-wider font-bold border-b border-stone-800">
                      <tr>
                        <th className="p-3 w-14">Tasveer</th>
                        <th className="p-3">Item Ka Naam</th>
                        <th className="p-3">Category / Size</th>
                        <th className="p-3 w-36">Qeemat (PKR)</th>
                        <th className="p-3 w-28">Stock</th>
                        <th className="p-3 w-32 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/80 bg-stone-950">
                      {filteredProducts.map((p) => {
                        const isEditing = editingProductId === p.id;
                        const isDeletingThis = deleteConfirmId === p.id;

                        return (
                          <tr key={p.id} className="hover:bg-stone-900/40 transition-colors">
                            {/* Image */}
                            <td className="p-3">
                              <div className="w-12 h-12 rounded-lg bg-stone-900 overflow-hidden border border-stone-800 shrink-0">
                                <img
                                  src={p.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'}
                                  alt={p.title || 'Product'}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
                                  }}
                                />
                              </div>
                            </td>

                            {/* Details */}
                            <td className="p-3">
                              {isEditing ? (
                                <div className="space-y-1">
                                  <input
                                    type="text"
                                    value={editTitleRomanUrdu}
                                    onChange={(e) => setEditTitleRomanUrdu(e.target.value)}
                                    placeholder="Roman Urdu Title"
                                    className="w-full p-1 bg-stone-900 border border-stone-700 text-white rounded text-xs font-bold"
                                  />
                                  <input
                                    type="text"
                                    value={editFabric}
                                    onChange={(e) => setEditFabric(e.target.value)}
                                    placeholder="Fabric Tafseel"
                                    className="w-full p-1 bg-stone-900 border border-stone-700 text-stone-300 rounded text-[11px]"
                                  />
                                </div>
                              ) : (
                                <div>
                                  <div className="font-bold text-white text-sm">
                                    {p.titleRomanUrdu || p.title || 'Suit Item'}
                                  </div>
                                  <div className="text-[11px] text-stone-400">
                                    🧵 {p.fabric || 'Standard Fabric'}
                                  </div>
                                </div>
                              )}
                            </td>

                            {/* Category & Unit */}
                            <td className="p-3">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editUnit}
                                  onChange={(e) => setEditUnit(e.target.value)}
                                  className="w-full p-1 bg-stone-900 border border-stone-700 text-white rounded text-xs"
                                />
                              ) : (
                                <div>
                                  <span className="font-bold text-amber-200 block">
                                    {p.categoryName || 'Fabrics'}
                                  </span>
                                  <span className="text-[11px] text-stone-400">
                                    {p.unit || 'Item'}
                                  </span>
                                </div>
                              )}
                            </td>

                            {/* Price */}
                            <td className="p-3">
                              {isEditing ? (
                                <div className="space-y-1">
                                  <label className="text-[10px] text-stone-400 block">Sale Price:</label>
                                  <input
                                    type="number"
                                    value={editPrice}
                                    onChange={(e) => setEditPrice(Number(e.target.value))}
                                    className="w-full p-1 bg-stone-900 border border-stone-700 text-white rounded text-xs font-bold font-mono"
                                  />
                                  <label className="text-[10px] text-stone-400 block">Original:</label>
                                  <input
                                    type="number"
                                    value={editOriginalPrice}
                                    onChange={(e) =>
                                      setEditOriginalPrice(Number(e.target.value))
                                    }
                                    className="w-full p-1 bg-stone-900 border border-stone-700 text-stone-400 rounded text-xs font-mono"
                                  />
                                </div>
                              ) : (
                                <div>
                                  <span className="text-sm font-extrabold text-amber-300 font-serif block">
                                    Rs. {(p.price || 0).toLocaleString()}
                                  </span>
                                  {p.originalPrice && p.originalPrice > (p.price || 0) ? (
                                    <span className="text-[11px] text-stone-500 line-through">
                                      Rs. {(p.originalPrice || 0).toLocaleString()}
                                    </span>
                                  ) : null}
                                </div>
                              )}
                            </td>

                            {/* Stock */}
                            <td className="p-3">
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={editStock}
                                  onChange={(e) => setEditStock(Number(e.target.value))}
                                  className="w-full p-1 bg-stone-900 border border-stone-700 text-white rounded text-xs font-bold font-mono"
                                />
                              ) : (
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                    (p.stock || 0) > 0
                                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                                  }`}
                                >
                                  {(p.stock || 0) > 0 ? `${p.stock} Mojood` : 'Khatam'}
                                </span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="p-3 text-center">
                              {isEditing ? (
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    onClick={() => saveProductEdit(p.id)}
                                    className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer"
                                    title="Mehfooz Karein (Save)"
                                  >
                                    <Save className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setEditingProductId(null)}
                                    className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition-colors cursor-pointer"
                                    title="Cancel"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : isDeletingThis ? (
                                <div className="space-y-1">
                                  <span className="text-[10px] text-rose-300 block font-bold">Delete Karein?</span>
                                  <div className="flex items-center justify-center gap-1">
                                    <button
                                      onClick={async () => {
                                        await deleteProduct(p.id);
                                        setDeleteConfirmId(null);
                                        setActionSuccessMsg('Item delete ho gaya!');
                                        setTimeout(() => setActionSuccessMsg(''), 2500);
                                      }}
                                      className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold rounded cursor-pointer"
                                    >
                                      Haan
                                    </button>
                                    <button
                                      onClick={() => setDeleteConfirmId(null)}
                                      className="px-2 py-0.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px] rounded cursor-pointer"
                                    >
                                      Nahi
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => startEditProduct(p)}
                                    className="p-1.5 bg-stone-900 hover:bg-amber-950 text-amber-300 rounded-lg border border-stone-800 transition-colors cursor-pointer"
                                    title="Qeemat ya Stock Update Karein"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirmId(p.id)}
                                    className="p-1.5 bg-stone-900 hover:bg-rose-950 text-rose-400 rounded-lg border border-stone-800 transition-colors cursor-pointer"
                                    title="Delete Karein"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: ADD NEW PRODUCT FORM */}
            {activeTab === 'add' && (
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 max-w-3xl mx-auto w-full">
                <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                  <div>
                    <h3 className="text-base font-bold text-white font-serif">
                      Naya Item Catalog Mein Shamil Karein
                    </h3>
                    <p className="text-xs text-stone-400">
                      Save karne par yeh item foran tamam customers ko live website par show hoga.
                    </p>
                  </div>
                </div>

                {addSuccessMessage && (
                  <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-200 text-xs font-bold rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{addSuccessMessage}</span>
                  </div>
                )}

                <form onSubmit={handleAddProductSubmit} className="space-y-4 text-xs">
                  {/* Category Selector */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block font-bold text-stone-300">
                        Category Muntakhib Karein *
                      </label>
                      <button
                        type="button"
                        onClick={() => setActiveTab('categories')}
                        className="text-amber-400 hover:text-amber-300 font-bold text-[11px] flex items-center gap-1 cursor-pointer bg-stone-900 hover:bg-stone-800 px-2.5 py-1 rounded-lg border border-amber-500/30"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Nayi Category Shamil Karein</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(categories || []).map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setNewCategory(c.id as ProductCategory)}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                            newCategory === c.id
                              ? 'border-amber-500 bg-amber-500/15 text-amber-300 font-bold ring-1 ring-amber-500/50'
                              : 'border-stone-800 bg-stone-900 text-stone-300 hover:bg-stone-800'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            {renderCatBadgeIcon(c.icon, 'w-3.5 h-3.5')}
                            <span className="text-xs font-semibold">{c.name}</span>
                          </div>
                          {c.nameRomanUrdu && c.nameRomanUrdu !== c.name && (
                            <span className="text-[10px] text-stone-400 truncate max-w-full">
                              ({c.nameRomanUrdu})
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-300 mb-1">
                        Item Ka Naam (Roman Urdu Title) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Misal: Luxury Lawn 3-Piece Embroidered Suit"
                        value={newTitleRomanUrdu}
                        onChange={(e) => setNewTitleRomanUrdu(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 text-white rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-300 mb-1">
                        English Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Luxury Lawn 3-Piece Embroidered Suit"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 text-white rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  {/* Price, Original Price, Unit, Stock */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block font-bold text-stone-300 mb-1">
                        Farokht Qeemat (PKR) *
                      </label>
                      <input
                        type="number"
                        required
                        value={newPrice}
                        onChange={(e) => setNewPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 text-white rounded-xl font-bold font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-300 mb-1">
                        Asal Qeemat (Crossed Price)
                      </label>
                      <input
                        type="number"
                        value={newOriginalPrice}
                        onChange={(e) => setNewOriginalPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 text-stone-400 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-300 mb-1">
                        Packing / Size (Unit) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Misal: 3-Piece, 4 Meter, 9 Gaz Roll"
                        value={newUnit}
                        onChange={(e) => setNewUnit(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-300 mb-1">
                        Stock Qty *
                      </label>
                      <input
                        type="number"
                        required
                        value={newStock}
                        onChange={(e) => setNewStock(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 text-white rounded-xl font-bold font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  {/* Fabric & Description */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-300 mb-1">
                        Fabric Specification *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Misal: Pure Lawn 90/70, Egyptian Cotton, Zari Gotta"
                        value={newFabric}
                        onChange={(e) => setNewFabric(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-300 mb-1">
                        Tafseel (Description)
                      </label>
                      <input
                        type="text"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  {/* Image URL & Preset Selection */}
                  <div className="space-y-2">
                    <label className="block font-bold text-stone-300">
                      Tasveer Ka Link (Image URL):
                    </label>
                    <input
                      type="url"
                      required
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 bg-stone-900 border border-stone-700 text-white rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />

                    {/* Presets */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[11px] text-stone-500 font-bold">Sample Photos:</span>
                      {sampleImagePresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setNewImageUrl(preset.url)}
                          className="px-2 py-1 rounded-md bg-stone-900 hover:bg-stone-800 text-stone-300 text-[11px] border border-stone-700 cursor-pointer"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <PlusCircle className="w-5 h-5" />
                      <span>Item Live Server Par Save Karein</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB: CATEGORIES MANAGEMENT */}
            {activeTab === 'categories' && (
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 max-w-4xl mx-auto w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-800 gap-2">
                  <div>
                    <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
                      <FolderTree className="w-5 h-5 text-amber-400" />
                      <span>Dukan Ki Categories Management (اقسام)</span>
                    </h3>
                    <p className="text-xs text-stone-400">
                      Yahan se aap dukan ke liye nayi categories shamil kar sakte hain. Nayi category foran website ke top category slider aur catalog mein nazar aayegi.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-amber-300 font-bold">
                      Kul Categories: {categories.length}
                    </span>
                  </div>
                </div>

                {/* Status Messages */}
                {catActionSuccess && (
                  <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-200 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{catActionSuccess}</span>
                  </div>
                )}

                {catActionError && (
                  <div className="p-3 bg-rose-950 border border-rose-800 text-rose-200 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{catActionError}</span>
                  </div>
                )}

                {/* FORM: ADD NEW CATEGORY */}
                <div className="bg-stone-900/80 p-4 sm:p-5 rounded-2xl border border-stone-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
                    <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                      <PlusCircle className="w-4 h-4 text-amber-400" />
                      <span>➕ Nayi Category Shamil Karein</span>
                    </h4>
                    <span className="text-[11px] text-stone-400">
                      Misal: Shawls, Ready-to-Wear, Bridal Sets, Fancy Dori
                    </span>
                  </div>

                  <form onSubmit={handleAddCategorySubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-stone-300 mb-1">
                          Category Ka Naam (Title) *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Misal: Shawls Collection ya Ready to Wear"
                          value={newCatName}
                          onChange={(e) => {
                            setNewCatName(e.target.value);
                            if (!newCatSlug) {
                              setNewCatSlug(
                                e.target.value
                                  .toLowerCase()
                                  .replace(/[^a-z0-9]/g, '-')
                                  .replace(/-+/g, '-')
                              );
                            }
                          }}
                          className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-white rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-300 mb-1">
                          Roman Urdu Naam (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="Misal: Garam Pashmina Shawls & Chadar"
                          value={newCatRomanUrdu}
                          onChange={(e) => setNewCatRomanUrdu(e.target.value)}
                          className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-stone-300 mb-1">
                          Category Code / Slug (System ID)
                        </label>
                        <input
                          type="text"
                          placeholder="Misal: shawls (Auto generated)"
                          value={newCatSlug}
                          onChange={(e) => setNewCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                          className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-stone-300 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <span className="text-[10px] text-stone-500 mt-0.5 block">
                          URL aur filtering ke liye istemal hota hai (Chhote huroof aur dash).
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-stone-300 mb-1">
                          Tafseel / Description (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="Misal: Har qisam ki fancy aur plain shawls"
                          value={newCatDescription}
                          onChange={(e) => setNewCatDescription(e.target.value)}
                          className="w-full px-3 py-2 bg-stone-950 border border-stone-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    {/* Icon Selection */}
                    <div>
                      <label className="block font-bold text-stone-300 mb-1.5">
                        Icon Muntakhib Karein:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {CATEGORY_ICON_OPTIONS.map((ico) => {
                          const isSelected = newCatIcon === ico.id;
                          return (
                            <button
                              key={ico.id}
                              type="button"
                              onClick={() => setNewCatIcon(ico.id)}
                              className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                                isSelected
                                  ? 'border-amber-500 bg-amber-500/15 text-amber-300 font-bold ring-1 ring-amber-500/50'
                                  : 'border-stone-800 bg-stone-950 text-stone-300 hover:bg-stone-800'
                              }`}
                            >
                              {renderCatBadgeIcon(ico.id, 'w-4 h-4')}
                              <span className="text-[11px] truncate">{ico.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmittingCat}
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>{isSubmittingCat ? 'Shamil Ho Rahi Hai...' : 'Nayi Category Website Par Shamil Karein'}</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* LIST OF EXISTING CATEGORIES */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-stone-200">
                      Tamam Mojooda Categories ({categories.length})
                    </h4>
                    <span className="text-[11px] text-stone-400">
                      Items ki tadaad ke sath
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {categories.map((cat) => {
                      const count = safeProductsList.filter((p) => p.category === cat.id).length;
                      const isEditing = editingCatId === cat.id;
                      const isDeleting = deleteCatConfirmId === cat.id;

                      return (
                        <div
                          key={cat.id}
                          className="bg-stone-900 border border-stone-800 rounded-2xl p-4 transition-all hover:border-stone-700 flex flex-col justify-between gap-3 shadow-2xs"
                        >
                          {isEditing ? (
                            /* Inline Edit Form */
                            <div className="space-y-3 text-xs">
                              <div className="font-bold text-amber-300 flex items-center gap-1.5 pb-1 border-b border-stone-800">
                                <Edit2 className="w-3.5 h-3.5" />
                                <span>Category Edit Karein ({cat.id})</span>
                              </div>

                              <div>
                                <label className="block text-[11px] text-stone-400 font-bold mb-1">
                                  Title:
                                </label>
                                <input
                                  type="text"
                                  value={editCatName}
                                  onChange={(e) => setEditCatName(e.target.value)}
                                  className="w-full px-2.5 py-1.5 bg-stone-950 border border-stone-700 text-white rounded-lg"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] text-stone-400 font-bold mb-1">
                                  Roman Urdu:
                                </label>
                                <input
                                  type="text"
                                  value={editCatRomanUrdu}
                                  onChange={(e) => setEditCatRomanUrdu(e.target.value)}
                                  className="w-full px-2.5 py-1.5 bg-stone-950 border border-stone-700 text-white rounded-lg"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] text-stone-400 font-bold mb-1">
                                  Icon:
                                </label>
                                <select
                                  value={editCatIcon}
                                  onChange={(e) => setEditCatIcon(e.target.value)}
                                  className="w-full px-2.5 py-1.5 bg-stone-950 border border-stone-700 text-white rounded-lg"
                                >
                                  {CATEGORY_ICON_OPTIONS.map((ico) => (
                                    <option key={ico.id} value={ico.id}>
                                      {ico.label}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-[11px] text-stone-400 font-bold mb-1">
                                  Tafseel:
                                </label>
                                <input
                                  type="text"
                                  value={editCatDescription}
                                  onChange={(e) => setEditCatDescription(e.target.value)}
                                  className="w-full px-2.5 py-1.5 bg-stone-950 border border-stone-700 text-white rounded-lg"
                                />
                              </div>

                              <div className="flex items-center gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => saveEditCategory(cat.id)}
                                  className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                  <span>Save Karein</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingCatId(null)}
                                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* Normal View */
                            <>
                              <div>
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-center shadow-xs">
                                      {renderCatBadgeIcon(cat.icon, 'w-5 h-5')}
                                    </div>
                                    <div>
                                      <h5 className="text-sm font-bold text-white flex items-center gap-2">
                                        <span>{cat.name}</span>
                                        {cat.isSystem && (
                                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-800 text-stone-400 font-normal">
                                            Default
                                          </span>
                                        )}
                                      </h5>
                                      {cat.nameRomanUrdu && cat.nameRomanUrdu !== cat.name && (
                                        <p className="text-[11px] text-stone-400">
                                          {cat.nameRomanUrdu}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs">
                                    {count} {count === 1 ? 'Item' : 'Items'}
                                  </span>
                                </div>

                                {cat.description && (
                                  <p className="text-xs text-stone-400 mt-2 line-clamp-2">
                                    {cat.description}
                                  </p>
                                )}

                                <div className="mt-2 text-[10px] font-mono text-stone-500">
                                  Slug ID: <code className="text-stone-400 font-bold">#{cat.id}</code>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center justify-between border-t border-stone-800/80 pt-2.5 mt-1 text-xs">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedProductCategory(cat.id as ProductCategory);
                                    setActiveTab('products');
                                  }}
                                  className="text-amber-400 hover:text-amber-300 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                                >
                                  <span>Is Category Ke Items Dekhein ({count}) →</span>
                                </button>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => startEditCategory(cat)}
                                    className="p-1.5 bg-stone-950 hover:bg-stone-800 text-stone-300 hover:text-white rounded-lg border border-stone-800 transition-colors cursor-pointer"
                                    title="Edit Category"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>

                                  {isDeleting ? (
                                    <div className="flex items-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteCategory(cat.id)}
                                        className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[11px] font-bold cursor-pointer"
                                      >
                                        Delete?
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setDeleteCatConfirmId(null)}
                                        className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-[11px] cursor-pointer"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (count > 0) {
                                          setCatActionError(
                                            `Category "${cat.name}" mein pehle se ${count} items mojood hain! Pehle un items ko doosri category mein shift karein ya delete karein.`
                                          );
                                          setTimeout(() => setCatActionError(''), 4500);
                                          return;
                                        }
                                        setDeleteCatConfirmId(cat.id);
                                      }}
                                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                        count > 0
                                          ? 'bg-stone-950 text-stone-600 border-stone-800 cursor-not-allowed opacity-50'
                                          : 'bg-stone-950 hover:bg-rose-950 text-rose-400 border-stone-800'
                                      }`}
                                      title={count > 0 ? `Is category mein ${count} items hain` : 'Delete Category'}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CUSTOMER ORDERS & TRACKING MANAGEMENT */}
            {activeTab === 'orders' && (
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-900 p-3 rounded-2xl border border-stone-800">
                  <div className="text-xs text-stone-300">
                    Kul Mosool Shuda Orders: <strong className="text-amber-400 font-bold">{safeOrdersList.length}</strong>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
                    {(['all', 'pending', 'confirmed', 'processing', 'dispatched', 'delivered'] as const).map(
                      (st) => (
                        <button
                          key={st}
                          onClick={() => setOrderFilter(st)}
                          className={`px-3 py-1.5 rounded-xl font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                            orderFilter === st
                              ? 'bg-amber-500 text-stone-950 shadow-xs'
                              : 'bg-stone-950 text-stone-300 border border-stone-800 hover:bg-stone-900'
                          }`}
                        >
                          {st === 'all' ? 'Tamam Orders' : st}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                  {filteredOrders.length === 0 ? (
                    <div className="text-center py-12 text-stone-500 text-xs">
                      Koi order mojood nahi hai.
                    </div>
                  ) : (
                    filteredOrders.map((order) => {
                      const cleanPhone = String(order.phone || '').replace(/\D/g, '');
                      const orderItems = Array.isArray(order.items) ? order.items : [];

                      return (
                        <div
                          key={order.id}
                          className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4"
                        >
                          {/* Order Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-800">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-base font-extrabold text-amber-300 font-mono">
                                {order.id}
                              </span>
                              <span className="text-stone-600 text-xs">•</span>
                              <span className="font-bold text-white text-xs">
                                {order.customerName || 'Customer'}
                              </span>
                              <span className="text-stone-600 text-xs">•</span>
                              <span className="text-stone-300 font-mono text-xs">
                                {order.phone || ''}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-stone-400">
                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Naya'}
                              </span>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                  order.status === 'delivered'
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                    : order.status === 'dispatched'
                                    ? 'bg-sky-950 text-sky-300 border border-sky-800'
                                    : order.status === 'processing'
                                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                    : order.status === 'confirmed'
                                    ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                                    : 'bg-stone-800 text-stone-300'
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>
                          </div>

                          {/* Order Items & Customer Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="space-y-2 bg-stone-950 p-3 rounded-xl border border-stone-800">
                              <span className="font-bold text-stone-300 block">
                                Order Items ({orderItems.length}):
                              </span>
                              <div className="space-y-1.5 divide-y divide-stone-800">
                                {orderItems.map((it, idx) => {
                                  const itTitle = it?.product?.titleRomanUrdu || it?.product?.title || 'Suit Item';
                                  const itUnit = it?.product?.unit || 'Item';
                                  const itPrice = it?.product?.price || 0;
                                  const itQty = it?.quantity || 1;

                                  return (
                                    <div key={idx} className="pt-1 flex justify-between items-center">
                                      <div>
                                        <span className="font-bold text-white">
                                          {itTitle}
                                        </span>
                                        <span className="text-stone-400 text-[11px] block">
                                          {itQty} x {itUnit}
                                        </span>
                                      </div>
                                      <span className="font-bold font-serif text-amber-300">
                                        Rs. {(itPrice * itQty).toLocaleString()}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="pt-2 border-t border-stone-800 flex justify-between font-extrabold text-white text-sm">
                                <span>Kul Raqam:</span>
                                <span className="text-amber-400 font-serif">
                                  Rs. {(order.total || 0).toLocaleString()} ({String(order.paymentMethod || 'cod').toUpperCase()})
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2 bg-stone-950 p-3 rounded-xl border border-stone-800 flex flex-col justify-between">
                              <div>
                                <span className="font-bold text-stone-300 block">
                                  Delivery Address:
                                </span>
                                <p className="text-stone-200 mt-1">
                                  📍 {order.address || ''}, <strong>{order.city || ''}</strong>
                                </p>
                                {order.notes ? (
                                  <p className="text-amber-300 bg-amber-950/40 p-1.5 rounded-lg border border-amber-900/50 mt-2 text-[11px]">
                                    📝 Note: {order.notes}
                                  </p>
                                ) : null}
                              </div>

                              {/* WhatsApp Direct Chat with Customer */}
                              {cleanPhone ? (
                                <a
                                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                                    `Assalam-o-Alaikum ${order.customerName || ''}! Main Khan Cloth & Lace Center se rabta kar raha hoon. Aapke order ${order.id} ke hawale se message kiya hai.`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors mt-2"
                                >
                                  <MessageCircle className="w-4 h-4 text-green-400" />
                                  <span>Customer Ko WhatsApp Message Bhejein</span>
                                </a>
                              ) : null}
                            </div>
                          </div>

                          {/* Admin Action Bar: Change Status & Courier Number */}
                          <div className="pt-3 border-t border-stone-800 bg-stone-950/60 p-3 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                              <span className="font-bold text-stone-300 shrink-0">
                                Status Badlein:
                              </span>
                              <select
                                value={order.status}
                                onChange={(e) =>
                                  updateOrderStatus(
                                    order.id,
                                    e.target.value as OrderStatus,
                                    undefined,
                                    courierNameInput[order.id] || order.courierName,
                                    courierInput[order.id] || order.courierTrackingNumber
                                  )
                                }
                                className="bg-stone-900 border border-stone-700 text-white rounded-lg px-2.5 py-1.5 font-bold focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                              >
                                <option value="pending">Tasdeeq Ka Muntazir (Pending)</option>
                                <option value="confirmed">Tasdeeq Shuda (Confirmed)</option>
                                <option value="processing">Cutting & Packing Jari (Processing)</option>
                                <option value="dispatched">Courier Ke Hawale (Dispatched)</option>
                                <option value="delivered">Deliver Ho Gaya (Delivered)</option>
                                <option value="cancelled">Mansookh (Cancelled)</option>
                              </select>
                            </div>

                            {/* Courier Input */}
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                              <input
                                type="text"
                                placeholder="Courier (TCS)"
                                value={
                                  courierNameInput[order.id] !== undefined
                                    ? courierNameInput[order.id]
                                    : order.courierName || ''
                                }
                                onChange={(e) =>
                                  setCourierNameInput({
                                    ...courierNameInput,
                                    [order.id]: e.target.value,
                                  })
                                }
                                className="px-2 py-1.5 bg-stone-900 border border-stone-700 text-white rounded-lg text-xs w-28 focus:outline-none"
                              />

                              <input
                                type="text"
                                placeholder="Tracking # (TCS-12345)"
                                value={
                                  courierInput[order.id] !== undefined
                                    ? courierInput[order.id]
                                    : order.courierTrackingNumber || ''
                                }
                                onChange={(e) =>
                                  setCourierInput({
                                    ...courierInput,
                                    [order.id]: e.target.value,
                                  })
                                }
                                className="px-2 py-1.5 bg-stone-900 border border-stone-700 text-white rounded-lg text-xs font-mono w-36 focus:outline-none"
                              />

                              <button
                                onClick={async () => {
                                  await updateOrderStatus(
                                    order.id,
                                    order.status,
                                    undefined,
                                    courierNameInput[order.id] || order.courierName || 'TCS Express',
                                    courierInput[order.id] || order.courierTrackingNumber || ''
                                  );
                                  setActionSuccessMsg(`Courier tracking live update ho gayi!`);
                                  setTimeout(() => setActionSuccessMsg(''), 2500);
                                }}
                                className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg font-bold shrink-0 cursor-pointer"
                              >
                                Update
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: STORE SETTINGS */}
            {activeTab === 'settings' && (
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 max-w-2xl mx-auto w-full">
                <div className="pb-3 border-b border-stone-800">
                  <h3 className="text-base font-bold text-white font-serif">
                    Dukan Ki Settings (Live Server Store Settings)
                  </h3>
                  <p className="text-xs text-stone-400">
                    WhatsApp number, free delivery limit, announcement message aur admin PIN
                  </p>
                </div>

                {settingsSavedMessage && (
                  <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-200 text-xs font-bold rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{settingsSavedMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-300 mb-1">
                        Dukan Ka Helpline Phone
                      </label>
                      <input
                        type="text"
                        value={settingsPhone}
                        onChange={(e) => setSettingsPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 text-white rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-300 mb-1">
                        WhatsApp Number (Misal: 923001234567)
                      </label>
                      <input
                        type="text"
                        value={settingsWhatsapp}
                        onChange={(e) => setSettingsWhatsapp(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 text-white rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-300 mb-1">
                      Announcement Bar Message (Top Banner)
                    </label>
                    <textarea
                      rows={2}
                      value={settingsAnnouncement}
                      onChange={(e) => setSettingsAnnouncement(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-900 border border-stone-700 text-white rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-stone-300 mb-1">
                        FREE Delivery Minimum Order (PKR)
                      </label>
                      <input
                        type="number"
                        value={settingsFreeThreshold}
                        onChange={(e) => setSettingsFreeThreshold(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 text-white rounded-xl font-bold font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-300 mb-1">
                        Standard Delivery Fee (PKR)
                      </label>
                      <input
                        type="number"
                        value={settingsFee}
                        onChange={(e) => setSettingsFee(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 text-white rounded-xl font-bold font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-300 mb-1">
                        Admin Login Naya PIN Code
                      </label>
                      <input
                        type="text"
                        value={settingsPin}
                        onChange={(e) => setSettingsPin(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 text-amber-300 rounded-xl font-bold font-mono text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-md transition-all cursor-pointer"
                    >
                      Settings Live Server Par Save Karein
                    </button>
                  </div>
                </form>

                {/* Reset to Default Catalog Option (with in-UI confirm) */}
                <div className="pt-6 border-t border-stone-800">
                  <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-white block">
                        Sample Catalog & Orders Reset Karein
                      </span>
                      <span className="text-stone-400">
                        Default demo products aur seed orders ko dobara load karne ke liye.
                      </span>
                    </div>

                    {resetConfirmOpen ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={async () => {
                            await resetToDefaults();
                            setResetConfirmOpen(false);
                            setActionSuccessMsg('Store reset ho gaya!');
                            setTimeout(() => setActionSuccessMsg(''), 2500);
                          }}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs cursor-pointer"
                        >
                          Confirm Reset
                        </button>
                        <button
                          type="button"
                          onClick={() => setResetConfirmOpen(false)}
                          className="px-3 py-1.5 bg-stone-800 text-stone-300 rounded-xl text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setResetConfirmOpen(true)}
                        className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-xl flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                      >
                        <RefreshCcw className="w-3.5 h-3.5" />
                        <span>Default Reset</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
