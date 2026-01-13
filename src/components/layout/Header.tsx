// src/components/layout/Header.tsx
export const Header = ({ isCritical }: { isCritical: boolean }) => (
  <nav className="p-6 pt-12 border-b border-white/5 sticky top-0 bg-slate-950/80 backdrop-blur-xl z-20">
    <div className="max-w-md mx-auto flex justify-between items-center">
      <h1 className="text-xl font-black italic tracking-tighter">AUDITOR PRO</h1>
      <div className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors ${
        isCritical ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-blue-500/10 border-blue-500 text-blue-400'
      }`}>
        {isCritical ? 'DÉFICE CRÍTICO' : 'FLUXO ESTÁVEL'}
      </div>
    </div>
  </nav>
);