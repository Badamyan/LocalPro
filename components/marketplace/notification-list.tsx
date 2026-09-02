'use client';

import { useState } from 'react';
import type { NotificationWithDetails } from '@/services/notification-service';

type NotificationsListProps = {
  initialNotifications?: NotificationWithDetails[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
};

export function NotificationsList({
  initialNotifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationsListProps) {
  const [notifications, setNotifications] = useState<NotificationWithDetails[]>(initialNotifications);
  const [loading, setLoading] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed to mark notification as read');
      const result = await res.json();
      if (result.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        onMarkAsRead?.(id);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/notifications/read-all', { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed to mark all as read');
      const result = await res.json();
      if (result.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        onMarkAllAsRead?.();
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <section className="mt-10 border-t border-slate-200 pt-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Messages</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">Notifications</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">
            {unreadCount} {unreadCount === 1 ? 'unread' : 'unread'}
          </span>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={loading}
              className="rounded-lg bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100 disabled:opacity-50"
            >
              {loading ? 'Marking...' : 'Mark all as read'}
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {notifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-600">
            No notifications yet.
          </div>
        ) : (
          notifications.map((notification) => (
            <article
              key={notification.id}
              className={`rounded-2xl border p-4 transition-colors ${
                notification.isRead
                  ? 'border-slate-200 bg-white'
                  : 'border-brand-200 bg-brand-50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {!notification.isRead && (
                      <span className="inline-block h-2 w-2 rounded-full bg-brand-600"></span>
                    )}
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {notification.type.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <p className={`mt-1 ${notification.isRead ? 'text-slate-600' : 'font-semibold text-slate-900'}`}>
                    {notification.message}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>
                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="flex-shrink-0 rounded-lg bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-200"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
