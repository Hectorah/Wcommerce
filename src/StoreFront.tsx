import React, { useState, useMemo, useEffect } from 'react';
import { JerseyProduct, JerseySize, CartItem, ProductCategory, SiteSettings } from './types';
import { calculateCartSummary } from './utils/cartUtils';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { ProductGrid } from './components/ProductGrid';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { WholesaleInfoModal } from './components/WholesaleInfoModal';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';

export function StoreFront({ products, settings }: { products: JerseyProduct[]; settings: SiteSettings }) {
  // Theme State (Dark / Light Mode)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('flash_sport_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return 'dark'; // Dark default with minimalist high contrast
    } catch {
      return 'dark';
    }
  });

  // Apply theme class to <html> and save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('flash_sport_theme', theme);
    } catch (e) {
      console.warn('Failed to save theme in localStorage', e);
    }

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };


  // Cart State (initialized from localStorage if available)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('flash_sport_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save cart to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('flash_sport_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('todas');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'name-asc'>('popular');
  const [selectedVersionFilter, setSelectedVersionFilter] = useState<string>('all');

  // Modals & UI States
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [isWholesaleInfoOpen, setIsWholesaleInfoOpen] = useState<boolean>(false);
  const [detailModalProduct, setDetailModalProduct] = useState<JerseyProduct | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Calculate Cart Pricing & Tiers
  const cartSummary = useMemo(() => calculateCartSummary(cartItems), [cartItems]);

  // Toast Helper
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 2800);
  };

  // Add To Cart Handler
  const handleAddToCart = (
    product: JerseyProduct,
    size: JerseySize,
    quantity: number,
    customName?: string,
    customNumber?: string
  ) => {
    const customSuffix = customName || customNumber ? `-${customNumber || ''}-${customName || ''}` : '';
    const cartItemId = `${product.id}-${size}${customSuffix}`;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            cartItemId,
            product,
            size,
            quantity,
            customName,
            customNumber,
          },
        ];
      }
    });

    showToast(`✓ ${quantity}x ${product.name} (${size}) en tu pedido`);
  };

  // Update Cart Quantity
  const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(cartItemId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item))
    );
  };

  // Remove Single Cart Item
  const handleRemoveFromCart = (cartItemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.cartItemId !== cartItemId));
  };

  // Clear Cart
  const handleClearCart = () => {
    setCartItems([]);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('todas');
    setSortBy('popular');
    setSelectedVersionFilter('all');
  };

  // Filtered & Sorted Products List
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const matchName = p.name.toLowerCase().includes(query);
        const matchTeam = p.team.toLowerCase().includes(query);
        const matchLeague = p.league.toLowerCase().includes(query);
        const matchPlayers = p.popularPlayers?.some((pl) => pl.toLowerCase().includes(query));
        const matchBadges = p.badges?.some((b) => b.toLowerCase().includes(query));
        return matchName || matchTeam || matchLeague || matchPlayers || matchBadges;
      });
    }

    // 2. Category Filter
    if (selectedCategory !== 'todas') {
      if (selectedCategory === 'version-jugador') {
        list = list.filter((p) => p.version === 'Versión Jugador');
      } else {
        list = list.filter((p) => p.category === selectedCategory);
      }
    }

    // 3. Version Filter
    if (selectedVersionFilter !== 'all') {
      list = list.filter((p) => p.version === selectedVersionFilter);
    }

    // 4. Sorting
    list.sort((a, b) => {
      if (sortBy === 'popular') {
        const aScore = (a.isFeatured ? 2 : 0) + (a.badges.includes('Top Ventas') ? 1 : 0);
        const bScore = (b.isFeatured ? 2 : 0) + (b.badges.includes('Top Ventas') ? 1 : 0);
        return bScore - aScore;
      }
      if (sortBy === 'price-asc') {
        return a.retailPrice - b.retailPrice;
      }
      if (sortBy === 'price-desc') {
        return b.retailPrice - a.retailPrice;
      }
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return list;
  }, [products, searchQuery, selectedCategory, selectedVersionFilter, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-brand-primary selection:text-slate-950 flex flex-col transition-colors duration-200">
      
      {/* Top Fixed Navbar */}
      <Navbar
        cartItemCount={cartSummary.totalItems}
        cartTotal={cartSummary.currentTotal}
        isWholesale={cartSummary.isWholesale}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        onOpenWholesaleInfo={() => setIsWholesaleInfoOpen(true)}
      />

      {/* Hero / Banner Section with Minimalist Calculator */}
      <Hero
        cartItemCount={cartSummary.totalItems}
        isWholesale={cartSummary.isWholesale}
        onOpenWholesaleModal={() => setIsWholesaleInfoOpen(true)}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        settings={settings}
      />

      {/* Sticky Filter & Search Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        selectedVersionFilter={selectedVersionFilter}
        onVersionFilterChange={setSelectedVersionFilter}
        totalResultsCount={filteredProducts.length}
      />

      {/* Main Catalog Grid */}
      <main className="flex-1 max-w-[1920px] mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8">
        
        {/* Section Heading */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2 uppercase">
              <span>Modelos Disponibles</span>
              <span className="text-[10px] font-mono font-bold text-brand-primary dark:text-brand-primary bg-brand-primary/20 px-2 py-0.5 rounded-full border border-brand-primary/20">
                {filteredProducts.length} disponibles
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
                {cartSummary.isWholesale 
                  ? `Tarifa Mayorista Activada (-$${cartSummary.totalSaved.toFixed(2)})`
                  : 'Lleva 3 o más camisetas para activar tarifa mayorista automáticamente.'}
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={filteredProducts}
          isWholesaleActive={cartSummary.isWholesale}
          onAddToCart={handleAddToCart}
          onOpenDetails={(product) => setDetailModalProduct(product)}
          onResetFilters={handleResetFilters}
        />
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        whatsappNumbers={settings.whatsappNumbers || []}
      />

      {/* Product Detail & Customization Modal */}
      <ProductDetailModal
        product={detailModalProduct}
        onClose={() => setDetailModalProduct(null)}
        isWholesaleActive={cartSummary.isWholesale}
        onAddToCart={handleAddToCart}
        onOpenSizeGuide={() => {
          setDetailModalProduct(null);
          setIsSizeGuideOpen(true);
        }}
      />

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      {/* Wholesale Info & Policies Modal */}
      <WholesaleInfoModal
        isOpen={isWholesaleInfoOpen}
        onClose={() => setIsWholesaleInfoOpen(false)}
      />


      {/* Toast Notification */}
      <Toast message={toastMessage} onOpenCart={() => setIsCartOpen(true)} />

      {/* Footer */}
      <Footer
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        onOpenWholesaleInfo={() => setIsWholesaleInfoOpen(true)}
      />

    </div>
  );
}
