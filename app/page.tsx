'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MenuCard } from '@/components/MenuCard';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { CategoryFilter } from '@/components/CategoryFilter';
import { SearchBar } from '@/components/SearchBar';
import { useOfflineMenu } from '@/lib/hooks/useOfflineMenu';
import { MenuItem } from '@/lib/types';
import { decodeQRData } from '@/lib/qr-utils';
import { UtensilsCrossed, QrCode } from 'lucide-react';

function PageContent() {
  const searchParams = useSearchParams();
  const { menuItems: cachedMenuItems, isLoading, isOnline, lastSyncTime, refreshMenu } = useOfflineMenu();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'appetizer' | 'main' | 'dessert' | 'beverage'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Check for QR data in URL params and decode it
  useEffect(() => {
    const qrData = searchParams.get('qr');
    if (qrData) {
      try {
        const decodedMenu = decodeQRData(decodeURIComponent(qrData));
        if (decodedMenu.length > 0) {
          setMenuItems(decodedMenu);
        } else {
          setMenuItems(cachedMenuItems);
        }
      } catch (error) {
        console.log('[v0] QR decode error, using cached menu');
        setMenuItems(cachedMenuItems);
      }
    } else {
      setMenuItems(cachedMenuItems);
    }
  }, [searchParams, cachedMenuItems]);

  // Filter menu items
  const filteredItems = menuItems.filter((item: MenuItem) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-menu-border bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-menu-accent p-2 rounded-lg">
                <UtensilsCrossed size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-menu-text">Hotel Dining Menu</h1>
                <p className="text-sm text-menu-text-secondary">Scan any time, works offline</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href="/qr"
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-menu-accent text-menu-accent rounded-lg font-medium hover:bg-menu-accent hover:text-white transition-all"
              >
                <QrCode size={20} />
                QR Code
              </Link>
              <button
                onClick={refreshMenu}
                disabled={!isOnline || isLoading}
                className="px-4 py-2 bg-menu-accent text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {isLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Status Indicator */}
          <OfflineIndicator isOnline={isOnline} lastSyncTime={lastSyncTime} />
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="space-y-4 mb-8">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />
        </div>

        {/* Menu Grid */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item: MenuItem) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-menu-text-secondary text-lg">No items found matching your search</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense>
      <PageContent />
    </Suspense>
  );
}
