import { Plus, Wallet, Landmark } from 'lucide-react';

export const BalanceCard = ({ stats, onAdd }: { stats: any, onAdd: () => void }) => (
  <section className="relative px-6 py-8 rounded-[3rem] bg-gradient-to-br from-[#0A71CD] to-[#03457a] shadow-2xl overflow-hidden group">
    {/* SPARKLINE SVG - Representação visual da erosão de capital */}
    <div className="absolute inset-0 opacity-20 pointer-events-none">
      <svg viewBox="0 0 140 50" className="w-full h-full">
        <polyline fill="none" stroke="white" strokeWidth="2" points={stats.chartPoints} strokeLinejoin="round" />
      </svg>
    </div>

    <div className="relative z-10">
      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Quota Diária (Total)</p>
          <h2 className="text-5xl font-bold tracking-tighter text-white">
            {stats.dailyAllowance.toFixed(2)}<span className="text-xl ml-1 opacity-50">€</span>
          </h2>
        </div>
        <button onClick={onAdd} className="p-4 bg-white/20 hover:bg-white/30 rounded-2xl backdrop-blur-md transition-all active:scale-90">
          <Plus size={24} className="text-white" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Coluna 1: Liquidez Digital */}
        <div className="bg-black/20 p-4 rounded-3xl border border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-1 text-white/40">
            <Landmark size={12} />
            <span className="text-[9px] uppercase font-black">Banco</span>
          </div>
          <p className="text-lg font-bold text-white">{stats.balance.toFixed(2)}€</p>
        </div>

        {/* Coluna 2: Liquidez Física */}
        <div className="bg-black/20 p-4 rounded-3xl border border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-1 text-white/40">
            <Wallet size={12} />
            <span className="text-[9px] uppercase font-black">Carteira</span>
          </div>
          <p className="text-lg font-bold text-emerald-400">{stats.cashBalance.toFixed(2)}€</p>
        </div>

        {/* Linha 2: Projeção de Sobrevivência (Full Width) */}
        <div className="col-span-2 bg-white/10 p-4 rounded-3xl border border-white/10 flex justify-between items-center">
          <span className="text-[10px] uppercase font-black text-white/60 tracking-widest">Erosão Total em</span>
          <p className={`text-xl font-bold ${stats.daysUntilBroke < 7 ? 'text-orange-400' : 'text-white'}`}>
            {stats.daysUntilBroke} DIAS
          </p>
        </div>
      </div>
    </div>
  </section>
);