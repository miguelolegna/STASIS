import { LogOut, ShieldCheck, ShieldAlert } from 'lucide-react';

export const Header = ({ isCritical, onLogout }: { isCritical: boolean, onLogout: () => void }) => (
  <header className="p-6 flex justify-between items-center bg-[#021729]/80 backdrop-blur-md sticky top-0 z-40">
    <div className="flex flex-col">
      <h1 className="text-2xl font-black tracking-[0.3em] uppercase text-white">
        STASIS
      </h1>
      <div className="flex items-center gap-2">
        {isCritical ? <ShieldAlert size={12} className="text-red-500" /> : <ShieldCheck size={12} className="text-emerald-500" />}
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter italic">
          {isCritical ? 'Défice Ativo' : 'Sistema Estável'}
        </span>
      </div>
    </div>

    <button 
      onClick={onLogout}
      className="p-3 bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded-2xl transition-all border border-white/5"
      title="Encerrar Protocolo"
    >
      <LogOut size={18} />
    </button>
  </header>
);