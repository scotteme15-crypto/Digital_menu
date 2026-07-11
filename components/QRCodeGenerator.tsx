'use client';

import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { MenuItem } from '@/lib/types';
import { compressMenuData, getCompressionStats } from '@/lib/qr-utils';
import { Download, Copy, Check } from 'lucide-react';

interface QRCodeGeneratorProps {
  menuItems: MenuItem[];
}

export function QRCodeGenerator({ menuItems }: QRCodeGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const qrRef = useRef<SVGSVGElement>(null);
  
  const originalData = JSON.stringify(menuItems);
  const compressedData = compressMenuData(menuItems);
  const stats = getCompressionStats(originalData, compressedData);
  
  // Encode compressed menu data in Base64 (for stats display)
  const encodedMenuData = typeof window !== 'undefined'
    ? btoa(compressedData)
    : Buffer.from(compressedData, 'utf-8').toString('base64');
  
  // QR data: Use the specified URL
  const menuUrl = 'https://digital-menu-teme3.vercel.app/';
  
  const downloadQR = () => {
    if (!qrRef.current) return;
    const svgData = new XMLSerializer().serializeToString(qrRef.current);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'menu-qr-code.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(menuUrl);
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
      <a
        href={menuUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-white p-8 rounded-2xl shadow-menu-hover border-2 border-menu-border flex justify-center items-center cursor-pointer hover:scale-105 transition-transform"
      >
        <QRCodeSVG
          ref={qrRef}
          value={menuUrl}
          size={300}
          level="H"
          includeMargin={true}
        />
      </a>

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
              <span className="font-semibold text-menu-text">{encodedMenuData.length.toLocaleString()} bytes</span>
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
          <li><strong>Scan QR Code:</strong> Use your phone's camera to scan the QR code</li>
          <li><strong>Click/Tap QR Code:</strong> You can also click or tap the QR code to open the menu directly</li>
          <li><strong>Offline Ready:</strong> Service worker caches all menu data and images for offline access</li>
          <li><strong>Printable:</strong> Download and print QR on menus, table tents, or entrance signage</li>
        </ul>
      </div>
    </div>
  );
}
