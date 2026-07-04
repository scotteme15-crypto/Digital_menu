'use client';

import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-menu-text-secondary" size={20} />
      <input
        type="text"
        placeholder="Search menu items..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-menu-border bg-white py-2 pl-10 pr-10 text-menu-text placeholder-menu-text-secondary focus:border-menu-accent focus:outline-none"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-menu-text-secondary hover:text-menu-text"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
