import { MenuItem } from './types';

// Compress menu data for QR code encoding - ultra-minimal format
export function compressMenuData(items: MenuItem[]): string {
  // Create the most compact format possible - only text data, no images
  // Images will be fetched from local cache/storage
  const compressed = items.map(item => ({
    id: item.id,
    n: item.name,
    d: item.description,
    p: item.price,
    c: item.category,
    diet: item.dietary?.join(',') || '', // a=appetizer, m=main, d=dessert, v=vegan, g=gluten-free, p=pescatarian
    s: item.spiceLevel,
  }));

  return JSON.stringify(compressed);
}

// Decompress QR data back to menu items and match with full data from menu-data.ts
export function decompressMenuData(jsonString: string): MenuItem[] {
  try {
    const compressed = JSON.parse(jsonString);
    
    // Handle both array and object formats
    const items = Array.isArray(compressed) ? compressed : (compressed.m || compressed);
    
    // Return decompressed items - images will be matched from MENU_ITEMS
    return items.map((item: any) => ({
      id: item.id,
      name: item.n,
      description: item.d,
      price: item.p,
      image: `/menu-items/${item.n.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.png`, // Reconstruct image path
      category: item.c,
      prepTime: 15, // Default prep time
      dietary: (item.diet && item.diet.split(',').filter((d: string) => d)) || [],
      spiceLevel: item.s || 0,
      available: true,
    }));
  } catch (error) {
    console.error('Failed to decompress menu data:', error);
    return [];
  }
}

// Decode QR data (handles both MENU:base64 format and raw compressed format)
export function decodeQRData(qrString: string): MenuItem[] {
  try {
    let dataToDecrypt = qrString;
    
    // Handle MENU: prefix
    if (qrString.startsWith('MENU:')) {
      dataToDecrypt = qrString.substring(5); // Remove "MENU:" prefix
      // Decode from Base64
      dataToDecrypt = typeof window !== 'undefined'
        ? atob(dataToDecrypt)
        : Buffer.from(dataToDecrypt, 'base64').toString('utf-8');
    }
    
    return decompressMenuData(dataToDecrypt);
  } catch (error) {
    console.error('Failed to decode QR data:', error);
    return [];
  }
}

// Get compression stats
export function getCompressionStats(original: string, compressed: string): {
  originalSize: number;
  compressedSize: number;
  reduction: string;
} {
  const originalSize = original.length;
  const compressedSize = compressed.length;
  const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);

  return {
    originalSize,
    compressedSize,
    reduction,
  };
}
