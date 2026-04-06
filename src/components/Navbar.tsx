import React, { useState, useRef, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { ProfileMenu } from './ProfileMenu';

export const Navbar = () => {
  const { activeView, setSidebarOpen, notifications, markNotificationRead } = useDashboard();
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  
  const getTitle = () => {
    switch (activeView) {
      case 'overview': return 'Dashboard Overview';
      case 'transactions': return 'Transactions';
      case 'analytics': return 'Insights';
      case 'reports': return 'Monthly Reports';
      case 'admin': return 'Admin Controls';
      default: return 'Dashboard';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    if (!isNotificationsOpen) return undefined;

    const handlePointerDown = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isNotificationsOpen]);

  return (
    <header className="fixed top-0 right-0 w-full lg:w-[calc(100%-240px)] z-40 bg-surface/80 backdrop-blur-xl flex justify-between items-center px-4 sm:px-8 h-16 border-b border-outline-variant/10">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 -ml-2 text-on-surface hover:bg-surface-container-low rounded-full transition-colors flex items-center"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h1 className="text-lg font-extrabold tracking-tight text-on-surface">{getTitle()}</h1>
      </div>
      
      <div className="flex items-center gap-4 sm:gap-6 h-full py-3">
        <div className="hidden sm:flex items-center">
           <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Last Updated: <span className="text-on-surface">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></span>
        </div>

        <div className="relative flex items-center justify-center mr-2" ref={notifRef}>
          <button 
             onClick={() => setNotificationsOpen(!isNotificationsOpen)}
             className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors relative flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full ring-2 ring-surface"></span>}
          </button>
          
          {isNotificationsOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-80 bg-surface text-on-surface rounded-2xl shadow-xl border border-outline-variant/20 overflow-hidden z-50">
               <div className="flex justify-between items-center px-6 py-4 border-b border-outline-variant/10 bg-surface-container-lowest">
                  <h4 className="font-bold text-sm">Notifications</h4>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest bg-surface-container-high px-2 py-1 rounded">{unreadCount} New</span>
               </div>
               <div className="max-h-[300px] overflow-y-auto">
                 {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div key={n.id} onClick={() => markNotificationRead(n.id)} className={`px-6 py-4 border-b border-outline-variant/10 cursor-pointer hover:bg-surface-container-lowest transition-colors ${!n.isRead ? 'bg-primary/5' : 'bg-surface'}`}>
                        <div className="flex justify-between items-start mb-1">
                          <p className={`text-xs font-bold ${!n.isRead ? 'text-primary' : 'text-on-surface'}`}>{n.title}</p>
                          <span className="text-[10px] text-on-surface-variant font-medium">{n.time}</span>
                        </div>
                        <p className="text-xs text-on-surface-variant leading-relaxed">{n.message}</p>
                      </div>
                    ))
                 ) : (
                    <div className="px-6 py-8 text-center text-sm text-on-surface-variant font-medium">No notifications</div>
                 )}
               </div>
            </div>
          )}
        </div>
        <ProfileMenu />
      </div>
    </header>
  );
};
