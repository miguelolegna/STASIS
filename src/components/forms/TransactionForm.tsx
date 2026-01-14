import { useState } from 'react';
import { Landmark, Wallet, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

export const TransactionForm = ({ isOpen, onClose, onSave }: any) => {
  const [form, setForm] = useState({ 
    desc: '', 
    amount: '', 
    type: 'expense', 
    category: 'daily',
    source: 'bank' 
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const categories = {
    expense: [
      { id: 'daily', label: 'Diário 🛒' },
      { id: 'subscription', label: 'Despesa 🔄' },
      { id: 'extras', label: 'Outro⚡' },    // Descrição obrigatória
      { id: 'withdrawal', label: 'Levantamento 🏧' },
      { id: 'savings', label: 'Poupança 💰' },
      { id: 'investment', label: 'Investimento 📈' }
    ],
    income: [
      { id: 'extra', label: 'Biscate/Extra ⚡' },
      { id: 'salary', label: 'Empresa/Salário 🏢' },
      { id: 'debt_payment', label: 'Pag. Dívida 🤝' },
      { id: 'deposit', label: 'Depósito 📥' },
      { id: 'other', label: 'Outro ✨' }
    ]
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // VALIDAÇÃO LÓGICA: Descrição obrigatória para Extras
    if (form.category === 'extras' && !form.desc.trim()) {
      setError('ERRO: DESCRIÇÃO OBRIGATÓRIA PARA GASTOS EXTRA.');
      if ('vibrate' in navigator) navigator.vibrate([300, 100, 300]);
      return;
    }

    if (!form.amount || parseFloat(form.amount) <= 0) return;

    if ('vibrate' in navigator) {
      form.type === 'expense' ? navigator.vibrate([100, 50, 100]) : navigator.vibrate(50);
    }

    onSave(form);
    setForm({ desc: '', amount: '', type: 'expense', category: 'daily', source: 'bank' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="w-full max-w-lg bg-[#04233D] rounded-[3.5rem] p-8 animate-bottom-sheet border border-white/10 shadow-[0_-20px_80px_rgba(10,113,205,0.2)]">
        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="flex gap-3 p-1.5 bg-black/40 rounded-[2rem]">
            <button 
              type="button" 
              onClick={() => setForm({...form, type: 'expense', category: 'daily'})}
              className={`flex-1 py-4 rounded-[1.5rem] flex items-center justify-center gap-2 text-[11px] font-black uppercase transition-all ${form.type === 'expense' ? 'bg-red-600 text-white' : 'text-slate-500'}`}
            >
              <ArrowDownCircle size={18} /> Saída
            </button>
            <button 
              type="button" 
              onClick={() => setForm({...form, type: 'income', category: 'extra'})}
              className={`flex-1 py-4 rounded-[1.5rem] flex items-center justify-center gap-2 text-[11px] font-black uppercase transition-all ${form.type === 'income' ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}
            >
              <ArrowUpCircle size={18} /> Entrada
            </button>
          </div>

          <div className="relative">
            <input 
              type="number" step="0.01" placeholder="0.00" autoFocus
              className="w-full bg-transparent text-center text-7xl font-bold py-4 text-white outline-none"
              value={form.amount} onChange={e => setForm({...form, amount: e.target.value})}
              required
            />
            <span className="absolute right-4 bottom-8 text-2xl text-slate-600 font-black">€</span>
          </div>

          <div className="flex gap-2 justify-center">
            <button 
              type="button" onClick={() => setForm({...form, source: 'bank'})}
              className={`px-6 py-3 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase transition-all border ${form.source === 'bank' ? 'bg-white text-black border-white' : 'border-white/10 text-slate-500'}`}
            >
              <Landmark size={14} /> Banco
            </button>
            <button 
              type="button" onClick={() => setForm({...form, source: 'cash'})}
              className={`px-6 py-3 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase transition-all border ${form.source === 'cash' ? 'bg-white text-black border-white' : 'border-white/10 text-slate-500'}`}
            >
              <Wallet size={14} /> Carteira
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {categories[form.type as keyof typeof categories].map(cat => (
              <button
                key={cat.id} type="button"
                onClick={() => setForm({...form, category: cat.id})}
                className={`py-4 rounded-2xl text-[10px] font-black uppercase border transition-all ${form.category === cat.id ? 'bg-[#0A71CD] border-[#0A71CD] text-white' : 'border-white/5 bg-white/5 text-slate-400'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <input 
              type="text" 
              placeholder={form.category === 'extras' ? "DESCRIÇÃO OBRIGATÓRIA (LUNCH, COMPONENTE...)" : "NOTAS DE AUDITORIA..."}
              className={`w-full bg-black/40 p-5 rounded-2xl text-white outline-none border text-xs uppercase font-bold tracking-widest transition-all ${form.category === 'extras' && !form.desc ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-primary-blue'}`}
              value={form.desc} onChange={e => setForm({...form, desc: e.target.value})}
            />
            {error && <p className="text-[9px] text-red-500 font-black text-center animate-pulse">{error}</p>}
          </div>

          <button type="submit" className="w-full py-6 bg-[#0A71CD] rounded-[2rem] font-black text-lg shadow-xl shadow-blue-600/20 active:scale-95 transition-all">
            CONFIRMAR REGISTO
          </button>
          
          <button onClick={onClose} type="button" className="w-full text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
            Abortar Protocolo
          </button>
        </form>
      </div>
    </div>
  );
};