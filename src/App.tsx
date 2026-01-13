// src/App.tsx
import { useState, useEffect } from 'react';
import { auth } from './lib/firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { useFinance } from './hooks/useFinance';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { BalanceCard } from './components/dashboard/BalanceCard';
import { TransactionHistory } from './components/dashboard/TransactionHistory';
import { TransactionForm } from './components/forms/TransactionForm';
import { DebtStats } from './components/dashboard/DebtStats';
import { Settings2, RefreshCcw } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { transactions, debtStatus, stats, loading, updateStartBalance } = useFinance(user);

  useEffect(() => {
    if (!auth) return;
    signInAnonymously(auth).catch(console.error);
    return onAuthStateChanged(auth, setUser);
  }, []);

  const handleFixBalance = () => {
    const newVal = prompt("Introduza o saldo atual real (em €):", stats.balance.toString());
    if (newVal !== null) {
      const amount = parseFloat(newVal);
      // Cálculo: Para o saldo atual ser X, o startBalance deve ser X - (Entradas - Saídas)
      // Simplificamos: ajustamos o startBalance para compensar a diferença
      updateStartBalance(amount); 
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-blue-500"><RefreshCcw className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-32">
      <Header isCritical={stats.isCritical} />
      
      <main className="max-w-md mx-auto p-4 space-y-6">
        <div className="flex justify-end px-2">
          <button 
            onClick={handleFixBalance}
            className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 hover:text-blue-400 transition-colors"
          >
            <Settings2 size={12} /> Corrigir Valor Atual
          </button>
        </div>

        <div className="animate-slide-up space-y-6">
          <BalanceCard stats={stats} onAdd={function (): void {
            throw new Error('Function not implemented.');
          } } />
          <DebtStats debt={debtStatus} extra={stats.totalExtra} />
          <TransactionHistory transactions={transactions} />
        </div>
      </main>

      <TransactionForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        debtRemaining={debtStatus.remaining} 
      />

      <BottomNav 
        currentView={isFormOpen ? 'add' : 'dashboard'} 
        setView={(v: string) => setIsFormOpen(v === 'add')} 
      />
    </div>
  );
}