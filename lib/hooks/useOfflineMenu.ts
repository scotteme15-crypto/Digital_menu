'use client';

import { useState, useEffect, useCallback } from 'react';
import { MenuItem, OfflineState } from '../types';
import { getMenuFromCache, saveMenuToCache } from '../storage';
import { MENU_ITEMS } from '../menu-data';

export function useOfflineMenu() {
  const [state, setState] = useState<OfflineState>({
    isOnline: true,
    lastSyncTime: null,
    cachedMenuData: null,
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize offline detection and load menu
  useEffect(() => {
    const initializeMenu = async () => {
      setIsLoading(true);

      // Register service worker
      if ('serviceWorker' in navigator) {
        try {
          await navigator.serviceWorker.register('/sw.js');
          console.log('[v0] Service Worker registered');
        } catch (error) {
          console.error('[v0] Service Worker registration failed:', error);
        }
      }

      // Determine initial online status
      const isOnline = navigator.onLine;
      console.log('[v0] Initial online status:', isOnline);

      // Try to load from cache first
      const cachedMenu = await getMenuFromCache();
      if (cachedMenu.length > 0) {
        console.log('[v0] Loaded menu from cache');
        setMenuItems(cachedMenu);
      }

      // If online, fetch fresh menu and cache it
      if (isOnline) {
        try {
          // Simulate API call or use real endpoint
          const freshMenu = MENU_ITEMS;
          setMenuItems(freshMenu);
          await saveMenuToCache({
            items: freshMenu,
            lastUpdated: Date.now(),
          });
          setState((prev) => ({
            ...prev,
            isOnline: true,
            lastSyncTime: Date.now(),
          }));
        } catch (error) {
          console.error('[v0] Error fetching fresh menu:', error);
        }
      } else {
        setState((prev) => ({
          ...prev,
          isOnline: false,
        }));
      }

      setIsLoading(false);
    };

    initializeMenu();
  }, []);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      console.log('[v0] Online');
      setState((prev) => ({
        ...prev,
        isOnline: true,
      }));
    };

    const handleOffline = () => {
      console.log('[v0] Offline');
      setState((prev) => ({
        ...prev,
        isOnline: false,
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const refershMenu = useCallback(async () => {
    if (!navigator.onLine) {
      console.log('[v0] Cannot refresh while offline');
      return;
    }

    setIsLoading(true);
    try {
      const freshMenu = MENU_ITEMS;
      setMenuItems(freshMenu);
      await saveMenuToCache({
        items: freshMenu,
        lastUpdated: Date.now(),
      });
      setState((prev) => ({
        ...prev,
        lastSyncTime: Date.now(),
      }));
    } catch (error) {
      console.error('[v0] Error refreshing menu:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    menuItems,
    isLoading,
    isOnline: state.isOnline,
    lastSyncTime: state.lastSyncTime,
    refreshMenu: refershMenu,
  };
}
