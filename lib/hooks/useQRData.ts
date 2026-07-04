import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { decompressMenuData } from '@/lib/qr-utils';
import { MenuItem } from '@/lib/types';
import { MENU_ITEMS } from '@/lib/menu-data';

export function useQRData() {
  const searchParams = useSearchParams();
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [isQRLoaded, setIsQRLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if there's QR data in the URL
    const qrData = searchParams?.get('qr');

    if (qrData) {
      try {
        // Decode the QR data
        const decompressed = decompressMenuData(decodeURIComponent(qrData));

        if (decompressed.length > 0) {
          setMenuItems(decompressed);
          setIsQRLoaded(true);
          console.log('[v0] QR data loaded:', decompressed.length, 'items');
        } else {
          setError('Invalid QR data format');
        }
      } catch (err) {
        console.error('[v0] Failed to decode QR data:', err);
        setError('Failed to decode QR data');
      }
    }
  }, [searchParams]);

  return {
    menuItems,
    isQRLoaded,
    error,
  };
}
