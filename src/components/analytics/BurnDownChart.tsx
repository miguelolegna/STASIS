export const BurnDownChart = ({ lines }: { lines: { ideal: string, real: string } }) => (
  <div className="bg-midnight-surface p-6 rounded-[2.5rem] border border-white/5 space-y-4">
    <header className="flex justify-between items-center">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
        Erosão de Capital (Burn-down)
      </h3>
      <div className="flex gap-4">
        <div className="flex items-center gap-1">
          <div className="w-2 h-0.5 bg-white/20" />
          <span className="text-[8px] font-bold text-slate-600">IDEAL</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-0.5 bg-primary-blue" />
          <span className="text-[8px] font-bold text-primary-blue">REAL</span>
        </div>
      </div>
    </header>

    <div className="relative h-48 w-full">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
        {/* Linha Ideal (Tracejada) */}
        <polyline
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
          strokeDasharray="2"
          points={lines.ideal}
        />
        {/* Linha Real */}
        <polyline
          fill="none"
          stroke="#0A71CD"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={lines.real}
          className="drop-shadow-[0_0_8px_rgba(10,113,205,0.5)]"
        />
      </svg>
    </div>
    
    <p className="text-[9px] text-slate-600 text-center italic">
      Eixo X: Dias do Mês | Eixo Y: Liquidez Disponível
    </p>
  </div>
);