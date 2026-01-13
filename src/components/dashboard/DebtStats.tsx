// src/components/dashboard/DebtStats.tsx
import { ShieldAlert, TrendingUp } from 'lucide-react';

export const DebtStats = ({ debt, extra }: { debt: any, extra: number }) => (
  <div className="grid grid-cols-2 gap-3">
    <div className="bg-[#04233D]/50 border border-white/5 p-5 rounded-2xl flex flex-col justify-between">
      <ShieldAlert size={16} className="text-orange-500 mb-3" />
      <div>
        <span className="block text-[9px] text-slate-500 font-bold uppercase mb-1">Divida Jean</span>
        <p className="text-xl font-mono font-bold text-white">{debt.remaining.toFixed(2)}€</p>
      </div>
    </div>
    
    <div className="bg-[#04233D]/50 border border-white/5 p-5 rounded-2xl flex flex-col justify-between">
      <TrendingUp size={16} className="text-[#0A71CD] mb-3" />
      <div>
        <span className="block text-[9px] text-slate-500 font-bold uppercase mb-1">Ganhos Extra</span>
        <p className="text-xl font-mono font-bold text-[#0A71CD]">+{extra.toFixed(2)}€</p>
      </div>
    </div>
  </div>
);