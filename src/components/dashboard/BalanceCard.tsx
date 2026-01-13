// src/components/dashboard/BalanceCard.tsx
import { Plus } from 'lucide-react';

export const BalanceCard = ({ stats, onAdd }: { stats: any, onAdd: () => void }) => (
  <section className="relative px-6 py-10 rounded-[3rem] bg-gradient-to-br from-[#0A71CD] to-[#03457a] shadow-2xl overflow-hidden group">
    {/* B. SPARKLINE SVG */}
    <div className="absolute inset-0 opacity-20 pointer-events-none">
      <svg viewBox="0 0 140 50" className="w-full h-full">
        <polyline fill="none" stroke="white" strokeWidth="2" points={stats.chartPoints} strokeLinejoin="round" />
      </svg>
    </div>

    <div className="relative z-10">
      <div className="flex justify-between items-start mb-10">
        <div>
          <p className="text-white/60 text-xs font-medium mb-1 uppercase tracking-widest">Quota Diária</p>
          <h2 className="text-5xl font-bold tracking-tighter text-white">
            {stats.dailyAllowance.toFixed(2)}<span className="text-xl ml-1 opacity-50">€</span>
          </h2>
        </div>
        <button onClick={onAdd} className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl backdrop-blur-md transition-all active:scale-90">
          <Plus size={24} className="text-white" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/10 p-4 rounded-3xl backdrop-blur-sm border border-white/5">
          <p className="text-white/40 text-[10px] uppercase font-bold mb-1">Status Balance</p>
          <p className="text-xl font-bold">{stats.balance.toFixed(2)}€</p>
        </div>
        <div className="bg-black/10 p-4 rounded-3xl backdrop-blur-sm border border-white/5">
          <p className="text-white/40 text-[10px] uppercase font-bold mb-1">Dias Restantes de Sobrevivência</p>
          <p className={`text-xl font-bold ${stats.daysUntilBroke < 7 ? 'text-red-400' : 'text-white'}`}>
            {stats.daysUntilBroke} Dias
          </p>
        </div>
      </div>
    </div>
  </section>
);