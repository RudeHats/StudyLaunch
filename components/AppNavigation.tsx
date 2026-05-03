'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface NavigationProps {
  activePage: 'navigator' | 'oracle' | 'loansense' | 'dashboard';
  setActivePage: (page: 'navigator' | 'oracle' | 'loansense' | 'dashboard') => void;
}

export default function Navigation({ activePage, setActivePage }: NavigationProps) {
  const navItems = [
    { id: 'navigator', label: 'Navigator', icon: '🧭' },
    { id: 'oracle', label: 'Oracle', icon: '🔮' },
    { id: 'loansense', label: 'LoanSense', icon: '💰' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  ] as const;

  return (
    <nav className="bg-[#0f0a2e] border-b border-[#1a1145] px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-[#6d28d9] to-[#8b5cf6] rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-white font-serif text-xl font-bold">Meridian</h1>
          <p className="text-[#8b5cf6] text-xs">x Poonawalla Fincorp</p>
        </div>
      </div>

      <div className="flex gap-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activePage === item.id
                ? 'bg-[#6d28d9] text-white'
                : 'text-[#8b5cf6] hover:bg-[#1a1145]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
