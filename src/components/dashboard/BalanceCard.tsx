import React from 'react';
import { Plus } from 'lucide-react';

export const BalanceCard = ({ stats, onAdd }: { stats: any, onAdd: () => void }) => (
  <section className="relative px-6 py-10 rounded-[3rem] blue-gradient shadow-2xl shadow-blue-900/40 overflow-hidden group">
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
    
    <div className="flex justify-between items-start mb-10">
      <div>
        <p className="text-white/60 text-xs font-medium mb-1">Plafond Diário</p>
        <h2 className="text-5xl font-bold tracking-tighter text-white">
          {stats.dailyAllowance.toFixed(2)}<span className="text-xl ml-1 opacity-50">€</span>
        </h2>
      </div>
      <button 
        onClick={onAdd}
        className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl backdrop-blur-md transition-all active:scale-90"
      >
        <Plus size={24} className="text-white" />
      </button>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="bg-black/10 p-4 rounded-3xl backdrop-blur-sm">
        <p className="text-white/40 text-[10px] uppercase font-bold mb-1">Saldo Total</p>
        <p className="text-xl font-bold">{stats.balance.toFixed(2)}€</p>
      </div>
      <div className="bg-black/10 p-4 rounded-3xl backdrop-blur-sm">
        <p className="text-white/40 text-[10px] uppercase font-bold mb-1">Dias Restantes</p>
        <p className="text-xl font-bold">{stats.remainingDays}d</p>
      </div>
    </div>
  </section>
);