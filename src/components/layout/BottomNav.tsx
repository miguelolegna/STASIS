import React from 'react';
import { LayoutDashboard, Plus, RefreshCcw } from 'lucide-react';

export const BottomNav = ({ currentView, setView }: any) => (
  <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
    <div className="bg-[#04233D] border border-white/10 p-2 rounded-full flex items-center gap-2 shadow-2xl backdrop-blur-xl">
      <button 
        onClick={() => setView('dashboard')}
        className={`p-4 rounded-full transition-all ${currentView === 'dashboard' ? 'bg-[#0A71CD] text-white' : 'text-slate-500 hover:text-white'}`}
      >
        <LayoutDashboard size={20} />
      </button>

      <button 
        onClick={() => setView('add')}
        className={`p-5 rounded-full bg-[#0A71CD] text-white shadow-lg shadow-blue-900/40 hover:scale-110 active:scale-95 transition-all`}
      >
        <Plus size={28} strokeWidth={3} />
      </button>

      <button 
        onClick={() => window.location.reload()}
        className="p-4 rounded-full text-slate-500 hover:text-white transition-all"
      >
        <RefreshCcw size={20} />
      </button>
    </div>
  </nav>
);