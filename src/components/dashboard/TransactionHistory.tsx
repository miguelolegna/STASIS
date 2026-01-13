import React from 'react';
import { ArrowDownLeft, ArrowUpRight, PiggyBank, Trash2 } from 'lucide-react';

const icons = {
  expense: <ArrowDownLeft className="text-red-400" size={18} />,
  income: <ArrowUpRight className="text-emerald-400" size={18} />,
  savings: <PiggyBank className="text-blue-400" size={18} />
};

export const TransactionHistory = ({ transactions, onDelete }: any) => (
  <section className="mt-8 px-2">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-bold">Histórico</h3>
      <span className="text-blue-400 text-xs font-bold">Ver Tudo</span>
    </div>

    <div className="space-y-3">
      {transactions.map((t: any) => (
        <div key={t.id} className="glass-card p-4 rounded-[2rem] flex items-center gap-4 group">
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
            {icons[t.type as keyof typeof icons]}
          </div>
          
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-100">{t.desc}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase">{t.category}</p>
          </div>

          <div className="text-right flex items-center gap-3">
            <p className={`font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-slate-100'}`}>
              {t.type === 'expense' ? '-' : '+'}{t.amount.toFixed(2)}€
            </p>
            <button 
              onClick={() => onDelete(t.id)}
              className="opacity-0 group-hover:opacity-100 p-2 hover:text-red-500 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
);