import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCategory } from '../types';
import {
  Sparkles,
  Scissors,
  Layers,
  Wind,
  Bed,
  Heart,
  SlidersHorizontal,
  Tag,
  Shirt,
  ShoppingBag,
  Star,
} from 'lucide-react';

interface CategoryFilterProps {
  sortBy: string;
  setSortBy: (val: string) => void;
  filteredCount: number;
}

const renderCategoryIcon = (icon?: string) => {
  switch (icon) {
    case 'scissors':
      return <Scissors className="w-4 h-4 text-emerald-600" />;
    case 'layers':
      return <Layers className="w-4 h-4 text-rose-500" />;
    case 'sparkles':
      return <Sparkles className="w-4 h-4 text-amber-500" />;
    case 'wind':
      return <Wind className="w-4 h-4 text-sky-600" />;
    case 'bed':
      return <Bed className="w-4 h-4 text-indigo-500" />;
    case 'heart':
      return <Heart className="w-4 h-4 text-emerald-700" />;
    case 'shirt':
      return <Shirt className="w-4 h-4 text-violet-600" />;
    case 'shopping-bag':
      return <ShoppingBag className="w-4 h-4 text-pink-600" />;
    case 'star':
      return <Star className="w-4 h-4 text-amber-500" />;
    case 'tag':
    default:
      return <Tag className="w-4 h-4 text-teal-600" />;
  }
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  sortBy,
  setSortBy,
  filteredCount,
}) => {
  const {
    activeCategory,
    setActiveCategory,
    products,
    categories,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const filterTabs = [
    {
      id: 'all',
      label: 'Tamam Items',
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
    },
    ...categories.map((c) => ({
      id: c.id,
      label: c.name,
      subLabel: c.nameRomanUrdu && c.nameRomanUrdu !== c.name ? c.nameRomanUrdu : undefined,
      icon: renderCategoryIcon(c.icon),
    })),
  ];

  const getCategoryCount = (catId: ProductCategory) => {
    if (catId === 'all') return products.length;
    return products.filter((p) => p.category === catId).length;
  };

  return (
    <div id="catalog-section" className="scroll-mt-24 mb-8">
      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 no-scrollbar">
        {filterTabs.map((c) => {
          const isActive = activeCategory === c.id;
          const count = getCategoryCount(c.id);
          return (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer shadow-2xs ${
                isActive
                  ? 'bg-emerald-900 text-amber-300 ring-2 ring-emerald-800 shadow-md'
                  : 'bg-white text-stone-700 hover:bg-stone-100 hover:text-stone-900 border border-stone-200'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
              <span
                className={`ml-1 text-[11px] px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-amber-400/20 text-amber-200'
                    : 'bg-stone-100 text-stone-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Control bar in Roman Urdu */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-600 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-stone-900">
            {filteredCount} Products Dastiyab Hain
          </span>
          {searchQuery && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
              <span>Talash: &ldquo;{searchQuery}&rdquo;</span>
              <button
                onClick={() => setSearchQuery('')}
                className="hover:text-amber-950 font-bold ml-1 cursor-pointer"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <SlidersHorizontal className="w-4 h-4 text-stone-400" />
          <span className="text-stone-500 font-medium text-xs">Tarteeb Dein:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-700"
          >
            <option value="featured">Numayan (Featured)</option>
            <option value="price-low">Qeemat: Kam se Zyada</option>
            <option value="price-high">Qeemat: Zyada se Kam</option>
            <option value="rating">Aala Rating (Top Rated)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
