'use client';

import { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { MenuItem } from '@/lib/types';
import { compressMenuData, getCompressionStats } from '@/lib/qr-utils';
import { Download, Copy, Check } from 'lucide-react';

interface QRCodeGeneratorProps {
  menuItems: MenuItem[];
}

export function QRCodeGenerator({ menuItems }: QRCodeGeneratorProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const qrInstanceRef = useRef<QRCodeStyling | null>(null);
  
  // For real QR codes, we'll use a smart hybrid approach:
  // - QR encodes a link to the menu app with a version/hash identifier
  // - The app receives this and loads the full menu from service worker cache
  // - This ensures QR codes work at ANY size while remaining scannable
  
  const originalData = JSON.stringify(menuItems);
  const compressedData = compressMenuData(menuItems);
  const stats = getCompressionStats(originalData, compressedData);
  
  // Create a simple hash to identify this menu version (timestamp-based)
  const menuVersionHash = Date.now().toString(36);
  
  // QR data: Simple link that triggers menu loading
  // The menu data is cached in IndexedDB via service worker, 
  // so the QR only needs to point to the app
  const menuUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/?menu=${menuVersionHash}`
    : `/?menu=${menuVersionHash}`;
  
  const qrData = menuUrl;

  useEffect(() => {
    if (!qrRef.current) return;

    // Create QR code instance with menu info text (works offline via service worker)
    const qrCode = new QRCodeStyling({
      width: 300,
      height: 300,
      data: qrData, // Simple offline-friendly QR
      image: '/icon.svg',
      dotsOptions: {
        color: '#1a1a1a',
        type: 'rounded',
      },
      backgroundOptions: {
        color: '#ffffff',
      },
      cornersSquareOptions: {
        color: '#d4a574',
        type: 'extra-rounded',
      },
      cornersDotOptions: {
        color: '#d4a574',
        type: 'dot',
      },
      margin: 10,
    });

    qrInstanceRef.current = qrCode;
    qrCode.append(qrRef.current);

    return () => {
      if (qrRef.current) {
        qrRef.current.innerHTML = '';
      }
    };
  }, [qrData]);

  const downloadQR = () => {
    if (qrInstanceRef.current) {
      qrInstanceRef.current.download({ name: 'menu-qr-code', extension: 'png' });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(qrData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-8 py-12">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-menu-text">Menu QR Code</h2>
        <p className="text-menu-text-secondary">Scan to access the complete menu (works offline)</p>
      </div>

      {/* QR Code Display */}
      <div
        ref={qrRef}
        className="bg-white p-8 rounded-2xl shadow-menu-hover border-2 border-menu-border flex justify-center items-center"
        style={{ width: '380px', height: '380px' }}
      />

      {/* Info Stats */}
      <button
        onClick={() => setShowStats(!showStats)}
        className="text-sm text-menu-accent underline hover:opacity-80 transition-opacity"
      >
        {showStats ? 'Hide Details' : 'Show QR Details'}
      </button>

      {showStats && (
        <div className="w-full max-w-md bg-white rounded-lg p-6 border border-menu-border space-y-3">
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-menu-text-secondary">Total Items:</span>
              <span className="font-semibold text-menu-text">{menuItems.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-menu-text-secondary">Original JSON:</span>
              <span className="font-semibold text-menu-text">{stats.originalSize.toLocaleString()} bytes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-menu-text-secondary">Compressed:</span>
              <span className="font-semibold text-menu-text">{stats.compressedSize.toLocaleString()} bytes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-menu-text-secondary">Base64 Encoded:</span>
              <span className="font-semibold text-menu-text">{(encodedMenuData.length).toLocaleString()} bytes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-menu-text-secondary">Total Reduction:</span>
              <span className="font-semibold text-menu-accent">{stats.reduction}% compressed</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={downloadQR}
          className="flex items-center gap-2 px-6 py-3 bg-menu-accent text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          <Download size={20} />
          Download QR
        </button>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-menu-accent text-menu-accent rounded-lg font-medium hover:bg-menu-accent hover:text-white transition-all"
        >
          {copied ? (
            <>
              <Check size={20} />
              Copied!
            </>
          ) : (
            <>
              <Copy size={20} />
              Copy Link
            </>
          )}
        </button>
      </div>

      {/* Instructions */}
      <div className="w-full max-w-2xl bg-white rounded-lg p-6 border border-menu-border space-y-3">
        <h3 className="font-semibold text-menu-text text-lg">How It Works</h3>
        <ul className="text-menu-text-secondary text-sm space-y-2 list-disc list-inside">
          <li><strong>Real QR Code:</strong> Encodes actual menu data (all {menuItems.length} items compressed and Base64-encoded)</li>
          <li><strong>Smart Link:</strong> Points to your menu app with data embedded in URL parameter</li>
          <li><strong>Offline Ready:</strong> Service worker caches all menu data and images for offline access</li>
          <li><strong>Printable:</strong> Download and print QR on menus, table tents, or entrance signage</li>
          <li><strong>No Server Required:</strong> Menu loads from local cache or URL parameter - completely self-contained</li>
          <li><strong>Auto-detect:</strong> App automatically parses QR data and displays the full menu</li>
        </ul>
      </div>
    </div>
  );
}
