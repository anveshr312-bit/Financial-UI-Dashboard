import React, { useRef, useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { LogOut, Sun, Moon, ShieldCheck, UserCircle2 } from 'lucide-react';
import { Role } from '../types';

export const ProfileMenu = () => {
  const { role, setRole, theme, setTheme } = useDashboard();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const userName = 'Anvesh Rathore';

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen]);

  const roleOptions: { value: Role; label: string }[] = [
    { value: 'viewer', label: 'Viewer' },
    { value: 'admin', label: 'Admin' },
  ];

  return (
    <div className="relative h-full flex items-center" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 pl-4 border-l border-outline-variant/30 hover:opacity-80 transition-opacity"
      >
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold leading-none text-on-surface">{userName}</p>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-0.5">{role}</p>
        </div>
        <div className="h-9 w-9 rounded-full ring-2 ring-primary-fixed flex items-center justify-center bg-primary-container text-white font-bold text-sm">
          {userName.charAt(0)}
        </div>
      </button>

      {isOpen && (
        <div className="bg-surface shadow-2xl absolute right-0 top-[calc(100%+12px)] z-50 w-[290px] rounded-2xl p-4 border border-outline-variant/20">
          <div className="flex items-center gap-3 border-b border-outline-variant/20 pb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-container text-on-primary">
              <UserCircle2 size={22} />
            </div>
            <div>
              <p className="m-0 text-sm font-semibold text-on-surface">{userName}</p>
              <p className="m-0 text-[12px] text-on-surface-variant">Finance Dashboard</p>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                <ShieldCheck size={13} />
                Role
              </div>
              <div className="grid grid-cols-2 gap-2">
                {roleOptions.map((option) => {
                  const isActive = role === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setRole(option.value)}
                      className={`rounded-xl px-3 py-2 text-sm font-bold transition-colors ${
                        isActive
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-surface-container-low flex items-center justify-between rounded-xl px-4 py-3">
              <div>
                <p className="m-0 text-sm font-bold text-on-surface">Dark mode</p>
                <p className="m-0 text-[10px] text-on-surface-variant uppercase tracking-widest mt-0.5">Toggle Theme</p>
              </div>
              <button
                type="button"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className={`flex h-7 w-12 items-center rounded-full p-1 transition-colors ${
                  theme === 'dark' ? 'justify-end bg-primary-container' : 'justify-start bg-surface-variant'
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-primary">
                  {theme === 'dark' ? <Moon size={12} /> : <Sun size={12} />}
                </span>
              </button>
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-surface-container-low px-4 py-3 text-sm font-bold text-error hover:bg-error-container transition-colors mt-2"
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
