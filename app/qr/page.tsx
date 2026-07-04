'use client';

import { QRCodeGenerator } from '@/components/QRCodeGenerator';
import { MENU_ITEMS } from '@/lib/menu-data';
import { QrCode } from 'lucide-react';
import Link from 'next/link';

export default function QRPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-menu-border bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-menu-accent p-2 rounded-lg">
                <QrCode size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-menu-text">Menu QR Code Generator</h1>
                <p className="text-sm text-menu-text-secondary">Data-embedded QR code for your digital menu</p>
              </div>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-menu-accent text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Back to Menu
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <QRCodeGenerator menuItems={MENU_ITEMS} />
      </div>
    </main>
  );
}
