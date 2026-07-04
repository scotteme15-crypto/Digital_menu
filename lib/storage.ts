'use client';

import { MenuData, MenuItem } from './types';

const DB_NAME = 'HotelMenuDB';
const STORE_NAME = 'menu';

let db: IDBDatabase | null = null;

export async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => {
      console.error('[v0] IndexedDB error:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      console.log('[v0] IndexedDB initialized');
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const target = event.target as IDBOpenDBRequest;
      const database = target.result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' });
        console.log('[v0] Menu object store created');
      }
    };
  });
}

export async function saveMenuToCache(menuData: MenuData): Promise<void> {
  try {
    const database = await initDB();
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // Clear existing data
    await new Promise((resolve, reject) => {
      const clearRequest = store.clear();
      clearRequest.onsuccess = () => resolve(null);
      clearRequest.onerror = () => reject(clearRequest.error);
    });

    // Save each menu item
    for (const item of menuData.items) {
      await new Promise((resolve, reject) => {
        const addRequest = store.add(item);
        addRequest.onsuccess = () => resolve(null);
        addRequest.onerror = () => reject(addRequest.error);
      });
    }

    // Save metadata
    localStorage.setItem('menuLastUpdated', Date.now().toString());
    console.log('[v0] Menu saved to cache');
  } catch (error) {
    console.error('[v0] Error saving menu to cache:', error);
  }
}

export async function getMenuFromCache(): Promise<MenuItem[]> {
  try {
    const database = await initDB();
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        console.log('[v0] Retrieved menu from cache:', request.result.length, 'items');
        resolve(request.result || []);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('[v0] Error retrieving menu from cache:', error);
    return [];
  }
}

export function getLastUpdateTime(): number | null {
  const lastUpdated = localStorage.getItem('menuLastUpdated');
  return lastUpdated ? parseInt(lastUpdated, 10) : null;
}

export function setLastUpdateTime(timestamp: number): void {
  localStorage.setItem('menuLastUpdated', timestamp.toString());
}

export async function clearCache(): Promise<void> {
  try {
    const database = await initDB();
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    await new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve(null);
      request.onerror = () => reject(request.error);
    });

    localStorage.removeItem('menuLastUpdated');
    console.log('[v0] Cache cleared');
  } catch (error) {
    console.error('[v0] Error clearing cache:', error);
  }
}
