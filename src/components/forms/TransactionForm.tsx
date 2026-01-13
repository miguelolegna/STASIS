export const TransactionForm = ({ isOpen, onClose, onSave }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#04233D] rounded-t-[3.5rem] p-10 animate-bottom-sheet shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
        
        <form onSubmit={onSave} className="space-y-6">
          {/* Seletor de Tipo com Pills */}
          <div className="flex gap-2 p-1.5 bg-black/20 rounded-3xl">
            {['expense', 'income', 'savings'].map(type => (
              <button
                key={type}
                type="button"
                className={`flex-1 py-4 rounded-2xl text-[10px] font-bold uppercase transition-all ${
                  /* Lógica de active aqui */ ''
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <input 
            type="number" 
            placeholder="0.00€" 
            className="w-full bg-transparent text-center text-6xl font-bold py-8 focus:outline-none"
            autoFocus
          />

          <input 
            type="text" 
            placeholder="O que compraste?" 
            className="w-full bg-white/5 p-5 rounded-2xl focus:ring-2 ring-blue-500 outline-none"
          />

          <button className="w-full py-6 bg-[#0A71CD] rounded-[2rem] font-bold text-lg shadow-xl shadow-blue-500/20 active:scale-95 transition-transform">
            Confirmar Registo
          </button>
          
          <button onClick={onClose} type="button" className="w-full text-slate-500 font-bold py-2">
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};