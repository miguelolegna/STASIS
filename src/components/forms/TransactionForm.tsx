// src/components/forms/TransactionForm.tsx
import { useState } from 'react';

export const TransactionForm = ({ isOpen, onClose, onSave }: any) => {
  const [form, setForm] = useState({ desc: '', amount: '', type: 'expense', category: 'daily' });

  if (!isOpen) return null;

  const triggerHaptic = (type: string) => {
    if (!('vibrate' in navigator)) return;
    // C. FEEDBACK HÁPTICO
    if (type === 'expense') navigator.vibrate([100, 50, 100]); // Punição
    else if (type === 'savings') navigator.vibrate([50, 30, 50, 30, 100]); // Recompensa (melódico)
    else navigator.vibrate(50); // Confirmação simples
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    triggerHaptic(form.type);
    onSave(form);
    setForm({ desc: '', amount: '', type: 'expense', category: 'daily' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#04233D] rounded-t-[3.5rem] p-10 animate-bottom-sheet">
        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-2 p-1.5 bg-black/20 rounded-3xl">
            {['expense', 'income', 'savings'].map(t => (
              <button 
                key={t} type="button" 
                onClick={() => setForm({...form, type: t, category: t === 'income' ? 'biscate' : t === 'savings' ? 'investment' : 'daily'})}
                className={`flex-1 py-4 rounded-2xl text-[10px] font-bold uppercase transition-all ${form.type === t ? 'bg-[#0A71CD] text-white' : 'text-slate-500'}`}
              >
                {t === 'expense' ? 'Saída' : t === 'income' ? 'Entrada' : 'Poupar'}
              </button>
            ))}
          </div>
          
            <div className="flex items-baseline justify-center w-full text-white py-8">
              <input 
                type="number" 
                step="0.01" 
                placeholder="0.00" 
                autoFocus
                className="bg-transparent text-right text-6xl font-bold outline-none p-0"
                /* O segredo está aqui: a largura aumenta conforme escreves */
                style={{ 
                  width: form.amount ? `${form.amount.length + 0.5}ch` : '4.5ch',
                  minWidth: '1ch'
                }}
                value={form.amount} 
                onChange={e => setForm({...form, amount: e.target.value})}
              />
              <span className="text-6xl font-bold ml-1">€</span>
            </div>
          <button type="submit" className="w-full py-6 bg-[#0A71CD] rounded-[2rem] font-bold text-lg shadow-xl active:scale-95 transition-all">
            Executar Operação
          </button>
          <button onClick={onClose} type="button" className="w-full text-slate-500 font-bold py-2">Cancelar</button>
        </form>
      </div>
    </div>
  );
};