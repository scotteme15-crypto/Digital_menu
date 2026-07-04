'use client';

import { AlertCircle, Wifi } from 'lucide-react';

interface OfflineIndicatorProps {
  isOnline: boolean;
  lastSyncTime?: number | null;
}

export function OfflineIndicator({ isOnline, lastSyncTime }: OfflineIndicatorProps) {
  if (isOnline && !lastSyncTime) {
    return null;
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium ${
        isOnline
          ? 'border border-green-200 bg-green-50 text-green-700'
          : 'border border-yellow-200 bg-yellow-50 text-yellow-700'
      }`}
    >
      {isOnline ? (
        <>
          <Wifi size={16} />
          <span>Online • Last synced {lastSyncTime ? formatTime(lastSyncTime) : 'now'}</span>
        </>
      ) : (
        <>
          <AlertCircle size={16} />
          <span>Offline mode • Menu cached locally</span>
        </>
      )}
    </div>
  );
}
