'use client';

import React, { useState, useMemo } from 'react';
import { Search, UtensilsCrossed } from 'lucide-react';
import { MENU_ITEMS } from '../../lib/restaurantData';
import { restaurantConfig } from '../../config/restaurant.config';
import { Button } from '../../components/ui/Button';
import { DishCard } from '../../components/DishCard';

export const MenuClient: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDiet, setSelectedDiet] = useState<string>('all');
  const [selectedSpice, setSelectedSpice] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = restaurantConfig.categories;

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Category match
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Dietary match
      if (selectedDiet !== 'all' && item.dietary !== selectedDiet) {
        return false;
      }
      // Spice match
      if (selectedSpice !== 'all' && item.spiceLevel !== selectedSpice) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCategory = item.categoryLabel.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedDiet, selectedSpice, searchQuery]);

  return (
    <div className="space-y-10">
      {/* Filter and Search Bar */}
      <div className="space-y-4 bg-white p-4 sm:p-6 rounded-2xl border border-stone-200/90 shadow-2xs">
        {/* Search & Diet Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, biryani, chicken 65, naan..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-stone-500 mr-1">Diet:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'non-veg', label: 'Non-Veg' },
              { id: 'veg', label: 'Vegetarian' },
              { id: 'egg', label: 'Egg' },
            ].map((diet) => (
              <button
                key={diet.id}
                onClick={() => setSelectedDiet(diet.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  selectedDiet === diet.id
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {diet.label}
              </button>
            ))}

            <span className="text-xs font-medium text-stone-500 ml-2 mr-1">Spice:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'mild', label: 'Mild' },
              { id: 'medium', label: 'Medium' },
              { id: 'fiery', label: 'Fiery' },
            ].map((sp) => (
              <button
                key={sp.id}
                onClick={() => setSelectedSpice(sp.id)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  selectedSpice === sp.id
                    ? 'bg-orange-600 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {sp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 border-t border-stone-100 no-scrollbar">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-xs font-semibold'
                    : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-white rounded-2xl border border-stone-200">
          <UtensilsCrossed className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">No dishes match your filters</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try resetting your dietary or spice filter to view our complete kitchen selection.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedCategory('all');
              setSelectedDiet('all');
              setSelectedSpice('all');
              setSearchQuery('');
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
<<<<<<< HEAD
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
=======
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
>>>>>>> cfd262b4b3de7e01126dc556d5bc97fc881042bb
          {filteredItems.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      )}
    </div>
  );
};
