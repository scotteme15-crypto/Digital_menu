export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'appetizer' | 'main' | 'dessert' | 'beverage';
  prepTime: number; // in minutes
  dietary: string[]; // e.g., ['vegetarian', 'gluten-free']
  spiceLevel: 0 | 1 | 2 | 3; // 0 = mild, 3 = very spicy
  available: boolean;
}

export interface MenuData {
  items: MenuItem[];
  lastUpdated: number;
}

export interface OfflineState {
  isOnline: boolean;
  lastSyncTime: number | null;
  cachedMenuData: MenuData | null;
}
