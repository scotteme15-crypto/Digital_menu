'use client';

import { MenuItem } from '@/lib/types';
import Image from 'next/image';
import { Flame, Leaf } from 'lucide-react';

export function MenuCard({ item }: { item: MenuItem }) {
  return (
    <div className="group overflow-hidden rounded-xl border border-menu-border bg-menu-card shadow-menu transition-all hover:shadow-menu-hover">
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-menu-accent/10 to-transparent">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        {!item.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="font-semibold text-white">Currently Unavailable</span>
          </div>
        )}
        {item.spiceLevel > 0 && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1">
            {Array(item.spiceLevel)
              .fill(0)
              .map((_, i) => (
                <Flame key={i} size={14} className="fill-menu-accent text-menu-accent" />
              ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3 p-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-menu-text">{item.name}</h3>
          <p className="line-clamp-2 text-sm text-menu-text-secondary">{item.description}</p>
        </div>

        {/* Dietary Tags */}
        {item.dietary.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.dietary.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-menu-accent/10 px-2 py-1 text-xs font-medium text-menu-accent"
              >
                <Leaf size={12} />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-menu-border pt-3">
          <div className="space-y-0.5">
            <p className="text-2xl font-bold text-menu-accent">${item.price}</p>
            <p className="text-xs text-menu-text-secondary">{item.prepTime}min prep</p>
          </div>
          <button
            disabled={!item.available}
            className="rounded-lg bg-menu-accent px-4 py-2 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            Order
          </button>
        </div>
      </div>
    </div>
  );
}
